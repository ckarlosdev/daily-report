import { Card, Col, FloatingLabel, Form, Row } from "react-bootstrap";
import useEmployees from "../hooks/useEmployees";
import useDailyReportStore from "../stores/dailyReportStore";

type Props = {};

function Description({}: Props) {
  const { data: employees } = useEmployees();

  const { dailyReportData, setDailyReportData } =
    useDailyReportStore();

  const supervisorOptions = employees?.filter(
    (emp) => emp.title === "Supervisor"
  );
  const supervisorSorted = supervisorOptions?.sort((a, b) =>
    a.firstName.localeCompare(b.firstName)
  );

  return (
    <>
      <Col>
        <Card style={{ marginBottom: "2px" }}>
          <Card.Body>
            <Card.Title style={{ textAlign: "center", fontWeight: "bold" }}>
              Work daily description
            </Card.Title>
            <Card.Subtitle
              className="mb-2 text-muted"
              style={{ textAlign: "center" }}
            >
              Provide a brief description of daily work performed
            </Card.Subtitle>
            <Row>
              <Col>
                <FloatingLabel controlId="date" label="Date" className="mb-3">
                  <Form.Control
                    style={{
                      textAlign: "center",
                      fontWeight: "bold",
                      fontSize: "20px",
                    }}
                    type="date"
                    placeholder="#"
                    value={dailyReportData.date}
                    onChange={(e) => setDailyReportData("date", e.target.value)}
                  />
                </FloatingLabel>
              </Col>
              <Col>
                <FloatingLabel
                  controlId="foreman"
                  label="Forman"
                  className="mb-3"
                >
                  <Form.Select
                    aria-label="Default select example"
                    style={{
                      textAlign: "center",
                      fontWeight: "bold",
                      fontSize: "18px",
                    }}
                    value={dailyReportData.foreman?.trim() ?? ""}
                    onChange={(e) => {
                      setDailyReportData("foreman", e.target.value);
                    }}
                  >
                    <option value="">Open this select foreman</option>
                    {supervisorSorted?.map((emp) => (
                      <option
                        key={emp.employeesId}
                        value={`${emp.firstName} ${emp.lastName}`}
                        style={{ fontWeight: "bold" }}
                      >
                        {emp.firstName} {emp.lastName}
                      </option>
                    ))}
                  </Form.Select>
                </FloatingLabel>
              </Col>
            </Row>
            <Row>
              <Col>
                <FloatingLabel
                  controlId="floatingTextareaDescription"
                  label="Description"
                >
                  <Form.Control
                    as="textarea"
                    placeholder="Leave a description here"
                    style={{
                      height: "200px",
                      fontWeight: "bold",
                      fontSize: "15px",
                    }}
                    value={dailyReportData.description}
                    onChange={(e) =>
                      setDailyReportData("description", e.target.value)
                    }
                  />
                </FloatingLabel>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </Col>
    </>
  );
}

export default Description;
