import { FormEvent, useState } from "react";
import {
  Badge,
  Button,
  Card,
  CloseButton,
  Col,
  Form,
  InputGroup,
  ListGroup,
  Modal,
  Row,
  Table,
} from "react-bootstrap";
import useDumpsterStore from "../../stores/useDumpsterStore";
import { DumpsterRow } from "../../types";
import {
  MATERIAL_MAX_LENGTH,
  MATERIAL_SUGGESTIONS,
  SOURCES,
  SOURCE_LABELS,
  calculateTotals,
  isBaseMaterial,
} from "../../utils/dumpsters";
import dumpsterIcon from "../../assets/dumpster.png";

type Props = {};

function ModalDumpsters({}: Props) {
  const {
    showModalDumpster,
    setShowModalDumpster,
    tableData,
    materials,
    setQuantity,
    addMaterial,
    removeMaterial,
  } = useDumpsterStore();

  const [selectedMaterial, setSelectedMaterial] = useState(materials[0]);
  const [newMaterial, setNewMaterial] = useState("");
  const [error, setError] = useState("");

  // Si el material seleccionado ya no existe (se quitó o se cargó otro reporte)
  const activeMaterial = materials.includes(selectedMaterial)
    ? selectedMaterial
    : materials[0];

  const { byMaterial, grandTotal } = calculateTotals(tableData, materials);
  const activeTotals = byMaterial[activeMaterial];

  // Tamaños en el orden de la tabla (incluye tamaños extra que vengan de BD)
  const sizes = Array.from(new Set(tableData.map((row) => row.size)));
  const rowsByKey = new Map<string, DumpsterRow>(
    tableData.map((row) => [`${row.type}|${row.size}`, row]),
  );

  const suggestions = MATERIAL_SUGGESTIONS.filter(
    (s) => !materials.some((m) => m.toLowerCase() === s.toLowerCase()),
  );

  const handleAddMaterial = (e: FormEvent) => {
    e.preventDefault();
    const result = addMaterial(newMaterial);
    if (result.ok) {
      setSelectedMaterial(result.name);
      setNewMaterial("");
      setError("");
    } else {
      if (result.existing) setSelectedMaterial(result.existing);
      setError(result.error);
    }
  };

  const handleRemoveMaterial = (material: string) => {
    const total = byMaterial[material]?.total ?? 0;
    if (
      total > 0 &&
      !window.confirm(
        `Remove "${material}"? Its ${total} dumpster(s) will be deleted from this report.`,
      )
    ) {
      return;
    }
    removeMaterial(material);
  };

  return (
    <>
      <Modal
        show={showModalDumpster}
        onHide={() => setShowModalDumpster(false)}
        size="lg"
      >
        <Modal.Header closeButton className="justify-content-center">
          <Modal.Title className="w-100 text-center">
            <img
              src={dumpsterIcon}
              alt="Dumpster Icon"
              className="me-2"
              style={{ height: "50px" }}
            />
            Dumpsters
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row className="g-3">
            {/* Lista de materiales */}
            <Col md={4}>
              <Card className="h-100">
                <Card.Header className="fw-bold text-center">
                  Materials
                </Card.Header>
                <ListGroup
                  variant="flush"
                  style={{ maxHeight: "330px", overflowY: "auto" }}
                >
                  {materials.map((material) => {
                    const isActive = material === activeMaterial;
                    const total = byMaterial[material]?.total ?? 0;
                    return (
                      <ListGroup.Item
                        key={material}
                        as="div"
                        action
                        active={isActive}
                        role="button"
                        tabIndex={0}
                        onClick={() => setSelectedMaterial(material)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            setSelectedMaterial(material);
                          }
                        }}
                        className="d-flex justify-content-between align-items-center gap-2"
                      >
                        <span className="text-truncate" title={material}>
                          {material}
                        </span>
                        <span className="d-flex align-items-center gap-2">
                          <Badge
                            pill
                            bg={isActive ? "light" : total > 0 ? "primary" : "secondary"}
                            text={isActive ? "dark" : undefined}
                          >
                            {total}
                          </Badge>
                          {!isBaseMaterial(material) && (
                            <CloseButton
                              variant={isActive ? "white" : undefined}
                              aria-label={`Remove ${material}`}
                              style={{ fontSize: "0.7rem" }}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRemoveMaterial(material);
                              }}
                            />
                          )}
                        </span>
                      </ListGroup.Item>
                    );
                  })}
                </ListGroup>
                <Card.Footer>
                  <Form onSubmit={handleAddMaterial}>
                    <InputGroup size="sm" hasValidation>
                      <Form.Control
                        list="dumpster-material-suggestions"
                        placeholder="Add material"
                        value={newMaterial}
                        maxLength={MATERIAL_MAX_LENGTH}
                        isInvalid={!!error}
                        onChange={(e) => {
                          setNewMaterial(e.target.value);
                          if (error) setError("");
                        }}
                      />
                      <Button
                        type="submit"
                        variant="outline-primary"
                        style={{ fontWeight: "bold" }}
                      >
                        +
                      </Button>
                      <Form.Control.Feedback type="invalid">
                        {error}
                      </Form.Control.Feedback>
                    </InputGroup>
                    <datalist id="dumpster-material-suggestions">
                      {suggestions.map((s) => (
                        <option key={s} value={s} />
                      ))}
                    </datalist>
                  </Form>
                </Card.Footer>
              </Card>
            </Col>

            {/* Captura del material seleccionado */}
            <Col md={8}>
              <Card className="h-100">
                <Card.Header className="fw-bold text-center">
                  {activeMaterial}
                </Card.Header>
                <Card.Body className="p-2">
                  <Table
                    striped
                    bordered
                    hover
                    size="sm"
                    className="text-center align-middle mb-0"
                  >
                    <thead>
                      <tr>
                        <th>Size</th>
                        {SOURCES.map((source) => (
                          <th key={source}>{SOURCE_LABELS[source]}</th>
                        ))}
                        <th>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sizes.map((size) => {
                        let rowTotal = 0;
                        return (
                          <tr key={size}>
                            <td style={{ fontWeight: "bold" }}>{size}</td>
                            {SOURCES.map((source) => {
                              const row = rowsByKey.get(`${source}|${size}`);
                              if (!row) return <td key={source}>—</td>;
                              const qty = row.values[activeMaterial] ?? 0;
                              rowTotal += qty;
                              return (
                                <td key={source}>
                                  <input
                                    type="number"
                                    min={0}
                                    value={qty.toString()}
                                    aria-label={`${activeMaterial} ${SOURCE_LABELS[source]} ${size}`}
                                    onFocus={(e) => e.target.select()}
                                    onChange={(e) =>
                                      setQuantity(
                                        source,
                                        row.size,
                                        activeMaterial,
                                        e.target.value,
                                      )
                                    }
                                    style={{
                                      width: "70px",
                                      textAlign: "center",
                                    }}
                                  />
                                </td>
                              );
                            })}
                            <td className="fw-bold">{rowTotal}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                    <tfoot>
                      <tr className="fw-bold">
                        <td>Total</td>
                        {SOURCES.map((source) => (
                          <td key={source}>{activeTotals?.[source] ?? 0}</td>
                        ))}
                        <td>{activeTotals?.total ?? 0}</td>
                      </tr>
                    </tfoot>
                  </Table>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Resumen de todos los materiales */}
          <div className="d-flex flex-wrap justify-content-center align-items-center gap-2 mt-3 pt-2 border-top">
            {materials
              .filter((m) => (byMaterial[m]?.total ?? 0) > 0)
              .map((m) => (
                <Badge key={m} bg="light" text="dark" className="border fs-6">
                  {m}: {byMaterial[m].total}
                </Badge>
              ))}
            <span className="fw-bold ms-2">Total: {grandTotal}</span>
          </div>
        </Modal.Body>
        <Modal.Footer className="justify-content-center">
          <Button
            variant="primary"
            style={{ fontWeight: "bold", fontSize: "20px", width: "150px" }}
            onClick={() => setShowModalDumpster(false)}
          >
            Ok
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ModalDumpsters;
