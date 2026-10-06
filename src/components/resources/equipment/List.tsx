import {
  Button,
  Card,
  Col,
  Form,
  Row,
  Tab,
  Table,
  Tabs,
} from "react-bootstrap";
import useEquipments from "../../../hooks/useEquipments";
import useAttachments from "../../../hooks/useAttachments";
import useEquipmentStore from "../../../stores/useEquipmentStore";
import ModalEquipment from "./ModalEquipment";
import { useMemo, useState } from "react";
import ModalRental from "./ModalRental";
import useRentalsStore from "../../../stores/useRentalsStore";

type Props = {};

function List({}: Props) {
  const {
    data: equipments,
    error: equipmentsError,
    isLoading: isEquipmentsLoading,
  } = useEquipments();

  const {
    data: attachments,
    error: attachmentsError,
    isLoading: isAttachmentsLoading,
  } = useAttachments();

  const [searchValue, setSearchValue] = useState<string>("");

  const {
    setShowModalEquipment,
    setEquipmentSelected,
    assignedEquipments,
    setAttachmentSelected,
    addAttachement,
  } = useEquipmentStore();

  const { setShowModalRental } = useRentalsStore();

  const handleAddEquipment = (equipmentId: string) => {
    const equipSelected = equipments?.find(
      (equipment) => equipment.number === equipmentId,
    );

    if (equipSelected) {
      setEquipmentSelected(equipSelected);
      setShowModalEquipment(true);
    }
  };

  const handleAddRental = () => {
    setShowModalRental(true);
  };

  const handleAddAttachment = (attachmentId: string) => {
    const attachSelected = attachments?.find(
      (attachment) => attachment.number === attachmentId,
    );

    setAttachmentSelected(attachSelected!);
    addAttachement();
  };

  // 1. Set de IDs asignados
  const assignedEquipmentsId = useMemo(
    () => new Set(assignedEquipments.map((equip) => equip.equipmentsId)),
    [assignedEquipments],
  );

  // 2. Filtrado derivado de Equipos (Sin useEffects)
  const filteredEquipments = useMemo(() => {
    if (!equipments) return [];

    const search = searchValue.trim().toLowerCase();

    return equipments.filter((equip) => {
      // 1. Debe ser de la familia "Equipment"
      if (equip.family !== "Equipment") return false;

      // 2. No debe estar ya asignado
      if (assignedEquipmentsId.has(equip.equipmentsId)) return false;

      // 3. Si no hay búsqueda, pasa el filtro
      if (!search) return true;

      // 4. Aplicar filtro de búsqueda
      return (
        equip.name.toLowerCase().includes(search) ||
        equip.number.toLowerCase().includes(search) ||
        equip.serialNumber.toLowerCase().includes(search)
      );
    });
  }, [equipments, assignedEquipmentsId, searchValue]);

  // 3. Filtrado derivado de Attachments (Sin useEffects)
  const filteredAttachments = useMemo(() => {
    if (!attachments) return [];

    const available = attachments.filter(
      (attach) => !assignedEquipmentsId.has(attach.attachmentsId),
    );

    if (!searchValue.trim()) return available;

    const search = searchValue.toLowerCase();
    return available.filter(
      (attach) =>
        attach.name.toLowerCase().includes(search) ||
        attach.number.toLowerCase().includes(search) ||
        attach.serialNumber.toLowerCase().includes(search) ||
        attach.family.toLowerCase().includes(search),
    );
  }, [attachments, assignedEquipmentsId, searchValue]);

  return (
    <>
      <Card
        style={{
          marginBottom: "10px",
        }}
      >
        <Card.Title
          style={{ textAlign: "center", backgroundColor: "lightgray" }}
        >
          <Row style={{ height: "45px" }}>
            <Col>
              <Button
                style={{ marginTop: "4px" }}
                variant="outline-primary"
                onClick={() => handleAddRental()}
              >
                <strong>Rented Equipment</strong>
              </Button>
            </Col>
            <Col
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontWeight: "bold",
              }}
            >
              <h4 className="m-0">Selection</h4>
            </Col>
            <Col
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Form.Control
                style={{ marginRight: "10px" }}
                type="text"
                onChange={(e) => setSearchValue(e.target.value)}
                value={searchValue}
                placeholder="Search..."
              />
            </Col>
          </Row>
        </Card.Title>
        <Tabs
          defaultActiveKey="Equipment"
          id="uncontrolled-tab-example"
          className="mb-3"
          justify
        >
          <Tab eventKey="Equipment" title="Equipment">
            <div
              style={{
                maxHeight: "30vh",
                overflowY: "auto",
                overflowX: "hidden",
              }}
            >
              <Table striped bordered hover style={{ textAlign: "center" }}>
                <thead>
                  <tr>
                    <th>Number</th>
                    <th>Name</th>
                    <th>S. Number</th>
                    <th>Hours</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {isEquipmentsLoading && (
                    <tr>
                      <td colSpan={5}>
                        <h2>Loading...</h2>
                      </td>
                    </tr>
                  )}
                  {equipmentsError && (
                    <tr>
                      <td colSpan={5}>
                        <h2>Error: {equipmentsError.message}</h2>
                      </td>
                    </tr>
                  )}
                  {!isEquipmentsLoading &&
                    !equipmentsError &&
                    filteredEquipments?.map((equipment) => (
                      <tr
                        key={equipment.equipmentsId + "E"}
                        style={{ verticalAlign: "middle" }}
                      >
                        <td>{equipment.number}</td>
                        <td>{equipment.name}</td>
                        <td>{equipment.serialNumber}</td>
                        <td>{equipment.hour}</td>
                        <td>
                          <Button
                            variant="outline-primary"
                            onClick={() => handleAddEquipment(equipment.number)}
                          >
                            Add
                          </Button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </Table>
            </div>
          </Tab>
          <Tab eventKey="Attachment" title="Attachment">
            <div
              style={{
                maxHeight: "30vh",
                overflowY: "auto",
                overflowX: "hidden",
              }}
            >
              <Table striped bordered hover style={{ textAlign: "center" }}>
                <thead>
                  <tr>
                    <th>Type</th>
                    <th>Number</th>
                    <th>Name</th>
                    <th>S. Number</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {isAttachmentsLoading && (
                    <tr>
                      <td colSpan={5}>
                        <h2>Loading...</h2>
                      </td>
                    </tr>
                  )}
                  {attachmentsError && (
                    <tr>
                      <td colSpan={5}>
                        <h2>Error: {attachmentsError.message}</h2>
                      </td>
                    </tr>
                  )}

                  {!isAttachmentsLoading &&
                    !attachmentsError &&
                    filteredAttachments?.map((attachment) => (
                      <tr
                        key={attachment.attachmentsId + "A"}
                        style={{ verticalAlign: "middle" }}
                      >
                        <td>{attachment.family}</td>
                        <td>{attachment.number}</td>
                        <td>{attachment.name}</td>
                        <td>{attachment.serialNumber}</td>
                        <td>
                          <Button
                            variant="outline-primary"
                            onClick={() =>
                              handleAddAttachment(attachment.number)
                            }
                          >
                            Add
                          </Button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </Table>
            </div>
          </Tab>
        </Tabs>
      </Card>
      <ModalEquipment />
      <ModalRental />
    </>
  );
}

export default List;
