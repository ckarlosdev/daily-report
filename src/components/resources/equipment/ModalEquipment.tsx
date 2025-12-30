import {
  Button,
  Card,
  CardBody,
  Col,
  Container,
  Form,
  Modal,
  Row,
} from "react-bootstrap";
import useEquipmentStore from "../../../stores/useEquipmentStore";
import useEmployees from "../../../hooks/useEmployees";
import { useEffect } from "react";

type Props = {};

function ModalEquipment({}: Props) {
  const {
    showModalEquipment,
    setShowModalEquipment,
    equipmentSelected,
    addEquipment,
    hourModal,
    setHourModal,
    operadorId,
    setOperatorId,
    updateAssigned,
    setUpdateAssigned,
    updateEquipment,
  } = useEquipmentStore();
  const { data: employees } = useEmployees();

  const employeesFiltered = employees?.filter(
    (emp) =>
      emp.status === "Active" &&
      (emp.title === "Labor" || emp.title === "Supervisor")
  );

  const employeesSorted = employeesFiltered?.sort((a, b) => {
    return a.firstName > b.firstName ? 1 : -1;
  });

  useEffect(() => {
    if (equipmentSelected.hour) {
      setHourModal(Number(equipmentSelected.hour));
    }
  }, [equipmentSelected]);

  const handleSaveChanges = () => {
    if (updateAssigned) {
      setUpdateAssigned(false);
      updateEquipment();
    } else {
      addEquipment();
    }

    setShowModalEquipment(false);
  };

  return (
    <>
      <Modal
        show={showModalEquipment}
        onHide={() => setShowModalEquipment(false)}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header
          closeButton
          className="w-100 text-center d-flex align-items-center justify-content-center"
        >
          <Modal.Title className="w-100 text-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="25"
              height="25"
              fill="currentColor"
              className="bi bi-plus-circle me-2"
              viewBox="0 0 16 16"
            >
              <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
              <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4" />
            </svg>
            Equipment Assignment
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Container>
            <Row className="justify-content-md-center">
              <Col style={{ fontWeight: "bold", fontSize: "20px" }}>
                <Card style={{ marginBottom: "2px" }}>
                  <CardBody>
                    <Row>
                      <Col className="text-center">
                        <span>
                          {equipmentSelected.number} {equipmentSelected.name}
                        </span>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
              </Col>
            </Row>
            <Row
              className="justify-content-md-center"
              style={{ marginTop: "10px" }}
            >
              <Col style={{ fontSize: "16px" }} className="text-center">
                <Form.Label style={{ fontWeight: "bold" }}>Operator</Form.Label>
                <Form.Select
                  style={{ fontWeight: "bold", textAlign: "center" }}
                  value={operadorId || 51}
                  onChange={(e) => setOperatorId(Number(e.target.value))}
                >
                  <option key={0} value={51}>
                    No operator
                  </option>
                  {employeesSorted?.map((emp) => (
                    <option key={emp.employeesId} value={emp.employeesId}>
                      {emp.firstName} {emp.lastName}
                    </option>
                  ))}
                </Form.Select>
              </Col>
              <Col className="text-center">
                <Form.Label style={{ fontWeight: "bold" }}>Odometer</Form.Label>
                <Form.Control
                  style={{ fontWeight: "bold", textAlign: "center" }}
                  type="number"
                  min={0}
                  value={hourModal}
                  onChange={(e) => setHourModal(Number(e.target.value))}
                />
              </Col>
            </Row>
          </Container>
        </Modal.Body>
        <Modal.Footer className="justify-content-center">
          <Button
            variant="outline-primary"
            style={{ fontWeight: "bold" }}
            onClick={() => {
              handleSaveChanges();
            }}
          >
            {updateAssigned ? "Update" : "Save Changes"}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ModalEquipment;
