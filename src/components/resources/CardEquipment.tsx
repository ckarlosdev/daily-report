import { Button, Card, Col, Form, Row, Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import useEquipmentStore from "../../stores/useEquipmentStore";
import { Employee } from "../../types";
import useEmployees from "../../hooks/useEmployees";
import useRentalsStore from "../../stores/useRentalsStore";
import useDailyReportStore from "../../stores/dailyReportStore";
import useEquipments from "../../hooks/useEquipments";
import Trow from "./equipment/Trow";
import useAttachments from "../../hooks/useAttachments";

type Props = {};

function CardEquipment({}: Props) {
  const navigate = useNavigate();

  const { data: equipmentData } = useEquipments();
  const { data: attachmentsData } = useAttachments();
  const { assignedEquipments } = useEquipmentStore();
  const { assignedRentals } = useRentalsStore();
  const { data: employees } = useEmployees();
  const { dailyReportData, setDailyReportData } = useDailyReportStore();

  const equipmentTotals = assignedEquipments.reduce(
    (totals, equipment) => {
      const hourDifference =
        equipment.type === "Equipment"
          ? Number(equipment.newHour) - Number(equipment.initialHour)
          : 0;

      totals.qty += 1;
      totals.totalHours += hourDifference;
      return totals;
    },
    { qty: 0, totalHours: 0 }
  );

  const countsEquipments = assignedEquipments.reduce(
    (acc, item) => {
      if (item.type === "Equipment") {
        acc.E += 1;
      } else if (item.type === "Attachment") {
        acc.A += 1;
      }
      return acc;
    },
    { E: 0, A: 0 }
  );

  const countRentals = assignedRentals.reduce(
    (acc, item) => {
      if (item.equipmentType === "Equipment") {
        acc.E += 1;
      } else if (item.equipmentType === "Attachment") {
        acc.A += 1;
      }
      return acc;
    },
    { E: 0, A: 0 }
  );

  const equipmentTabTitle = ` E: ${countsEquipments.E + countRentals.E} - A: ${
    countsEquipments.A + countRentals.A
  } - R: ${assignedRentals.length}`;

  return (
    <div>
      <Col>
        <Card style={{ marginBottom: "2px", textAlign: "center" }}>
          <Card.Body>
            <Card.Title style={{ textAlign: "center" }}>
              <Button
                variant="secondary"
                style={{ fontWeight: "bold", width: "200px", fontSize: "" }}
                onClick={() => navigate("/equipment")}
              >
                Equipment
              </Button>
            </Card.Title>

            <Row>
              <div
                style={{
                  backgroundColor: "#ebebeb",
                  height: "250px",
                  borderRadius: "5px",
                  overflowY: "auto",
                }}
              >
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>Type</th>
                      <th>Number</th>
                      <th>Owner</th>
                      <th>Odometer</th>
                      <th>Operator</th>
                    </tr>
                  </thead>
                  <tbody>
                    {assignedEquipments.map((equipment) => {
                      let number = "";
                      let operador = "N/A";

                      if (equipment.type === "Equipment") {
                        const employee = employees?.find(
                          (emp: Employee) =>
                            emp.employeesId === equipment.employeesId
                        );

                        const equip = equipmentData?.find(
                          (eq) => eq.equipmentsId === equipment.equipmentsId
                        );

                        operador =
                          employee?.firstName + " " + employee?.lastName;
                        number = equip?.number ?? "N/A";
                      } else {
                        const attach = attachmentsData?.find(
                          (att) => att.attachmentsId === equipment.equipmentsId
                        );
                        number = attach?.number ?? "";
                      }

                      return (
                        <Trow
                          type={equipment.type}
                          number={number}
                          company={"HM Brant"}
                          newHour={equipment.newHour}
                          employees={operador}
                          key={number}
                        />
                      );
                    })}
                    {assignedRentals.map((rental) => {
                      const employee = employees?.find(
                        (emp: Employee) =>
                          emp.employeesId === rental.employeesId
                      );

                      return (
                        <tr key={rental.temporalId}>
                          <td>{rental.equipmentType}</td>
                          <td>{rental.equipmentName}</td>
                          <td>Rented</td>
                          <td>{rental.odometer}</td>
                          <td>
                            {rental?.equipmentType == "Equipment"
                              ? employee
                                ? employee?.firstName + " " + employee?.lastName
                                : "No Operator"
                              : "N/A"}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              </div>
            </Row>
            <Row>
              <Col>
                <Row>
                  <span
                    style={{
                      marginTop: "10px",
                      backgroundColor: "lightgray",
                      fontWeight: "bold",
                    }}
                  >
                    Equipment totals
                  </span>
                </Row>
                <Row>
                  <Col sm={3}>
                    <Form.Label htmlFor="inputManpowerQty">Qty</Form.Label>
                    <Form.Control
                      type="text"
                      readOnly
                      id="inputManpowerQty"
                      value={equipmentTabTitle ?? ""}
                      style={{ fontWeight: "bold", textAlign: "center" }}
                    />
                  </Col>
                  <Col sm={3}>
                    <Form.Label htmlFor="inputManpowerHours">Hours</Form.Label>
                    <Form.Control
                      type="text"
                      readOnly
                      id="inputManpowerHours"
                      value={equipmentTotals.totalHours.toFixed(1) ?? "0.0"}
                      style={{ fontWeight: "bold", textAlign: "center" }}
                    />
                  </Col>
                  <Col>
                    <Form.Label htmlFor="inputManpowerOther">Other</Form.Label>
                    <Form.Control
                      type="text"
                      id="inputManpowerOther"
                      value={dailyReportData.equipmentOther ?? ""}
                      onChange={(e) =>
                        setDailyReportData("equipmentOther", e.target.value)
                      }
                    />
                  </Col>
                </Row>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </Col>
    </div>
  );
}

export default CardEquipment;
