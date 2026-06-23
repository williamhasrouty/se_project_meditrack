import "./Footer.css";

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <p className="footer__copyright">© {currentYear} MedTrack</p>
    </footer>
  );
}

export default Footer;
