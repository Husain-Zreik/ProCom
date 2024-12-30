import { useState } from 'react';
import SectionHeader from '../../components/SectionHeader/SectionHeader';

const ContactUs = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [error, setError] = useState('');

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value
        }));
    };

    const validateForm = () => {
        const { name, email, subject, message } = formData;
        if (!name || !email || !subject || !message) {
            setError('Please fill out all fields before submitting.');
            return false;
        }
        setError('');
        return true;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            // Add form submission logic here (e.g., API call)
            console.log(formData);
        }
    };

    return (
        <section id="contact" className="contact">
            <div className="contact__content">
                <SectionHeader title="Contact Us" isColored={true} />

                <div className="contact__layout">
                    {/* Map and Contact Info Combined in a Card */}
                    <div className="contact__card">
                        <div className="contact__details">
                            <h3>Contact Information</h3>
                            <p><strong>Phone:</strong> +1 (123) 456-7890</p>
                            <p><strong>Email:</strong> support@procom.com</p>
                            <p><strong>Business Hours:</strong> Mon - Fri, 9 AM - 6 PM</p>
                            <p><strong>Address:</strong> 123 Innovation Avenue, Tech City, 56789, Country</p>
                        </div>
                        <div className="contact__map">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d13252.555498699307!2d35.51621659515105!3d33.86031168605685!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x151f173b2e3865c7%3A0xa5d6af4dfafd9832!2sPC%20Globalco%20S.A.L%20Off-Shore!5e0!3m2!1sen!2slb!4v1735560642926!5m2!1sen!2slb"
                                width="100%"
                                height="200"
                                style={{ border: 0 }}
                                allowFullScreen=""
                                loading="lazy"
                                title="ProCom Office Location"
                            />
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="contact__form">
                        <h3>Contact Form</h3>
                        <form onSubmit={handleSubmit}>
                            <input
                                type="text"
                                name="name"
                                placeholder="Full Name"
                                value={formData.name}
                                onChange={handleInputChange}
                            />
                            <input
                                type="email"
                                name="email"
                                placeholder="Email Address"
                                value={formData.email}
                                onChange={handleInputChange}
                            />
                            <input
                                type="text"
                                name="subject"
                                placeholder="Subject"
                                value={formData.subject}
                                onChange={handleInputChange}
                            />
                            <textarea
                                name="message"
                                placeholder="Your Message"
                                value={formData.message}
                                onChange={handleInputChange}
                            />
                            {error && <p className="error">{error}</p>}
                            <button type="submit" className="btn-submit">Submit</button>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ContactUs;
