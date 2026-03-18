import { Button } from "react-bootstrap";
import hmbLogo from "../assets/hmbLogo.png";
import "../styles/buttons.css";
import LogoutButton from "./LogoutButton";
import { useAuthStore } from "../hooks/authStore";

type Props = {
  onPrint: () => void;
};

function Title({ onPrint }: Props) {
  const { user: userAuth } = useAuthStore();

  return (
    <div
      style={{
        textAlign: "center",
        marginTop: "20px",
        marginBottom: "10px",
      }}
    >
      <div>
        <img style={{ width: "250px" }} src={hmbLogo} alt="" />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: " 300px 1fr 300px" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Button
            variant="outline-danger"
            onClick={() => onPrint()}
            className="no-print"
            style={{ fontWeight: "bold" }}
          >
            Print Report (PDF)
          </Button>
        </div>
        <div>
          <h2
            style={{
              fontWeight: "bold",
              marginTop: "20px",
              marginBottom: "10px",
            }}
          >
            Daily Report
          </h2>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
          }}
        >
          <div
            style={{
              fontSize: "0.85rem",
              color: "#6c757d",
              borderRight: "1px solid #dee2e6",
              paddingRight: "15px",
              fontWeight: "500",
            }}
          >
            <span style={{ opacity: 0.7 }}>User: </span>
            <span className="text-dark">{userAuth?.fullName || "Guest"}</span>
          </div>
          <LogoutButton />
        </div>
      </div>
    </div>
  );
}

export default Title;
