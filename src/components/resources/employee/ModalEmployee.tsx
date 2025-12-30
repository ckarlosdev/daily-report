import {
  Button,
  Card,
  CardBody,
  Col,
  Container,
  FloatingLabel,
  Form,
  Modal,
  Row,
} from "react-bootstrap";
import useAssignmentStore from "../../../stores/useManpowerStore";

type Props = {
  show: boolean;
  handleClose: () => void;
};

function ModalEmployee({ show, handleClose }: Props) {
  const {
    selectedEmployees,
    addAssignments,
    resetSelection,
    formData,
    updateFormData,
    cleanFormData,
    updateAssignment,
  } = useAssignmentStore();

  const handleSaveAssignment = () => {
    if (!formData.employeesId) {
      const assignmentsPayload = selectedEmployees.map((employee) => {
        return {
          drEmployeesId: null,
          dailyReportId: null,
          employeesId: employee.employeesId,
          inHour: formData.inHour,
          outHour: formData.outHour,
          lunch: formData.lunch,
          ppe: formData.ppe,
          comment: formData.comment,
        };
      });

      addAssignments(assignmentsPayload);
    } else {
      const assignmentPayload = {
        drEmployeesId: null,
        dailyReportId: null,
        employeesId: formData.employeesId,
        inHour: formData.inHour,
        outHour: formData.outHour,
        lunch: formData.lunch,
        ppe: formData.ppe,
        comment: formData.comment,
      };
      updateAssignment(assignmentPayload);
    }

    cleanFormData();
    resetSelection();
    handleClose();
  };

  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header
          closeButton
          className="w-100 text-center d-flex align-items-center justify-content-center"
        >
          <Modal.Title className="w-100 text-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="30"
              height="30"
              fill="currentColor"
              className="bi bi-person-plus-fill me-3"
              viewBox="0 0 16 16"
            >
              <path d="M1 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6" />
              <path
                fillRule="evenodd"
                d="M13.5 5a.5.5 0 0 1 .5.5V7h1.5a.5.5 0 0 1 0 1H14v1.5a.5.5 0 0 1-1 0V8h-1.5a.5.5 0 0 1 0-1H13V5.5a.5.5 0 0 1 .5-.5"
              />
            </svg>
            Crew Assignment
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Container>
            <Row>
              <Col>
                <Card style={{ marginBottom: "2px" }}>
                  <CardBody>
                    {selectedEmployees?.map((employee) => (
                      <Button
                        key={employee.employeesId}
                        variant="light"
                        style={{ fontWeight: "bold" }}
                      >
                        {employee.firstName} {employee.lastName}
                      </Button>
                    ))}
                  </CardBody>
                </Card>
              </Col>
            </Row>
            <Row>
              <Col>
                <Card style={{ marginBottom: "2px" }}>
                  <CardBody>
                    <Row>
                      <Col className="text-center">
                        <Form.Label>Entry Time</Form.Label>
                        <Form.Control
                          style={{ textAlign: "center", fontWeight: "bold" }}
                          type="time"
                          value={formData.inHour}
                          name="inHour"
                          onChange={updateFormData}
                        />
                      </Col>
                      <Col className="text-center">
                        <Form.Label>Exit Time</Form.Label>
                        <Form.Control
                          style={{ textAlign: "center", fontWeight: "bold" }}
                          type="time"
                          value={formData.outHour}
                          name="outHour"
                          onChange={updateFormData}
                        />
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
              </Col>
            </Row>
            <Row>
              <Col>
                <Card style={{ marginBottom: "2px" }}>
                  <CardBody>
                    <Row className="justify-content-center">
                      <Col xs="auto">
                        <Form.Group className="mb-3" controlId="formCbLunch">
                          <Form.Check
                            style={{ fontWeight: "bold", fontSize: "22px" }}
                            type="checkbox"
                            label="Lunch"
                            checked={formData.lunch}
                            name="lunch"
                            onChange={updateFormData}
                          />
                        </Form.Group>
                      </Col>
                      <Col xs="auto">
                        <Form.Group className="mb-3" controlId="formCbPpe">
                          <Form.Check
                            style={{ fontWeight: "bold", fontSize: "22px" }}
                            type="checkbox"
                            label="PPE"
                            checked={formData.ppe}
                            name="ppe"
                            onChange={updateFormData}
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
              </Col>
            </Row>
            <Row>
              <Col>
                <Card>
                  <CardBody>
                    <FloatingLabel
                      controlId="floatingTextarea2"
                      label="Comments"
                    >
                      <Form.Control
                        as="textarea"
                        placeholder="Leave a comment here"
                        style={{ height: "100px", fontWeight: "bold" }}
                        value={formData.comment}
                        name="comment"
                        onChange={updateFormData}
                      />
                    </FloatingLabel>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </Container>
        </Modal.Body>
        <Modal.Footer className="justify-content-center">
          <Button
            variant="outline-primary"
            style={{ fontWeight: "bold" }}
            onClick={handleSaveAssignment}
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ModalEmployee;
