import busPhoto from "../assets/images/bus.jpeg";
import tshwaneLogo from "../assets/images/city-icon.jpeg";
import "./TshwaneHeader.css";

function TshwaneHeader() {
  return (
    <header className="tshwane-header" aria-label="Tshwane Bus Service">
      <img className="tshwane-header__photo" src={busPhoto} alt="Tshwane bus" />

      <div className="tshwane-header__logo-badge">
        <img
          className="tshwane-header__logo"
          src={tshwaneLogo}
          alt="City of Tshwane"
        />
      </div>
    </header>
  );
}

export default TshwaneHeader;
