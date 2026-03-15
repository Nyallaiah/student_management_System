import { Link } from "react-router-dom";
import "../styles/Navbar.css";

function Navbar() {
  return (
    <nav className="navbar">
      <h2 className="logo">Student Record System</h2>
      <div>
        <Link to="/">Home</Link>
        <Link to="/login" className="login-btn">Login</Link>
      </div>
    </nav>
  );
}

export default Navbar;
