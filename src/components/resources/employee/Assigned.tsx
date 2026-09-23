import { Button, Col, Row, Table } from "react-bootstrap";
import useAssignmentStore from "../../../stores/useManpowerStore";
import { calculateHoursDifference } from "./utilities";
import useEmployees from "../../../hooks/useEmployees";

type Props = { handleShowModal: () => void };

function Assigned({ handleShowModal }: Props) {
  const {
    assignedEmployees,
    removeEmployee,
    setFormData,
    syncSelectedWithAssigned,
    assignedSelected,
    toggleAssigned,
    setEditMode,
  } = useAssignmentStore();
  const { data: employeesData } = useEmployees();

  const handleGetName = (employeeId: number) => {
    const employee = employeesData?.find(
      (employee) => employee.employeesId === employeeId,
    );
    return employee?.firstName + " " + employee?.lastName;
  };

  const handleUpdate = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    employeeId: number,
  ) => {
    e.stopPropagation();
    setEditMode(true);

    const assignData = assignedEmployees.find(
      (assignment) => assignment.employeesId === employeeId,
    );

    if (assignData) {
      const isAlreadyInBulk = assignedSelected.some(
        (a) => a.employeesId === employeeId,
      );

      if (!isAlreadyInBulk) {
        toggleAssigned(assignData); // Lo marcamos si no estaba
      }

      if (employeesData) {
        syncSelectedWithAssigned(employeesData);
      }

      setFormData({
        ...assignData,
        inHour: assignData.inHour?.slice(0, 5) || "07:00",
        outHour: assignData.outHour?.slice(0, 5) || "17:30",
      });

      handleShowModal();
    }
  };

  // console.log("assignedEmployees: ", assignedEmployees);

  return (
    <>
      <div>
        <Row style={{ height: "70px", alignItems: "center" }}>
          <Col>
            <div>
              <h3>Assigned</h3>
              {/* <Add></Add> */}
            </div>
          </Col>
        </Row>
        <Row>
          <Col>
            <div
              style={{
                backgroundColor: "#f3f3f3",
                minHeight: "66vh",
                maxHeight: "60vh",
                overflowY: "auto",
                overflowX: "auto",
              }}
            >
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Ramove</th>
                    <th>Name</th>
                    <th>In</th>
                    <th>Out</th>
                    <th>Hours</th>
                    <th>Lunch</th>
                    <th>PPE</th>
                    <th>Update</th>
                  </tr>
                </thead>
                <tbody>
                  {assignedEmployees.map((assignment) => (
                    <tr
                      key={assignment.employeesId}
                      style={{ verticalAlign: "middle", cursor: "pointer" }}
                      className={
                        assignedSelected.includes(assignment)
                          ? "table-primary"
                          : ""
                      }
                      onClick={() => toggleAssigned(assignment)}
                    >
                      <td>
                        <Button
                          variant="outline-danger"
                          onClick={() =>
                            removeEmployee(assignment.employeesId!)
                          }
                          style={{
                            width: "35px",
                            height: "35px",
                            fontWeight: "bold",
                            fontSize: "15px",
                          }}
                        >
                          X
                        </Button>
                      </td>
                      <td>{handleGetName(assignment.employeesId!)}</td>
                      <td>{assignment.inHour?.slice(0, 5)}</td>
                      <td>{assignment.outHour?.slice(0, 5)}</td>
                      <td>
                        {calculateHoursDifference(
                          assignment.inHour,
                          assignment.outHour,
                          assignment.lunch,
                        )}
                      </td>
                      <td>
                        {assignment.lunch ? (
                          <span className="badge text-bg-success">Yes</span>
                        ) : (
                          <span className="badge text-bg-secondary">No</span>
                        )}
                      </td>
                      <td>
                        {assignment.ppe ? (
                          <span className="badge text-bg-success">
                            Completed
                          </span>
                        ) : (
                          <span className="badge text-bg-warning">
                            Incompleted
                          </span>
                        )}
                      </td>
                      <td>
                        <Button
                          variant="outline-primary"
                          style={{
                            width: "75px",
                            height: "35px",
                            fontWeight: "bold",
                            fontSize: "14px",
                          }}
                          onClick={(e) =>
                            handleUpdate(e, assignment.employeesId!)
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
          </Col>
        </Row>
      </div>
    </>
  );
}

export default Assigned;
