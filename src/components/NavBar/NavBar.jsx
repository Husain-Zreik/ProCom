import { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars } from '@fortawesome/free-solid-svg-icons'
import { Link } from "react-router-dom";

const NavBar = () => {
    const [theme, setTheme] = useState("light");
    const [isMenuOpen, setIsMenuOpen] = useState(false);

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

    return (
        <div className="navbar__container">
            <div className="navbar">
                <div className="navbar__left">
                    <div className="navbar__logo">
                        <Link to="/">ProCom</Link>
                    </div>
                    {/* Navbar links */}
                    <ul className={`navbar__links ${isMenuOpen ? "show" : ""}`}>
                        <li>
                            <Link to="/" className="navbar__link">
                                Home
                            </Link>
                        </li>
                        <li>
                            <Link to="/about" className="navbar__link">
                                About
                            </Link>
                        </li>
                        <li>
                            <Link to="/services" className="navbar__link">
                                Services
                            </Link>
                        </li>
                        <li>
                            <Link to="/contact" className="navbar__link">
                                Contact
                            </Link>
                        </li>
                    </ul>
                </div>

                {/* Theme toggle and burger menu placed on the right */}
                <div className="navbar__right">
                    <div className="navbar__theme-toggle" onClick={toggleTheme}>
                        <span className={`theme-toggle-icon ${theme === "light" ? "sun" : "moon"}`} >
                            <i className={`fas fa-${theme === "light" ? "sun" : "moon"}`}></i>
                        </span>
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
                                <Link to="/" className="navbar__link" onClick={closeMenu}>
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link to="/about" className="navbar__link" onClick={closeMenu}>
                                    About
                                </Link>
                            </li>
                            <li>
                                <Link to="/services" className="navbar__link" onClick={closeMenu}>
                                    Services
                                </Link>
                            </li>
                            <li>
                                <Link to="/contact" className="navbar__link" onClick={closeMenu}>
                                    Contact
                                </Link>
                            </li>
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};

export default NavBar;
