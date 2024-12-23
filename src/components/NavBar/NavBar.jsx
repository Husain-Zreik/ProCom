import { useState, useEffect } from "react";
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

    return (
        <div className="navbar">
            <div className="navbar__logo">
                <Link to="/">MySite</Link>
            </div>

            {/* Hamburger menu for smaller screens */}
            <div className="navbar__hamburger" onClick={toggleMenu}>
                <span></span>
                <span></span>
                <span></span>
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

            {/* Theme toggle button */}
            <button className="navbar__theme-toggle" onClick={toggleTheme}>
                {theme === "light" ? "Dark Mode" : "Light Mode"}
            </button>
        </div>
    );
};

export default NavBar;
