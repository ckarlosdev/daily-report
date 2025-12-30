import { Button, Card, Col, Form, Row, Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import useAssignmentStore from "../../stores/useManpowerStore";
import useEmployees from "../../hooks/useEmployees";
import useDailyReportStore from "../../stores/dailyReportStore";
// import "../../styles/buttons.css";

type Props = {};

const timeToDecimalHours = (time: string) => {
  if (!time || typeof time !== "string" || !time.includes(":")) {
    return 0;
  }
  const [hours, minutes] = time.split(":").map(Number);
  return hours + minutes / 60;
};

function CardManpower({}: Props) {
  const navigate = useNavigate();

  const { assignedEmployees } = useAssignmentStore();
  const { data: employees } = useEmployees();
  const { dailyReportData, setDailyReportData } = useDailyReportStore();

  const manpowerTotals = assignedEmployees.reduce(
    (totals, employee) => {
      const inDecimal = timeToDecimalHours(employee.inHour);
      const outDecimal = timeToDecimalHours(employee.outHour);
      const hoursWorked = outDecimal - inDecimal - (employee.lunch ? 0.5 : 0);

      totals.qty += 1;
      totals.totalHours += Math.max(0, hoursWorked);

      return totals;
    },
    { qty: 0, totalHours: 0 }
  );

  const manpowerRoleCounts = assignedEmployees.reduce((totals, employee) => {
    const empData = employees?.find(
      (emp) => emp.employeesId === employee.employeesId
    );
    if (!empData) return totals;

    const role = empData.title;
    const inHour = employee.inHour;
    const outHour = employee.outHour;

    const uniqueKey = `${role}-${inHour}-${outHour}`;

    if (!totals[uniqueKey]) {
      const inDecimal = timeToDecimalHours(inHour);
      const outDecimal = timeToDecimalHours(outHour);
      const totalHours = Math.max(0, outDecimal - inDecimal);

      totals[uniqueKey] = {
        qty: 0,
        title: role,
        in: inHour,
        out: outHour,
        total: totalHours,
      };
    }

    totals[uniqueKey].qty += 1;

    return totals;
  }, {} as Record<string, { qty: number; title: string; in: string; out: string; total: number }>);

  return (
    <div>
      <Col>
        <Card style={{ marginBottom: "2px", textAlign: "center" }}>
          <Card.Body>
            <Card.Title style={{ textAlign: "center" }}>
              <Button
                variant="secondary"
                style={{ fontWeight: "bold", width: "200px", fontSize: "" }}
                onClick={() => navigate("/employee")}
              >
                Man Power
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
                      <th>Qty</th>
                      <th>Title</th>
                      <th>in</th>
                      <th>Out</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.values(manpowerRoleCounts).map((item, index) => (
                      <tr key={index}>
                        <td>{item.qty}</td>
                        <td>{item.title}</td>
                        <td>{item.in}</td>
                        <td>{item.out}</td>
                        <td>{item.total.toFixed(1)}</td>
                      </tr>
                    ))}
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
                    Man power totals
                  </span>
                </Row>
                <Row>
                  <Col sm={3}>
                    <Form.Label htmlFor="inputManpowerQty">Qty</Form.Label>
                    <Form.Control
                      type="text"
                      readOnly
                      id="inputManpowerQty"
                      value={manpowerTotals.qty ?? 0}
                      style={{ fontWeight: "bold", textAlign: "center" }}
                    />
                  </Col>
                  <Col sm={3}>
                    <Form.Label htmlFor="inputManpowerHours">Hours</Form.Label>
                    <Form.Control
                      type="text"
                      readOnly
                      id="inputManpowerHours"
                      value={manpowerTotals.totalHours.toFixed(1) ?? "0.0"}
                      style={{ fontWeight: "bold", textAlign: "center" }}
                    />
                  </Col>
                  <Col>
                    <Form.Label htmlFor="inputManpowerOther">Other</Form.Label>
                    <Form.Control
                      type="text"
                      id="inputManpowerOther"
                      value={dailyReportData.manOther ?? ""}
                      onChange={(e) =>
                        setDailyReportData("manOther", e.target.value)
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

export default CardManpower;
