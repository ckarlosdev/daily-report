import { Button, Card, Col, Container, Row } from "react-bootstrap";
import List from "./List";
import Assigned from "./Assigned";
import { useNavigate } from "react-router-dom";

type Props = {};

function Equipment({}: Props) {
  const navigate = useNavigate();

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
                    className="bi bi-truck me-3"
                    viewBox="0 0 16 16"
                  >
                    <path d="M0 3.5A1.5 1.5 0 0 1 1.5 2h9A1.5 1.5 0 0 1 12 3.5V5h1.02a1.5 1.5 0 0 1 1.17.563l1.481 1.85a1.5 1.5 0 0 1 .329.938V10.5a1.5 1.5 0 0 1-1.5 1.5H14a2 2 0 1 1-4 0H5a2 2 0 1 1-3.998-.085A1.5 1.5 0 0 1 0 10.5v-7zm1.294 7.456A1.999 1.999 0 0 1 4.732 11h5.536a2.01 2.01 0 0 1 .732-.732V3.5a.5.5 0 0 0-.5-.5h-9a.5.5 0 0 0-.5.5v7a.5.5 0 0 0 .294.456zM12 10.5a.5.5 0 0 0 .5.5h.5a.5.5 0 0 0 .5-.5V8h-1.5v2.5zM12 7h2L12.75 5.5h-1.25V7z" />
                  </svg>
                </div>
                <div>
                  <span style={{ fontSize: "30px", fontWeight: "bold" }}>
                    Equipments
                  </span>
                </div>
                <div></div>
              </div>
            </div>
          </Col>
        </Row>
        <Row>
          <Col>
            <Card>
              <Card.Body>
                <Row>
                  <Col>
                    <List />
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Assigned />
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <Row className="justify-content-md-center">
          <Col
            style={{ height: "60px", textAlign: "center", marginTop: "20px" }}
          >
            <Button
              style={{
                height: "50px",
                width: "200px",
                fontWeight: "bold",
                fontSize: "25px",
              }}
              variant="outline-primary"
              onClick={() => navigate("/")}
            >
              Back
            </Button>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default Equipment;
