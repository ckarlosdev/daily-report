import { Card, Col, Form, Row } from "react-bootstrap";
import useJob from "../../hooks/useJob";
import { useContextStore } from "../../stores/useContextStore";
import { useDrTotals } from "../../hooks/useDailyReport";
import dailyReportStore from "../../stores/dailyReportStore";
import useAssignmentStore from "../../stores/useManpowerStore";

type Props = {};

const timeToDecimalHours = (time: string) => {
  if (!time || typeof time !== "string" || !time.includes(":")) {
    return 0;
  }
  const [hours, minutes] = time.split(":").map(Number);
  return hours + minutes / 60;
};

function Totals({}: Props) {
  const { jobId } = useContextStore();
  const { dailyReportData } = dailyReportStore();
  const { data: job } = useJob(jobId ? Number(jobId) : 0);

  const { assignedEmployees } = useAssignmentStore();

  const { data: drTotals } = useDrTotals(
    job ? job.number : "",
    dailyReportData ? dailyReportData.date : ""
  );

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

  return (
    <>
      <Col>
        <Card style={{ marginBottom: "2px" }}>
          <Card.Body>
            <Card.Title
              style={{
                textAlign: "center",
                fontWeight: "bold",
                fontSize: "20px",
              }}
            >
              Job Totals
            </Card.Title>
            <Row>
              <Col style={{ textAlign: "center" }}>
                <Form.Label
                  htmlFor="inputTotalDays"
                  style={{ fontWeight: "bold" }}
                >
                  Days
                </Form.Label>
                <Form.Control
                  type="text"
                  id="inputTotalDays"
                  readOnly
                  value={`${drTotals?.days} day(s) + today (1) Total: ${
                    drTotals?.days ? Number(drTotals?.days) + 1 : 1
                  } days`}
                  style={{
                    fontWeight: "bold",
                    textAlign: "center",
                    fontSize: "20px",
                  }}
                />
              </Col>
              <Col style={{ textAlign: "center" }}>
                <Form.Label
                  htmlFor="inputTotalHours"
                  style={{ fontWeight: "bold" }}
                >
                  Hours
                </Form.Label>
                <Form.Control
                  type="text"
                  id="inputTotalHours"
                  readOnly
                  value={`${
                    Number(drTotals?.hours).toFixed(1)
                  } hrs + ${manpowerTotals.totalHours.toFixed(
                    1
                  )} (today hrs) Total:${
                    drTotals?.hours
                      ? (Number(drTotals?.hours) +
                        Number(manpowerTotals.totalHours)).toFixed(1)
                      : manpowerTotals.totalHours.toFixed(1)
                  } hours`}
                  style={{
                    fontWeight: "bold",
                    textAlign: "center",
                    fontSize: "20px",
                  }}
                />
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </Col>
    </>
  );
}

export default Totals;
