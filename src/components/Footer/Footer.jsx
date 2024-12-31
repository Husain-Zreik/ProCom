import { Link } from "react-scroll";

function Footer() {
    return (
        <footer className="footer">
            <div className="footer__content">
                <div className="footer__brand">
                    <h2>ProCom</h2>
                    <p>Empowering innovation and excellence.</p>
                </div>
                <div className="footer__links">
                    <Link to="about" spy={true} smooth={true} duration={500} >About Us</Link>
                    <Link to="services" spy={true} smooth={true} duration={500} >Services</Link>
                    <Link to="contact" spy={true} smooth={true} duration={500} >Contact</Link>
                    <a href="#privacy-policy">Privacy Policy</a>
                    <a href="#terms-of-service">Terms of Service</a>
                </div>
                <div className="footer__social">
                    <a href="https://twitter.com" aria-label="Twitter">
                        <i className="fa-brands fa-x-twitter"></i>
                    </a>
                    <a href="https://facebook.com" aria-label="Facebook">
                        <i className="fa-brands fa-facebook"></i>
                    </a>
                    <a href="https://instagram.com" aria-label="Instagram">
                        <i className="fa-brands fa-instagram"></i>
                    </a>
                    <a href="https://linkedin.com" aria-label="LinkedIn">
                        <i className="fa-brands fa-linkedin"></i>
                    </a>
                </div>
            </div>
            <div className="footer__bottom">
                <p>&copy; {new Date().getFullYear()} ProCom. All rights reserved.</p>
            </div>
        </footer>
    );
}

export default Footer;
