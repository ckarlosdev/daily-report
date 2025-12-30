import {
  Button,
  Card,
  Col,
  Container,
  Modal,
  Row,
  Tab,
  Table,
  Tabs,
} from "react-bootstrap";
import useDumpsterStore from "../../stores/useDumpsterStore";
import { DrDumpster } from "../../types";

type Props = {};

function ModalDumpsters({}: Props) {
  const {
    showModalDumpster,
    setShowModalDumpster,
    tableData,
    setTableData,
    getApiPayload,
  } = useDumpsterStore();

  const editableColumns = ["Concrete", "Metal", "C&D"];

  const calculateSubtotalsClean = () => {
    return tableData.reduce((acc, row) => {
      const { type, Concrete, Metal, "C&D": CD } = row;

      if (!acc[type]) {
        acc[type] = { Concrete: 0, Metal: 0, "C&D": 0 };
      }

      acc[type].Concrete += Concrete;
      acc[type].Metal += Metal;
      acc[type]["C&D"] += CD;

      return acc;
    }, {});
  };

  const totalDisposal = calculateSubtotalsClean().Disposal || {
    Concrete: 0,
    Metal: 0,
    "C&D": 0,
  };
  const totalExternal = calculateSubtotalsClean().External || {
    Concrete: 0,
    Metal: 0,
    "C&D": 0,
  };

  const totalConcrete = totalDisposal.Concrete + totalExternal.Concrete;
  const totalMetal = totalDisposal.Metal + totalExternal.Metal;
  const totalCD = totalDisposal["C&D"] + totalExternal["C&D"];

  const handleApiPayload = (): void => {
    const payload: DrDumpster[] = [];

    tableData.forEach((row) => {
      ["Concrete", "Metal", "C&D"].forEach((col) => {
        // Usamos 'as keyof typeof row' para que TS sepa que 'col' es una llave válida
        const value = row[col as keyof typeof row];

        if (typeof value === "number" && value > 0) {
          payload.push({
            sourceDumpster: row.type,
            sizeDumpster: row.size,
            typeDumpster: col,
            quantity: value,
            drDumpstersId: null,
          });
        }
      });
    });
    getApiPayload(payload);
  };

  return (
    <>
      <Modal
        show={showModalDumpster}
        onHide={() => setShowModalDumpster(false)}
      >
        <Modal.Header closeButton className="justify-content-center">
          <Modal.Title className="w-100 text-center">
            <img
              src="../src/assets/dumpster.png"
              alt="Dumpster Icon"
              className="me-2"
              style={{ height:"50px" }}
            />
            Dumpsters
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Container>
            <Row>
              <Col>
                <Card style={{ marginBottom: "2px" }}>
                  <Card.Body>
                    <Tabs
                      defaultActiveKey="creativeDisposal"
                      id="uncontrolled-tab-example"
                      className="mb-3"
                      justify
                    >
                      <Tab
                        eventKey="creativeDisposal"
                        title="Creative Disposal"
                      >
                        <Table
                          striped
                          bordered
                          hover
                          style={{ textAlign: "center" }}
                        >
                          <thead>
                            <tr>
                              <th></th>
                              {editableColumns.map((header) => (
                                <th key={header}>{header}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {tableData.map(
                              (row, rowIndex) =>
                                row.type === "Disposal" && (
                                  <tr key={row.size}>
                                    <td style={{ fontWeight: "bold" }}>
                                      {row.size}
                                    </td>
                                    {editableColumns.map((columnName) => (
                                      <td key={columnName}>
                                        <input
                                          type="number"
                                          value={
                                            row[columnName]
                                              ? row[columnName].toString()
                                              : "0"
                                          }
                                          onChange={(e) =>
                                            setTableData(
                                              rowIndex,
                                              columnName,
                                              e.target.value
                                            )
                                          }
                                          style={{
                                            width: "60px",
                                            textAlign: "center",
                                          }}
                                        />
                                      </td>
                                    ))}
                                  </tr>
                                )
                            )}
                          </tbody>
                        </Table>
                        <Row>
                          <Col className="text-end">
                            <span className="me-2">Subtotals:</span>
                          </Col>
                          <Col>
                            Concrete:{" "}
                            {calculateSubtotalsClean().Disposal.Concrete}
                          </Col>
                          <Col>
                            Metal: {calculateSubtotalsClean().Disposal.Metal}
                          </Col>
                          <Col>
                            C&D: {calculateSubtotalsClean().Disposal["C&D"]}
                          </Col>
                        </Row>
                      </Tab>
                      <Tab eventKey="external" title="External">
                        <Table
                          striped
                          bordered
                          hover
                          style={{ textAlign: "center" }}
                        >
                          <thead>
                            <tr>
                              <th></th>
                              {editableColumns.map((header) => (
                                <th key={header}>{header}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {tableData.map(
                              (row, rowIndex) =>
                                row.type === "External" && (
                                  <tr key={row.size}>
                                    <td style={{ fontWeight: "bold" }}>
                                      {row.size}
                                    </td>
                                    {editableColumns.map((columnName) => (
                                      <td key={columnName}>
                                        <input
                                          type="number"
                                          value={
                                            row[columnName]
                                              ? row[columnName].toString()
                                              : "0"
                                          }
                                          onChange={(e) =>
                                            setTableData(
                                              rowIndex,
                                              columnName,
                                              e.target.value
                                            )
                                          }
                                          style={{
                                            width: "60px",
                                            textAlign: "center",
                                          }}
                                        />
                                      </td>
                                    ))}
                                  </tr>
                                )
                            )}
                          </tbody>
                          {/* Puedes calcular y mostrar el total aquí si es necesario */}
                          {/* <tfoot>...</tfoot> */}
                        </Table>
                        <Row>
                          <Col className="text-end">
                            <span className="me-2">Subtotals:</span>
                          </Col>
                          <Col>
                            Concrete:{" "}
                            {calculateSubtotalsClean().External.Concrete}
                          </Col>
                          <Col>
                            Metal: {calculateSubtotalsClean().External.Metal}
                          </Col>
                          <Col>
                            C&D: {calculateSubtotalsClean().External["C&D"]}
                          </Col>
                        </Row>
                      </Tab>
                    </Tabs>
                  </Card.Body>
                </Card>
              </Col>
              <Col>
                <Row>
                  <Col>
                    <Card>
                      <Card.Body>
                        <Card.Title className="text-center mb-3">
                          Totals
                        </Card.Title>
                        <Row className="fw-bold border-top pt-2">
                          <Col className="text-center">
                            <span className="me-2">Concrete:</span>
                            <span style={{ minWidth: "40px" }}>
                              {" "}
                              {totalConcrete.toLocaleString()}
                            </span>
                          </Col>
                          <Col className="text-center">
                            <span className="me-2">Metal:</span>
                            <span style={{ minWidth: "40px" }}>
                              {totalMetal.toLocaleString()}
                            </span>
                          </Col>
                          <Col className="text-center">
                            <span className="me-2">C&D:</span>
                            <span style={{ minWidth: "40px" }}>
                              {totalCD.toLocaleString()}
                            </span>
                          </Col>
                        </Row>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Container>
        </Modal.Body>
        <Modal.Footer className="justify-content-center">
          <Button
            variant="primary"
            style={{ fontWeight: "bold", fontSize: "20px", width: "150px" }}
            onClick={() => {
              setShowModalDumpster(false);
              handleApiPayload();
            }}
          >
            Ok
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ModalDumpsters;
