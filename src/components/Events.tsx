import { Card, Col, FloatingLabel, Form, Row } from "react-bootstrap";
import useDailyReportStore from "../stores/dailyReportStore";

type Props = {};

function Events({}: Props) {
  const { dailyReportData, setDailyReportData } = useDailyReportStore();

  return (
    <>
      <Col>
        <Card style={{ marginBottom: "2px" }}>
          <Card.Body>
            <Card.Title style={{ textAlign: "center", fontWeight: "bold" }}>
              Events, Issues or Visitors
            </Card.Title>
            <Card.Subtitle
              className="mb-2 text-muted"
              style={{ textAlign: "center" }}
            >
              Provide a description of any significant event or issue to report.
              Include quantities and units if applicable.
            </Card.Subtitle>
            <Row>
              <Col>
                <FloatingLabel
                  controlId="floatingEvents"
                  label="Events or Issues"
                >
                  <Form.Control
                    as="textarea"
                    placeholder="Leave a comment here"
                    style={{ height: "100px" }}
                    value={dailyReportData.issues}
                    onChange={(e) =>
                      setDailyReportData("issues", e.target.value)
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

export default Events;
