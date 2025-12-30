import {
  Button,
  Card,
  Col,
  Container,
  FloatingLabel,
  Form,
  Modal,
  Row,
  Table,
} from "react-bootstrap";
import useToolStore from "../../stores/useToolStore";
import { toolsOptions } from "../../types/utilities";
import { DRTool } from "../../types";

type Props = {};

function ModalTools({}: Props) {
  const {
    showModalTool,
    setShowModalTool,
    modalData,
    setModalData,
    addTool,
    assignedTools,
    removeTool,
    setToolData,
    updatingTool,
    setUpdatingTool,
    updateTool,
    resetModalData,
  } = useToolStore();

  const handleInputChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { id, value, type } = event.target;
    const newValue: string | number = type === "number" ? Number(value) : value;
    setModalData(id as keyof DRTool, newValue as any);
  };

  const validateModalData = (): boolean => {
    return (
      modalData.name.trim() !== "" &&
      modalData.qty > 0 &&
      (modalData.name !== "Other" || modalData.other.trim() !== "")
    );
  };

  const handleAddTool = () => {
    if (!validateModalData()) {
      alert("Please fill in all required fields.");
      return;
    } else {
      updatingTool ? updateTool(modalData.temporalId) : addTool();
      setUpdatingTool(false);
    }
  };

  const handleUpdateTool = (temporalId: string) => {
    const toolSelected = assignedTools.find(
      (tool) => tool.temporalId === temporalId
    );

    if (!toolSelected) {
      alert("Tool not found.");
    } else {
      setToolData(toolSelected!);
      setUpdatingTool(true);
    }
  };

  const handleRemoveTool = (temporalId: string) => {
    removeTool(temporalId);
    resetModalData();
    setUpdatingTool(false);
  };

  return (
    <>
      <Modal show={showModalTool} onHide={() => setShowModalTool(false)}>
        <Modal.Header
          closeButton
          className="w-100 text-center d-flex align-items-center justify-content-center"
        >
          <Modal.Title className="w-100 text-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-tools me-2"
              viewBox="0 0 16 16"
            >
              <path d="M1 0 0 1l2.2 3.081a1 1 0 0 0 .815.419h.07a1 1 0 0 1 .708.293l2.675 2.675-2.617 2.654A3.003 3.003 0 0 0 0 13a3 3 0 1 0 5.878-.851l2.654-2.617.968.968-.305.914a1 1 0 0 0 .242 1.023l3.27 3.27a.997.997 0 0 0 1.414 0l1.586-1.586a.997.997 0 0 0 0-1.414l-3.27-3.27a1 1 0 0 0-1.023-.242L10.5 9.5l-.96-.96 2.68-2.643A3.005 3.005 0 0 0 16 3q0-.405-.102-.777l-2.14 2.141L12 4l-.364-1.757L13.777.102a3 3 0 0 0-3.675 3.68L7.462 6.46 4.793 3.793a1 1 0 0 1-.293-.707v-.071a1 1 0 0 0-.419-.814zm9.646 10.646a.5.5 0 0 1 .708 0l2.914 2.915a.5.5 0 0 1-.707.707l-2.915-2.914a.5.5 0 0 1 0-.708M3 11l.471.242.529.026.287.445.445.287.026.529L5 13l-.242.471-.026.529-.445.287-.287.445-.529.026L3 15l-.471-.242L2 14.732l-.287-.445L1.268 14l-.026-.529L1 13l.242-.471.026-.529.445-.287.287-.445.529-.026z" />
            </svg>
            Tools
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Container>
            <Row className="justify-content-md-center mb-3">
              <Col className="text-center">
                <FloatingLabel controlId="name" label="Tool">
                  <Form.Select
                    aria-label="Select Tool"
                    style={{ textAlign: "center", fontWeight: "bold" }}
                    value={modalData.name}
                    onChange={handleInputChange}
                  >
                    <option
                      value=""
                      style={{ textAlign: "center", fontWeight: "bold" }}
                    >
                      Select tool
                    </option>

                    {toolsOptions.map((tool) => (
                      <option
                        value={tool.name}
                        key={tool.id}
                        style={{ textAlign: "center", fontWeight: "bold" }}
                      >
                        {tool.name}
                      </option>
                    ))}
                  </Form.Select>
                </FloatingLabel>
              </Col>
            </Row>
            <Row className="justify-content-md-center mb-3">
              <Col className="text-center">
                <FloatingLabel controlId="qty" label="Qty">
                  <Form.Control
                    type="number"
                    placeholder="Qty"
                    min={1}
                    value={modalData.qty}
                    onChange={handleInputChange}
                    style={{ textAlign: "center", fontWeight: "bold" }}
                  />
                </FloatingLabel>
              </Col>
              <Col className="text-center">
                <FloatingLabel controlId="other" label="Other">
                  <Form.Control
                    type="text"
                    placeholder="Other"
                    value={modalData.other}
                    onChange={handleInputChange}
                    style={{ textAlign: "center", fontWeight: "bold" }}
                    disabled={modalData.name !== "Other"}
                  />
                </FloatingLabel>
              </Col>
            </Row>
            <Row className="justify-content-md-center mb-3">
              <Col>
                <Form.Label>Comment:</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  id="comments"
                  value={modalData.comments}
                  onChange={handleInputChange}
                />
              </Col>
            </Row>
            <Row className="justify-content-md-center mb-3">
              <Col className="text-center">
                <Button
                  variant="outline-secondary"
                  style={{
                    fontWeight: "bold",
                    fontSize: "20px",
                    width: "150px",
                  }}
                  onClick={() => handleAddTool()}
                >
                  {updatingTool ? "Update tool" : "Add tool"}
                </Button>
              </Col>
            </Row>
            <Row className="justify-content-md-center mb-3">
              <Col className="text-center">
                <Card>
                  <Card.Header as="h5">Tools Added</Card.Header>
                  <div
                    style={{
                      maxHeight: "150px", // Altura máxima deseada
                      overflowY: "auto", // Activa el scroll vertical
                      overflowX: "auto", // Scroll horizontal si es necesario
                    }}
                  >
                    <Table striped bordered hover size="sm">
                      <thead>
                        <tr>
                          <th>Remove</th>
                          <th>Qty</th>
                          <th>Tool</th>
                          <th>Update</th>
                        </tr>
                      </thead>
                      <tbody>
                        {assignedTools.map((tool) => (
                          <tr key={tool.temporalId}>
                            <td>
                              <Button
                                variant="outline-danger"
                                onClick={() => {
                                  handleRemoveTool(tool.temporalId);
                                }}
                              >
                                {" "}
                                X{" "}
                              </Button>
                            </td>
                            <td>{tool.qty}</td>
                            <td>
                              {tool.name === "Other"
                                ? "(Other)" + tool.other
                                : tool.name}
                            </td>
                            <td>
                              <Button
                                variant="outline-primary"
                                onClick={() =>
                                  handleUpdateTool(tool.temporalId)
                                }
                              >
                                Update
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                </Card>
              </Col>
            </Row>
          </Container>
        </Modal.Body>
        <Modal.Footer className="justify-content-center">
          <Button
            variant="outline-primary"
            onClick={() => {
              setShowModalTool(false);
              setUpdatingTool(false);
              resetModalData();
            }}
            style={{ fontWeight: "bold", fontSize: "20px", width: "150px" }}
          >
            Ok
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ModalTools;
