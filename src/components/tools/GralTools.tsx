import { Card, Col, Row } from "react-bootstrap";
import Tools from "./Tools";
import Dumpsters from "./Dumpsters";
import "../../styles/buttons.css";

type Props = {};

function GralTools({}: Props) {
  return (
    <div className="salto-pagina">
      <Col>
        <Card style={{ marginBottom: "2px" }}>
          <Card.Body>
            <Row>
              <Col>
                <Tools />
              </Col>
              <Col>
                <Dumpsters />
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </Col>
    </div>
  );
}

export default GralTools;
