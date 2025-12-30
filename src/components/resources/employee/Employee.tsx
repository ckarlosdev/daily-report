import { Button, Card, CardBody, Col, Container, Row } from "react-bootstrap";
import List from "./List";
import Assigned from "./Assigned";
import { useState } from "react";
import ModalEmployee from "./ModalEmployee";
import useAssignmentStore from "../../../stores/useManpowerStore";
import { useNavigate } from "react-router-dom";

type Props = {};

function Employee({}: Props) {
  const { selectedEmployees } = useAssignmentStore();
  const navigate = useNavigate();
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleUpdate = () => {
    handleShow();
  };

  return (
    <>
      <Container fluid>
        <Row className="justify-content-md-center">
          <Col className="text-center">
            <div
              style={{
                height: "80px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "row", // Pone icono y texto a la par
                  alignItems: "center", // Los centra verticalmente entre sí
                  justifyContent: "center", // Los centra horizontalmente en la pantalla
                  gap: "12px", // Espacio entre el icono y el texto
                }}
              >
                <div style={{ display: "flex", alignItems: "center" }}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="30"
                    height="30"
                    fill="currentColor"
                    className="bi bi-people"
                    viewBox="0 0 16 16"
                  >
                    <path d="M15 14s1 0 1-1-1-4-5-4-5 3-5 4 1 1 1 1zm-7.978-1L7 12.996c.001-.264.167-1.03.76-1.72C8.312 10.629 9.282 10 11 10c1.717 0 2.687.63 3.24 1.276.593.69.758 1.457.76 1.72l-.008.002-.014.002zM11 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4m3-2a3 3 0 1 1-6 0 3 3 0 0 1 6 0M6.936 9.28a6 6 0 0 0-1.23-.247A7 7 0 0 0 5 9c-4 0-5 3-5 4q0 1 1 1h4.216A2.24 2.24 0 0 1 5 13c0-1.01.377-2.042 1.09-2.904.243-.294.526-.569.846-.816M4.92 10A5.5 5.5 0 0 0 4 13H1c0-.26.164-1.03.76-1.724.545-.636 1.492-1.256 3.16-1.275ZM1.5 5.5a3 3 0 1 1 6 0 3 3 0 0 1-6 0m3-2a2 2 0 1 0 0 4 2 2 0 0 0 0-4" />
                  </svg>
                </div>
                <h2>Man Power</h2>
              </div>
            </div>
          </Col>
        </Row>
        <Row>
          <Col>
            <Card>
              <CardBody>
                <Row style={{ width: "100%" }}>
                  <Col xs md={4} lg={3} className="text-center">
                    <List />
                  </Col>
                  <Col
                    xs
                    md={1}
                    lg={1}
                    className="d-flex flex-column justify-content-center align-items-center gap-5"
                  >
                    <Button
                      variant="outline-primary"
                      style={{
                        width: "80px",
                        height: "80px",
                        fontWeight: "bold",
                      }}
                      onClick={handleShow}
                      disabled={!(selectedEmployees.length > 0)}
                      // onClick={handleTest}
                    >
                      {">"}
                      <br />
                      Assign
                    </Button>
                  </Col>
                  <Col md={7} lg={8} className="text-center">
                    <Assigned handleShowModal={handleUpdate} />
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
        </Row>
        <Row style={{ height: "100px", alignItems: "center" }}>
          <Col className="text-center">
            <Button
              variant="outline-primary"
              style={{
                width: "200px",
                height: "50px",
                fontWeight: "bold",
                fontSize: "25px",
              }}
              onClick={() => navigate("/")}
            >
              Back
            </Button>
          </Col>
          {/* <Col className="text-center">
            <Button
              variant="outline-primary"
              style={{
                width: "200px",
                height: "50px",
                fontWeight: "bold",
                fontSize: "25px",
              }}
            >
              Save
            </Button>
          </Col> */}
        </Row>
      </Container>

      <ModalEmployee show={show} handleClose={handleClose} />
    </>
  );
}

export default Employee;
