import { Button, Card, Col, Row, Tab, Table, Tabs } from "react-bootstrap";
import useEquipmentStore from "../../../stores/useEquipmentStore";
import useEquipments from "../../../hooks/useEquipments";
import useEmployees from "../../../hooks/useEmployees";
import useAttachments from "../../../hooks/useAttachments";
import useRentalsStore from "../../../stores/useRentalsStore";

type Props = {};

function Assigned({}: Props) {
  const {
    assignedEquipments,
    removeEquipment,
    setHourModal,
    setEquipmentSelected,
    setOperatorId,
    setShowModalEquipment,
    setUpdateAssigned,
  } = useEquipmentStore();

  const {
    assignedRentals,
    removeRental,
    setRentalIdSelected,
    setUpdateData,
    setRentalName,
    setRentalCompanyName,
    setRentalNumber,
    setRentalType,
    setOdometerModal,
    setEmployeesId,
    setShowModalRental,
  } = useRentalsStore();

  const { data: equipments } = useEquipments();
  const { data: attachments } = useAttachments();
  const { data: employees } = useEmployees();

  const handleUpdateAssigned = (equipmentId: number) => {
    const equipSelected = equipments?.find(
      (equipment) => equipment.equipmentsId === equipmentId
    );
    if (equipSelected) {
      setEquipmentSelected(equipSelected);
      setHourModal(
        Number(
          assignedEquipments.find((equip) => equip.equipmentsId === equipmentId)
            ?.newHour
        )
      );
      setOperatorId(
        assignedEquipments.find((equip) => equip.equipmentsId === equipmentId)
          ?.employeesId || 51
      );
      setUpdateAssigned(true);
      setShowModalEquipment(true);
    }
  };

  const handleUpdateRental = (temporalId: string) => {
    setUpdateData(true);
    setRentalIdSelected(temporalId);

    const rental = assignedRentals.find((r) => r.temporalId === temporalId);
    if (rental) {
      setRentalName(rental.equipmentName);
      setRentalCompanyName(rental.company);
      setRentalNumber(rental.equipmentNumber);
      setRentalType(rental.equipmentType);
      setOdometerModal(rental.odometer);
      setEmployeesId(rental.employeesId);
    }
    setShowModalRental(true);
  };

  const counts = assignedEquipments.reduce(
    (acc, item) => {
      if (item.type === "Equipment") {
        acc.E += 1;
      } else if (item.type === "Attachment") {
        acc.A += 1;
      }
      return acc;
    },
    { E: 0, A: 0 }
  );

  const equipmentTabTitle = `HM Brandt ( E: ${counts.E} - A: ${counts.A} )`;
  // console.log("Assigned Equipments Rendered",assignedRentals);

  return (
    <>
      <Card style={{ overflowX: "hidden" }}>
        <Card.Title
          style={{ textAlign: "center", backgroundColor: "lightgray" }}
        >
          <Row style={{ height: "35px" }}>
            <Col
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontWeight: "bold",
              }}
            >
              <h4>Equipments & Attachments Added</h4>
            </Col>
          </Row>
        </Card.Title>
        <Tabs
          defaultActiveKey="hmbrandt"
          id="uncontrolled-tab-example"
          className="mb-3"
          justify
        >
          <Tab eventKey="hmbrandt" title={equipmentTabTitle}>
            <div
              style={{
                maxHeight: "30vh",
                overflowY: "auto",
                overflowX: "hidden",
              }}
            >
              <div style={{ maxHeight: "30vh", overflowY: "auto" }}>
                <Table striped bordered hover style={{ textAlign: "center" }}>
                  <thead>
                    <tr>
                      <th>Remove</th>
                      <th>Type</th>
                      <th>Number</th>
                      <th>Name</th>
                      <th>Operator</th>
                      <th>Odometer</th>
                      <th>Update</th>
                    </tr>
                  </thead>
                  <tbody>
                    {assignedEquipments.map((equip) => {
                      const equipment =
                        equip.type === "Equipment"
                          ? equipments?.find(
                              (e) => e.equipmentsId === equip.equipmentsId
                            )
                          : attachments?.find(
                              (a) => a.attachmentsId === equip.equipmentsId
                            );

                      const employee = employees?.find(
                        (emp) => emp.employeesId === equip.employeesId
                      );

                      return (
                        <tr
                          key={equip.equipmentsId}
                          style={{ verticalAlign: "middle" }}
                        >
                          <td>
                            <Button
                              variant="outline-danger"
                              onClick={() => {
                                removeEquipment(equip.equipmentsId);
                              }}
                            >
                              Remove
                            </Button>
                          </td>
                          <td>
                            {equip.type === "Equipment"
                              ? "Equipment"
                              : "Attachment"}
                          </td>
                          <td>{equipment?.number}</td>
                          <td>{equipment?.name}</td>
                          <td>
                            {equipment?.family == "Equipment"
                              ? employee?.firstName + " " + employee?.lastName
                              : "N/A"}
                          </td>
                          <td>{equip.newHour}</td>
                          <td>
                            <Button
                              variant="outline-primary"
                              onClick={() => {
                                handleUpdateAssigned(equip.equipmentsId);
                              }}
                              disabled={equip.type === "Attachment"}
                            >
                              Update
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              </div>
            </div>
          </Tab>
          <Tab eventKey="Rentals" title={`Rentals (${assignedRentals.length})`}>
            <div
              style={{
                maxHeight: "30vh",
                overflowY: "auto",
                overflowX: "hidden",
              }}
            >
              <div style={{ maxHeight: "30vh", overflowY: "auto" }}>
                <Table striped bordered hover style={{ textAlign: "center" }}>
                  <thead>
                    <tr>
                      <th>Remove</th>
                      <th>Type</th>
                      <th>Number</th>
                      <th>Name</th>
                      <th>Company</th>
                      <th>Operator</th>
                      <th>Odometer</th>
                      <th>Update</th>
                    </tr>
                  </thead>
                  <tbody>
                    {assignedRentals.map((rental) => {
                      const employee = employees?.find(
                        (emp) => emp.employeesId === rental.employeesId
                      );

                      return (
                        <tr
                          key={rental.temporalId}
                          style={{ verticalAlign: "middle" }}
                        >
                          <td>
                            <Button
                              variant="outline-danger"
                              onClick={() => {
                                removeRental(rental.temporalId);
                              }}
                            >
                              Remove
                            </Button>
                          </td>
                          <td>Rental</td>

                          <td>{rental.equipmentNumber}</td>
                          <td>{rental.equipmentName}</td>
                          <td>{rental.company}</td>
                          <td>
                            {employee?.firstName + " " + employee?.lastName}
                          </td>
                          <td>{rental.odometer}</td>
                          <td>
                            <Button
                              variant="outline-primary"
                              onClick={() => {
                                handleUpdateRental(rental.temporalId);
                              }}
                            >
                              Update
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              </div>
            </div>
          </Tab>
        </Tabs>
      </Card>
    </>
  );
}

export default Assigned;
