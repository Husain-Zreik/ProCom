
function Footer() {
    return (
        <footer className="footer">
            <p>&copy; {new Date().getFullYear()} Your Company. All rights reserved.</p>
            <div className="footer__links">
                <a href="#privacy-policy">Privacy Policy</a>
                <a href="#terms-of-service">Terms of Service</a>
            </div>
        </footer>
    );
}

export default Footer;
