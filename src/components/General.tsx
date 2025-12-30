import { Button, Card, Col, Row } from "react-bootstrap";
import CardManpower from "./resources/CardManpower";
import CardEquipment from "./resources/CardEquipment";
import Totals from "./resources/Totals";
import { useContextStore } from "../stores/useContextStore";
import ModalCopy from "./ModalCopy";
import "../styles/buttons.css";
import ModalOdometers from "./resources/equipment/ModalOdometers";

type Props = {};

function General({}: Props) {
  const { setShowModalCopy } = useContextStore();

  return (
    <div className="salto-pagina">
      <Col>
        <Card style={{ marginBottom: "2px" }}>
          <Card.Body>
            <Card.Title className="d-flex justify-content-between align-items-center">
              <div
                className="flex-grow-1 text-center"
                style={{ fontWeight: "bold" }}
              >
                Man Power & Equipment
              </div>
              <Button
                variant="outline-primary"
                onClick={() => setShowModalCopy(true)}
                className="no-print"
                style={{ fontWeight: "bold" }}
              >
                Copy
              </Button>
            </Card.Title>
            <Row>
              <Col>
                <CardManpower />
              </Col>
              <Col>
                <CardEquipment />
              </Col>
            </Row>
            <Row>
              <Col>
                <Totals />
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </Col>

      <ModalCopy />
      <ModalOdometers />
    </div>
  );
}

export default General;
