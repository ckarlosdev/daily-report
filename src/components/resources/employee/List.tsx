import { Col, Form, ListGroup, Row } from "react-bootstrap";
import useEmployees from "../../../hooks/useEmployees";
import useAssignmentStore from "../../../stores/useManpowerStore";
import { useState } from "react";
import { VscSearch } from "react-icons/vsc";

type Props = {};

function List({}: Props) {
  const { data, error, isLoading } = useEmployees();
  const { selectedEmployees, addSelection, assignedEmployees } =
    useAssignmentStore();

  const [search, setSearch] = useState<string>("");

  if (error) return <h2>{error.message}</h2>;
  if (isLoading) return <h2>Loading...</h2>;

  const filteredData = data?.filter(
    (emp) =>
      emp.status === "Active" &&
      (emp.title === "Labor" || emp.title === "Supervisor")
  );

  const sortedData = filteredData?.sort((a, b) => {
    return a.firstName > b.firstName ? 1 : -1;
  });

  const assignedEmployeeIds = new Set(
    assignedEmployees.map((emp) => emp.employeesId)
  );

  const cleanedData = sortedData?.filter(
    (emp) => !assignedEmployeeIds.has(emp.employeesId)
  );

  const finalData = cleanedData?.filter((emp) =>
    emp.firstName.toLowerCase().includes(search.toLowerCase())
  );

  const handleSearch = (value: string) => {
    setSearch(value);
  };

  return (
    <div>
      <Row style={{ height: "80px" }}>
        <Col>
          <div>
            <div>
              <h4>Employees</h4>
            </div>
            <div className="d-flex align-items-center">
              <Form.Control
                type="text"
                id="inputSearch"
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
              />
              <VscSearch style={{ marginLeft: "8px" }} />
            </div>
          </div>
        </Col>
      </Row>
      <Row>
        <Col>
          <div
            style={{
              maxWidth: "400px",
              minHeight: "500px",
              maxHeight: "60vh",
              overflowY: "auto",
              overflowX: "hidden",
            }}
          >
            <ListGroup>
              {finalData?.map((employee) => (
                <ListGroup.Item
                  action
                  variant="light"
                  key={employee.employeesId}
                  onClick={() => addSelection(employee)}
                  active={selectedEmployees.some(
                    (emp) => emp.employeesId === employee.employeesId
                  )}
                >
                  <div className="ms-2 me-auto">
                    <div className="fw-bold">
                      {employee.firstName} {employee.lastName}
                    </div>
                    {employee.title}
                  </div>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </div>
        </Col>
      </Row>
    </div>
  );
}

export default List;
