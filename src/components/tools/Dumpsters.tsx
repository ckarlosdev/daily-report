import {
  Button,
  Card,
  Col,
  OverlayTrigger,
  Row,
  Tooltip,
} from "react-bootstrap";
import Donut from "./Donut";
import CardTotal from "./CardTotal";
import useDumpsterStore from "../../stores/useDumpsterStore";
import {
  BASE_MATERIALS,
  calculateTotals,
  isBaseMaterial,
} from "../../utils/dumpsters";

type Props = {};

function Dumpsters({}: Props) {
  const { setShowModalDumpster, tableData, materials } = useDumpsterStore();

  const { byMaterial, grandTotal } = calculateTotals(tableData, materials);

  // Todo lo que no es Concrete / Metal / C&D se agrupa en Others
  const others = materials
    .filter((m) => !isBaseMaterial(m))
    .map((m) => ({ material: m, total: byMaterial[m]?.total ?? 0 }))
    .filter((o) => o.total > 0);
  const othersTotal = others.reduce((acc, o) => acc + o.total, 0);

  const othersCard = <CardTotal qty={othersTotal} label="Others" />;

  return (
    <>
      <Col>
        <Card style={{ marginBottom: "2px" }}>
          <Card.Body>
            <Card.Title style={{ textAlign: "center" }}>
              <Button
                variant="secondary"
                style={{ fontWeight: "bold", width: "200px", fontSize: "" }}
                onClick={() => setShowModalDumpster(true)}
              >
                Dumpsters
              </Button>
            </Card.Title>
            <Row>
              <Col>
                <div
                  style={{
                    border: "2px solid lightgray",
                    borderRadius: "7px",
                    display: "grid",
                    gridTemplateColumns: "auto auto",
                    height: "218px",
                    alignContent: "center",
                    justifyContent: "center",
                    gap: "10px",
                    minWidth: "300px",
                  }}
                >
                  {BASE_MATERIALS.map((material) => (
                    <CardTotal
                      key={material}
                      qty={byMaterial[material]?.total ?? 0}
                      label={material}
                    />
                  ))}
                  {others.length > 0 ? (
                    <OverlayTrigger
                      placement="top"
                      overlay={
                        <Tooltip id="dumpsters-others-tooltip">
                          {others.map((o) => (
                            <div key={o.material}>
                              {o.material}: {o.total}
                            </div>
                          ))}
                        </Tooltip>
                      }
                    >
                      <div style={{ cursor: "help" }}>{othersCard}</div>
                    </OverlayTrigger>
                  ) : (
                    othersCard
                  )}
                </div>
              </Col>
              <Col>
                <Donut value={grandTotal} />
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </Col>
    </>
  );
}

export default Dumpsters;
