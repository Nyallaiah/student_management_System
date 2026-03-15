import { Link } from "react-router-dom";
import "../styles/Footer.css";

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <p>&copy; {currentYear} @026 SRMS. All rights reserved.</p>
    </footer>
  );
}

export default Footer;

