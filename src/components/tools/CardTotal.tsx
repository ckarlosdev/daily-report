import { Card, CardBody, Col, Form, Row } from "react-bootstrap";

type Props = {
  qty: number;
  label: string;
};

function CardTotal({ qty, label }: Props) {
  return (
    <>
      <Card>
        <CardBody>
          <Row className="justify-content-md-center">
            <Col className="d-flex flex-column align-items-center">
              <Form.Control
                style={{
                  width: "60px",
                  textAlign: "center",
                  fontWeight: "bold",
                }}
                type="text"
                placeholder={qty?.toString()}
                readOnly
              />
              <Form.Label>{label}</Form.Label>
            </Col>
          </Row>
        </CardBody>
      </Card>
    </>
  );
}

export default CardTotal;
