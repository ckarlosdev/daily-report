// import React from "react";
import { Button, Card, Col, Row } from "react-bootstrap";
import Donut from "./Donut";
import CardTotal from "./CardTotal";
import useDumpsterStore from "../../stores/useDumpsterStore";

type Props = {};

function Dumpsters({}: Props) {
  const { setShowModalDumpster, tableData } = useDumpsterStore();

  const calculateSubtotalsClean = () => {
    return tableData.reduce((acc, row) => {
      const { type, Concrete, Metal, "C&D": CD } = row;

      if (!acc[type]) {
        acc[type] = { Concrete: 0, Metal: 0, "C&D": 0 };
      }

      acc[type].Concrete += Concrete;
      acc[type].Metal += Metal;
      acc[type]["C&D"] += CD;

      return acc;
    }, {});
  };

  const totalDisposal = calculateSubtotalsClean().Disposal || {
    Concrete: 0,
    Metal: 0,
    "C&D": 0,
  };
  const totalExternal = calculateSubtotalsClean().External || {
    Concrete: 0,
    Metal: 0,
    "C&D": 0,
  };

  const totalConcrete = totalDisposal.Concrete + totalExternal.Concrete;
  const totalMetal = totalDisposal.Metal + totalExternal.Metal;
  const totalCD = totalDisposal["C&D"] + totalExternal["C&D"];

  const totalAll = totalConcrete + totalMetal + totalCD;

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
                    gridTemplateColumns: "auto auto auto",
                    // gridTemplateRows: "auto auto",
                    height: "218px",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "10px",
                    minWidth: "300px",
                  }}
                >
                  <CardTotal qty={totalConcrete} label="Concrete" />
                  <CardTotal qty={totalMetal} label="Metal" />
                  <CardTotal qty={totalCD} label="C&D" />
                </div>
              </Col>
              <Col>
                <Donut value={totalAll} />
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </Col>
    </>
  );
}

export default Dumpsters;
