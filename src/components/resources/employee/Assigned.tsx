import { Button, Col, Row, Table } from "react-bootstrap";
import useAssignmentStore from "../../../stores/useManpowerStore";
import { calculateHoursDifference } from "./utilities";
import useEmployees from "../../../hooks/useEmployees";

type Props = { handleShowModal: () => void };

function Assigned({ handleShowModal }: Props) {
  const { assignedEmployees, removeEmployee, setFormData, addSelection } =
    useAssignmentStore();
  const { data: employeesData } = useEmployees();

  const handleGetName = (employeeId: number) => {
    const employee = employeesData?.find(
      (employee) => employee.employeesId === employeeId
    );
    return employee?.firstName + " " + employee?.lastName;
  };

  const handleUpdate = (employeeId: number) => {
    const assignData = assignedEmployees.find(
      (assinment) => assinment.employeesId === employeeId
    );

    if (assignData) {
      const employee = employeesData?.find(
        (employee) => employee.employeesId === employeeId
      );

      if (employee) addSelection(employee);

      const data = {
        drEmployeesId: assignData?.drEmployeesId,
        dailyReportId: assignData?.dailyReportId,
        employeesId: employeeId,
        inHour: assignData?.inHour,
        outHour: assignData?.outHour,
        lunch: assignData?.lunch,
        ppe: assignData?.ppe,
        comment: assignData?.comment,
      };
      setFormData(data);
      handleShowModal();
    }
  };

  return (
    <>
      <div>
        <Row style={{ height: "70px", alignItems: "center" }}>
          <Col>
            <div>
              <h3>Assigned</h3>
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
                      style={{ verticalAlign: "middle" }}
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
                      <td>{assignment.inHour}</td>
                      <td>{assignment.outHour}</td>
                      <td>
                        {calculateHoursDifference(
                          assignment.inHour,
                          assignment.outHour,
                          assignment.lunch
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
                          onClick={() => handleUpdate(assignment.employeesId!)}
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
