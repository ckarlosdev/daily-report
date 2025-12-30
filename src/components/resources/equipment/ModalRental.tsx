import {
  Button,
  Card,
  Col,
  Container,
  FloatingLabel,
  Form,
  Modal,
  Row,
} from "react-bootstrap";
import useEmployees from "../../../hooks/useEmployees";
import useRentalsStore from "../../../stores/useRentalsStore";

type Props = {};

function ModalRental({}: Props) {
  const { data: employees } = useEmployees();

  const {
    showModalRental,
    setShowModalRental,
    rentalName,
    setRentalName,
    rentalCompanyName,
    setRentalCompanyName,
    rentalNumber,
    setRentalNumber,
    rentalType,
    setRentalType,
    addRentals,
    odometerModal,
    setOdometerModal,
    employeesId,
    setEmployeesId,
    updateData,
    updateRental,
    setUpdateData,
    cleanModalData,
  } = useRentalsStore();

  const handleSaveChanges = () => {
    if (validateData()) {
      if (updateData) {
        updateRental();
        setShowModalRental(false);
        setUpdateData(false);
      } else {
        addRentals();
      }
      setShowModalRental(false);
      cleanModalData();
    } else {
      alert("Please fill in all required fields.");
    }
  };

  const validateData = () => {
    if (rentalType === "Attachment") {
      return rentalName.trim() !== "";
    } else {
      return (
        rentalName.trim() !== "" &&
        rentalNumber.trim() !== "" &&
        odometerModal >= 0
      );
    }
  };

  const employeesFiltered = employees?.filter(
    (emp) =>
      emp.status === "Active" &&
      (emp.title === "Labor" || emp.title === "Supervisor")
  );

  const employeesSorted = employeesFiltered?.sort((a, b) => {
    return a.firstName > b.firstName ? 1 : -1;
  });

  return (
    <>
      <Modal show={showModalRental} onHide={() => setShowModalRental(false)}>
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
              className="bi bi-calendar2-range me-3"
              viewBox="0 0 16 16"
            >
              <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5M2 2a1 1 0 0 0-1 1v11a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1z" />
              <path d="M9 7a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2m-9 3a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2" />
            </svg>
            Rented Equipment
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Card>
            <Card.Body>
              <Container>
                <Row>
                  <Col>
                    <FloatingLabel
                      controlId="rentalEquipment"
                      label="Equipment Name:"
                      className="mb-3"
                    >
                      <Form.Control
                        type="text"
                        placeholder="Insert equipment name"
                        style={{ fontWeight: "bold", textAlign: "center" }}
                        value={rentalName}
                        onChange={(e) => setRentalName(e.target.value)}
                        // readOnly
                      />
                    </FloatingLabel>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <FloatingLabel
                      controlId="rentalCompany"
                      label="Company Name:"
                      className="mb-3"
                    >
                      <Form.Control
                        type="text"
                        placeholder="Insert company name"
                        style={{ fontWeight: "bold", textAlign: "center" }}
                        value={rentalCompanyName}
                        onChange={(e) => setRentalCompanyName(e.target.value)}
                      />
                    </FloatingLabel>
                    <FloatingLabel
                      controlId="rentalNumber"
                      label="Equipment Number:"
                      className="mb-3"
                    >
                      <Form.Control
                        type="text"
                        placeholder="Insert equipment number"
                        style={{ fontWeight: "bold", textAlign: "center" }}
                        value={rentalNumber}
                        onChange={(e) => setRentalNumber(e.target.value)}
                      />
                    </FloatingLabel>
                  </Col>
                </Row>
                <Row className="justify-content-md-center">
                  <Col className="text-center">
                    <Form className="mb-3">
                      <Form.Check
                        inline
                        label="Equipment"
                        name="groupType"
                        type="radio"
                        id={"rEquipment"}
                        checked={rentalType === "Equipment"}
                        onChange={() => setRentalType("Equipment")}
                      />
                      <Form.Check
                        inline
                        label="Attachment"
                        name="groupType"
                        type="radio"
                        id={"rAttachment"}
                        checked={rentalType === "Attachment"}
                        onChange={() => setRentalType("Attachment")}
                      />
                    </Form>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <FloatingLabel
                      controlId="rentalOperator"
                      label="Operator"
                      className="mb-3"
                    >
                      <Form.Select
                        style={{ fontWeight: "bold", textAlign: "center" }}
                        value={employeesId || 51}
                        onChange={(e) => setEmployeesId(Number(e.target.value))}
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
                    </FloatingLabel>
                  </Col>
                  <Col>
                    <FloatingLabel
                      controlId="rentalOdometer"
                      label="Odometer (hrs/miles)"
                      className="mb-3"
                    >
                      <Form.Control
                        type="number"
                        placeholder="Insert equipment name"
                        value={odometerModal}
                        style={{ fontWeight: "bold", textAlign: "center" }}
                        onChange={(e) =>
                          setOdometerModal(Number(e.target.value))
                        }
                      />
                    </FloatingLabel>
                  </Col>
                </Row>
              </Container>
            </Card.Body>
          </Card>
        </Modal.Body>
        <Modal.Footer className="justify-content-center">
          <Button
            variant="outline-primary"
            style={{ fontWeight: "bold" }}
            onClick={() => {
              handleSaveChanges();
            }}
          >
            {updateData ? "Update" : "Save"}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ModalRental;
