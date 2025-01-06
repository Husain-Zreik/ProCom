import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-scroll";
import { ReactSVG } from "react-svg";
import Switch from "../Switch/Switch";
import { useLocation, useNavigate } from "react-router-dom";

const NavBar = () => {
    const [theme, setTheme] = useState("dark");
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const location = useLocation();
    const navigate = useNavigate();

    // Sync the theme with the body class
    useEffect(() => {
        document.body.classList.remove("light", "dark");
        document.body.classList.add(theme);
    }, [theme]);

    // Toggle the theme
    const toggleTheme = () => {
        setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
    };

    // Toggle menu visibility
    const toggleMenu = () => {
        setIsMenuOpen((prevMenuState) => !prevMenuState);
    };

    // Close the menu
    const closeMenu = () => {
        setIsMenuOpen(false);
    };

    const handleNavigation = (section) => {
        if (location.pathname !== "/") {
            navigate("/", { state: { scrollTo: section } });
        }
        isMenuOpen ? closeMenu() : null;
    };

    return (
        <div className="navbar__container">
            <div className="navbar">
                <Link to="/">
                    <div className="navbar__logo">
                        <ReactSVG src="/PRC-Logo/Globe-logo.svg" />
                        <h1>OCOM</h1>
                    </div>
                </Link>
                <div className="navbar__left">
                    {/* Navbar links */}
                    <ul className={`navbar__links ${isMenuOpen ? "show" : ""}`}>
                        <li>
                            <Link to="about" onClick={() => handleNavigation("about")} spy={true} smooth={true} duration={500} className="navbar__link">
                                About
                            </Link>
                        </li>
                        <li>
                            <Link to="arrivals" onClick={() => handleNavigation("arrivals")} spy={true} smooth={true} duration={1000} className="navbar__link">
                                Arrivals
                            </Link>
                        </li>
                        <li>
                            <Link to="services" onClick={() => handleNavigation("services")} spy={true} smooth={true} duration={1500} className="navbar__link">
                                Services
                            </Link>
                        </li>
                        <li>
                            <Link to="faqs" onClick={() => handleNavigation("faqs")} spy={true} smooth={true} duration={2000} className="navbar__link">
                                FAQs
                            </Link>
                        </li>
                        <li>
                            <Link to="contact" onClick={() => handleNavigation("contact")} spy={true} smooth={true} duration={2500} className="navbar__link">
                                Contact
                            </Link>
                        </li>
                    </ul>
                </div>

                {/* Theme toggle and burger menu placed on the right */}
                <div className="navbar__right">
                    <div className="navbar__theme-toggle" onClick={toggleTheme}>
                        <Switch onClick={toggleTheme} />
                    </div>

                    <FontAwesomeIcon className="navbar__hamburger" icon={faBars} size="lg" onClick={toggleMenu} />
                </div>

                {/* Navbar links overlay */}
                {isMenuOpen && (
                    <div className="navbar__overlay">
                        <div className="navbar__overlay-close" onClick={closeMenu}>
                            <i className="fa-solid fa-xmark"></i>
                        </div>
                        <ul className="navbar__links">
                            <li>
                                <Link to="about" onClick={() => handleNavigation("about")} spy={true} smooth={true} duration={500} className="navbar__link" >
                                    About
                                </Link>
                            </li>
                            <li>
                                <Link to="arrivals" onClick={() => handleNavigation("arrivals")} spy={true} smooth={true} duration={1000} className="navbar__link" >
                                    Arrivals
                                </Link>
                            </li>
                            <li>
                                <Link to="services" onClick={() => handleNavigation("services")} spy={true} smooth={true} duration={1500} className="navbar__link" >
                                    Services
                                </Link>
                            </li>
                            <li>
                                <Link to="faqs" onClick={() => handleNavigation("faqs")} spy={true} smooth={true} duration={2000} className="navbar__link" >
                                    FAQs
                                </Link>
                            </li>
                            <li>
                                <Link to="contact" onClick={() => handleNavigation("contact")} spy={true} smooth={true} duration={2500} className="navbar__link" >
                                    Contact
                                </Link>
                            </li>

                            <li>
                                <Switch onClick={toggleTheme} />
                            </li>
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};

export default NavBar;
