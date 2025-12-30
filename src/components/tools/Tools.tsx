import { Button, Card, Col, Row, Table } from "react-bootstrap";
import Donut from "./Donut";
import useToolStore from "../../stores/useToolStore";
import ModalTools from "./ModalTools";
import ModalDumpsters from "./ModalDumpsters";

type Props = {};

function Tools({}: Props) {
  const { setShowModalTool, assignedTools } = useToolStore();

  const handleShowTools = () => {
    console.log("Show Tools Modal");
    setShowModalTool(true);
  };

  const totalTools = assignedTools.reduce((acc, tool) => acc + tool.qty, 0);

  return (
    <>
      <Col>
        <Card style={{ marginBottom: "2px" }}>
          <Card.Body>
            <Card.Title style={{ textAlign: "center" }}>
              <Button
                variant="secondary"
                style={{ fontWeight: "bold", width: "200px", fontSize: "" }}
                onClick={handleShowTools}
              >
                Tools
              </Button>
            </Card.Title>
            <Row>
              <Col>
                <Donut value={totalTools} />
              </Col>
              <Col>
                <div
                  style={{
                    backgroundColor: "#ebebeb",
                    height: "220px",
                    borderRadius: "5px",
                    overflowY: "auto",
                    minWidth: "300px",
                  }}
                >
                  <Table striped bordered hover>
                    <thead>
                      <tr style={{ textAlign: "center" }}>
                        <th>Qty</th>
                        <th>Tool</th>
                      </tr>
                    </thead>
                    <tbody style={{ textAlign: "center" }}>
                      {assignedTools.map((tool) => (
                        <tr key={tool.temporalId}>
                          <td>{tool.qty}</td>
                          <td>
                            {tool.name === "Other"
                              ? "(Other) " + tool.other
                              : tool.name}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </Col>

      <ModalTools />
      <ModalDumpsters />
    </>
  );
}

export default Tools;
