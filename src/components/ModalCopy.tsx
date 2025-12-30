import { Button, Col, Container, Form, Modal, Row } from "react-bootstrap";
import { useContextStore } from "../stores/useContextStore";
import useCopyResources from "../hooks/useCopyEvent";
import useJob from "../hooks/useJob";
import useManpowerStore from "../stores/useManpowerStore";
import useEquipmentStore from "../stores/useEquipmentStore";
import useRentalsStore from "../stores/useRentalsStore";
import useToolStore from "../stores/useToolStore";

type Props = {};

function ModalCopy({}: Props) {
  const { jobId } = useContextStore();
  const { data: job } = useJob(jobId ? Number(jobId) : 0);
  const { data: resources } = useCopyResources(job ? job.number : "");
  const { copyManpowerFromApi } = useManpowerStore();
  const { copyEquipmentFromApi, setShowModalOdometer } = useEquipmentStore();
  const { copyRentalsFromApi } = useRentalsStore();
  const { copyToolsFromApi } = useToolStore();

  const {
    showModalCopy: show,
    setShowModalCopy: setShowModal,
    setCopySelections,
    copySelections,
    resetCopySelections,
  } = useContextStore();

  const handleCopyData = () => {
    if (!resources) return;

    let hasSelected = false;

    if (copySelections.manPower) {
      copyManpowerFromApi(resources.employees);
    }

    if (copySelections.equipment) {
      copyEquipmentFromApi(resources.equipments);
      copyRentalsFromApi(resources.rentals);
      hasSelected = true;
    }

    if (copySelections.tool) {
      copyToolsFromApi(resources.tools);
    }

    resetCopySelections();
    setShowModal(false);
    setShowModalOdometer(hasSelected);
  };

  return (
    <>
      <Modal show={show} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton className="justify-content-center">
          <Modal.Title className="w-100 d-flex align-items-center justify-content-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="25"
              height="25"
              fill="currentColor"
              className="bi bi-copy me-3" // 'me-3' añade espacio a la derecha del icono
              viewBox="0 0 16 16"
            >
              <path
                fillRule="evenodd"
                d="M4 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zM2 5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1h1v1a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h1v1z"
              />
            </svg>
            <h3 style={{ fontWeight: "bold", fontSize: "30px", margin: 0 }}>
              Copy Data
            </h3>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Container>
            <Row className="justify-content-center mb-3">
              <Col xs="auto">
                <h5 style={{ fontWeight: "bold", fontSize: "24px" }}>
                  Select the information to copy:
                </h5>
              </Col>
            </Row>
            <Row className="justify-content-center">
              <Col xs="auto">
                <div
                  style={{
                    fontWeight: "bold",
                    fontSize: "20px",
                    textAlign: "left",
                  }}
                >
                  <Form.Check
                    type="switch"
                    id="manPower"
                    label="Man power"
                    className="mb-2"
                    checked={copySelections.manPower}
                    onChange={() => setCopySelections("manPower")}
                  />

                  <Form.Check
                    type="switch"
                    id="equipment"
                    label="Equipments"
                    className="mb-2"
                    checked={copySelections.equipment}
                    onChange={() => setCopySelections("equipment")}
                  />

                  <Form.Check
                    type="switch"
                    id="tool"
                    label="Tools"
                    className="mb-2"
                    checked={copySelections.tool}
                    onChange={() => setCopySelections("tool")}
                  />
                </div>
              </Col>
            </Row>
          </Container>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => handleCopyData()}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ModalCopy;
