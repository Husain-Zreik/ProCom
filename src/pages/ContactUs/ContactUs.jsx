function ContactUs() {
    return (
        <section className="contact-us">
            <h2>Contact Us</h2>
            <p>Have questions or need help? Reach out to us:</p>
            <form className="contact-us__form">
                <input type="text" placeholder="Your Name" required />
                <input type="email" placeholder="Your Email" required />
                <textarea placeholder="Your Message" required></textarea>
                <button type="submit">Send Message</button>
            </form>
        </section>
    );
}

export default ContactUs;
