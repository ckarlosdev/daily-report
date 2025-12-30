import { Button, Form, Modal, Table } from "react-bootstrap";
import useEquipmentStore from "../../../stores/useEquipmentStore";
import useEquipments from "../../../hooks/useEquipments";
import useEmployees from "../../../hooks/useEmployees";

type Props = {};

function ModalOdometers({}: Props) {
  const {
    showModalOdometer,
    setShowModalOdometer,
    equipmentsListCopied,
    assignHoursToEquipment,
    assignOperatorToEquipment,
    resetEquipmentCopied,
  } = useEquipmentStore();
  const { data: equipmentsData } = useEquipments();
  const { data: employeesData } = useEmployees();

  const employeesFiltered = employeesData?.filter(
    (emp) =>
      emp.status === "Active" &&
      (emp.title === "Labor" || emp.title === "Supervisor")
  );

  const employeesSorted = employeesFiltered?.sort((a, b) => {
    return a.firstName > b.firstName ? 1 : -1;
  });

  return (
    <>
      <Modal
        size="lg"
        show={showModalOdometer}
        onHide={() => setShowModalOdometer(false)}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            Please change Operators and Odometer if needed.
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Table striped bordered hover size="sm">
            <thead>
              <tr>
                <th>Number</th>
                <th>Name</th>
                <th>Operator</th>
                <th>Odometer</th>
              </tr>
            </thead>
            <tbody>
              {equipmentsListCopied.map((equipment) => {
                if (equipment.type !== "Equipment") return null;

                const equip = equipmentsData?.find(
                  (e) => e.equipmentsId === equipment.equipmentsId
                );

                // const emp = employeesData?.find(
                //   (e) => e.employeesId === equipment.employeesId
                // );

                return (
                  <tr key={equipment.equipmentsId}>
                    <td>{equip?.number}</td>
                    <td>{equip ? equip.name : "Unknown"}</td>
                    <td>
                      <Form.Select
                        aria-label="Select Operator"
                        value={equipment.employeesId || 51}
                        onChange={(e) =>
                          assignOperatorToEquipment(
                            equipment.equipmentsId,
                            Number(e.target.value)
                          )
                        }
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
                    </td>
                    <td>
                      <Form.Control
                        aria-label="Small"
                        aria-describedby="inputGroup-sizing-sm"
                        type="number"
                        min={0}
                        value={equipment.newHour}
                        onChange={(e) =>
                          assignHoursToEquipment(
                            equipment.equipmentsId,
                            e.target.value
                          )
                        }
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="primary"
            onClick={() => {
              setShowModalOdometer(false);
              resetEquipmentCopied();
            }}
          >
            Done
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ModalOdometers;
