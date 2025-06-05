import React from "react";
import "./Footer.css";

function Footer() {
  return (
    <div className="footer__content">
      <p>Developed by Texan Tonjee &copy;</p>
      <p>{new Date().getFullYear()}</p>
    </div>
  );
}

export default Footer;
