import { Button, Col, Container, Row, Spinner } from "react-bootstrap";
import Title from "../Title";
import Job from "../Job";
import GralTools from "../tools/GralTools";
import Events from "../Events";
import Description from "../Description";
import General from "../General";
import { useSearchParams } from "react-router-dom";
import dailyReportStore from "../../stores/dailyReportStore";
import { useEffect, useRef } from "react";
import useManpowerStore from "../../stores/useManpowerStore";
import useEquipmentStore from "../../stores/useEquipmentStore";
import useToolStore from "../../stores/useToolStore";
import useRentalsStore from "../../stores/useRentalsStore";
import useDumpsterStore from "../../stores/useDumpsterStore";
import { useContextStore } from "../../stores/useContextStore";
import { DRRental, DRTool } from "../../types";
import { useDailyReport, useSaveDailyReport } from "../../hooks/useDailyReport";
import { useReactToPrint } from "react-to-print";
import "../../styles/buttons.css";

function Home() {
  const [searchParams] = useSearchParams();
  const setIds = useContextStore((s) => s.setIds);
  const { dailyReportId, jobId, isLoaded, setIsLoaded } = useContextStore();

  const { data: report, isLoading } = useDailyReport(
    dailyReportId ? Number(dailyReportId) : 0
  );

  const { mutate, isPending: isSaving } = useSaveDailyReport();

  const {
    setFullDailyReportData,
    dailyReportData,
    reset: resetDailyReport,
  } = dailyReportStore();

  const {
    setFullAssignmentData,
    assignedEmployees,
    reset: resetManpower,
  } = useManpowerStore();

  const {
    setFullEquipmentData,
    assignedEquipments,
    reset: resetEquipment,
  } = useEquipmentStore();

  const { setFullToolData, assignedTools, reset: resetTools } = useToolStore();
  const {
    setFullRentalData,
    assignedRentals,
    reset: resetRentals,
  } = useRentalsStore();
  const {
    fillTableFromApi,
    assignedDumpsters,
    reset: resetDumpsters,
  } = useDumpsterStore();

  useEffect(() => {
    const jobId = searchParams.get("jobId");
    const dailyReportId = searchParams.get("dailyReportId");
    console.log("Setting IDs from URL params:", {
      jobId,
      dailyReportId,
    });
    if (jobId || dailyReportId) {
      const jId = Number(jobId);
      const dId = Number(dailyReportId);
      if (!isNaN(jId) || !isNaN(dId)) {
        setIds(jId, dId);
      }
    }
  }, [searchParams, setIds]);

  useEffect(() => {
    if (report && !isLoaded) {
      setFullDailyReportData(report);
      setFullAssignmentData(report.employees);
      setFullEquipmentData(report.equipments);
      const dbTools = report.tools.map((tool: DRTool) => ({
        ...tool,
        temporalId:
          tool.temporalId || `db-${tool.drToolId || crypto.randomUUID()}`,
      }));
      setFullToolData(dbTools);
      const rentalsWithIds = report.rentals.map((rental: DRRental) => ({
        ...rental,
        temporalId:
          rental.temporalId ||
          `db-${rental.drRentalsId || crypto.randomUUID()}`,
      }));
      setFullRentalData(rentalsWithIds);
      fillTableFromApi(report.dumpsters);
      setIsLoaded(true);
    }
  }, [report]);

  const handleSave = () => {
    const updatedReport = {
      ...dailyReportData, // Lo que ya teníamos (fecha, foreman, etc.)
      employees: assignedEmployees,
      equipments: assignedEquipments,
      rentals: assignedRentals,
      tools: assignedTools,
      dumpsters: assignedDumpsters, // Asegúrate de que aquí ya venga mapeado si es necesario
    };

    setFullDailyReportData(updatedReport);

    console.log("Saving daily report:", updatedReport, "for jobId:", jobId);
    mutate({
      reportData: updatedReport!,
      jobId: jobId!,
    });
  };

  const handleReset = () => {
    resetDailyReport();
    resetManpower();
    resetEquipment();
    resetTools();
    resetRentals();
    resetDumpsters();
    setIsLoaded(false);
    setIds(null, null);
  };

  // 1. Creamos la referencia que apuntará a este mismo componente (o a un div interno)
  const componenteRef = useRef(null);

  // 2. Definimos la lógica de impresión
  const handlePrint = useReactToPrint({
    contentRef: componenteRef,
    documentTitle: "DR",
  });

  if (isLoading) return <p>Cargando datos del reporte...</p>;

  return (
    <>
      <Container ref={componenteRef} className="print-container">
        <Row className="justify-content-md-center">
          <Title onPrint={handlePrint} />
        </Row>
        <Row>
          <Job />
        </Row>
        <Row className="justify-content-md-center">
          <Description />
        </Row>

        <Row>
          <General />
        </Row>

        <Row>
          <Col>
            <GralTools />
          </Col>
        </Row>
        <Row>
          <Col>
            <Events />
          </Col>
        </Row>
        <Row className="justify-content-md-center">
          <Col>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                height: "100px",
              }}
            >
              <Button
                style={{
                  width: "200px",
                  height: "60px",
                  fontWeight: "bold",
                  fontSize: "25px",
                  marginRight: "20px",
                }}
                onClick={() => {
                  handleReset();
                  window.location.href = `https://ckarlosdev.github.io/binder-webapp/#/binder/${jobId}`;
                }}
                variant="outline-primary"
                className="no-print"
              >
                Back
              </Button>
              <Button
                style={{
                  width: "200px",
                  height: "60px",
                  fontWeight: "bold",
                  fontSize: "25px",
                  marginLeft: "20px",
                }}
                variant="outline-primary"
                onClick={() => {
                  handleSave();
                }}
                disabled={isSaving}
                className="no-print"
              >
                {isSaving ? (
                  <>
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                      style={{ marginRight: "10px" }}
                    />
                    Saving...
                  </>
                ) : (
                  "Save"
                )}
              </Button>
            </div>
          </Col>
        </Row>
      </Container>
      {isSaving && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(255, 255, 255, 0.7)",
            zIndex: 9999,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Spinner
            animation="border"
            variant="primary"
            style={{ width: "4rem", height: "4rem" }}
          />
          <h4 className="mt-3">Saving Report...</h4>
        </div>
      )}
    </>
  );
}

export default Home;
