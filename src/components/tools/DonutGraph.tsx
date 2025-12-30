import { Doughnut } from "react-chartjs-2";
import { Card } from "react-bootstrap";

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
ChartJS.register(ArcElement, Tooltip, Legend);

type Props = {};

const data = {
  labels: ["Employees", "Equipment", "Trucks"],
  datasets: [
    {
      data: [120, 50, 30], // Ejemplo de conteo de recursos
      backgroundColor: ["#36A2EB", "#FFCE56", "#FF6384"],
      hoverBackgroundColor: ["#36A2EB", "#FFCE56", "#FF6384"],
      borderWidth: 1,
    },
  ],
};

function DonutGraph({}: Props) {
  return (
    <>
      <Card>
        <Card.Body>
          <Card.Title>Resumen de Recursos</Card.Title>
          <div style={{ height: "250px" }}>
            {/* Aquí usas el componente de la gráfica */}
            <Doughnut data={data} />
          </div>
        </Card.Body>
      </Card>
    </>
  );
}

export default DonutGraph;
