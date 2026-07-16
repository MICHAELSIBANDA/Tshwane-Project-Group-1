import { Outlet } from "react-router-dom";
import TshwaneHeader from "../components/TshwaneHeader";
import "./TshwaneLayout.css";

function TshwaneLayout() {
  return (
    <div className="tshwane-layout">
      <TshwaneHeader />
      <Outlet />
    </div>
  );
}

export default TshwaneLayout;
