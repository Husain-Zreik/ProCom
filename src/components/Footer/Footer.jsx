import { Link as RouterLink, useNavigate, useLocation } from "react-router-dom";
import { Link, scroller } from "react-scroll";
import { useEffect } from "react";

function Footer() {
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        if (location.state?.scrollTo) {
            scroller.scrollTo(location.state.scrollTo, {
                duration: 1500,
                delay: 0,
                smooth: "easeInOutQuart",
            });

            window.history.replaceState({}, document.title, location.pathname);
        }
    }, [location]);

    const handleNavigation = (section) => {
        if (location.pathname === "/") {
            scroller.scrollTo(section, {
                duration: 1500,
                delay: 0,
                smooth: "easeInOutQuart",
            });
        } else {
            navigate("/", { state: { scrollTo: section } });
        }
    };

    return (
        <footer className="footer">
            <div className="footer__content">
                <div className="footer__brand">
                    <h2>ProCom</h2>
                    <p>Empowering innovation and excellence.</p>
                </div>
                <div className="footer__links">
                    <Link onClick={() => handleNavigation("about")} spy={true} smooth={true} duration={500} className="navbar__link">
                        About
                    </Link>
                    <Link onClick={() => handleNavigation("services")} spy={true} smooth={true} duration={1500} className="navbar__link">
                        Services
                    </Link>
                    <Link onClick={() => handleNavigation("faqs")} spy={true} smooth={true} duration={2000} className="navbar__link">
                        FAQs
                    </Link>
                    <Link onClick={() => handleNavigation("contact")} spy={true} smooth={true} duration={2500} className="navbar__link">
                        Contact
                    </Link>
                    <RouterLink to="/privacy-policy" aria-label="Privacy Policy">
                        Privacy Policy
                    </RouterLink>
                </div>
                <div className="footer__social">
                    <a href="https://twitter.com" aria-label="Twitter" target="_blank" rel="noopener noreferrer">
                        <i className="fa-brands fa-twitter"></i>
                    </a>
                    <a href="https://facebook.com" aria-label="Facebook" target="_blank" rel="noopener noreferrer">
                        <i className="fa-brands fa-facebook"></i>
                    </a>
                    <a href="https://instagram.com" aria-label="Instagram" target="_blank" rel="noopener noreferrer">
                        <i className="fa-brands fa-instagram"></i>
                    </a>
                    <a href="https://linkedin.com" aria-label="LinkedIn" target="_blank" rel="noopener noreferrer">
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
