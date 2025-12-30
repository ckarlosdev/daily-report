import { Card } from "react-bootstrap";

const donutStyle = {
  // Dimensiones del círculo
  width: "120px",
  height: "120px",
  borderRadius: "50%", // Hace que sea un círculo

  // Crea el efecto de 'dona' (anillo) usando un borde grueso
  border: "15px solid #5d8acb", // Color primario del anillo
  //   borderColor: "rgba(63, 81, 181, 0.3)", // Color base transparente para el anillo
  //   borderTopColor: "#3f51b5", // Color principal para una parte del anillo (opcional: simula progreso)

  // Centrado del contenido (el número)
  display: "flex",
  justifyContent: "center",
  alignItems: "center",

  // Margen y fuente del número
  margin: "20px auto", // Centra la dona horizontalmente en su contenedor
  fontSize: "2em",
  fontWeight: "bold",
  color: "#5d8acb",
};

type Props = { value: number };

function Donut({ value }: Props) {
  return (
    <>
      <Card className="text-center">
        <Card.Body>
          <div style={donutStyle}>
            {value}
          </div>
          <Card.Text>Total</Card.Text>
        </Card.Body>
      </Card>
    </>
  );
}

export default Donut;
