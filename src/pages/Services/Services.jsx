import { useState, useCallback } from "react";
import SectionHeader from "../../components/SectionHeader/SectionHeader";

const Services = () => {
    const [hoveredIndex, setHoveredIndex] = useState(null);
    const [hoveredCategory, setHoveredCategory] = useState(null);

    const services = [
        {
            title: "eSIM Activation",
            description: "Experience instant activation and seamless switching between carriers with our eSIM service.",
            icon: "fas fa-sim-card",
            link: "https://pcgesim.com/welcome/",
            category: "external",
            animation: "flip",
        },
        {
            title: "Bulk SMS Marketing",
            description: "Engage thousands of customers instantly with an efficient and cost-effective Bulk SMS solution.",
            icon: "fas fa-envelope",
            link: "https://bulksms.pcglobalco.com",
            category: "external",
            animation: "shake",
        },
        {
            title: "Custom Software Development",
            description: "Scalable and reliable software solutions tailored to meet specific business requirements.",
            icon: "fas fa-laptop-code",
            category: "internal",
            animation: "bounce",
        },
        {
            title: "Software as a Service (SaaS)",
            description: "Access on-demand tools and services without the need for extensive infrastructure investment.",
            icon: "fas fa-cloud",
            category: "internal",
            animation: "beat-fade",
        },
        {
            title: "PCG MS Marketing Service",
            description: "Enhance customer engagement with the WhatsApp Business API for support and marketing.",
            icon: "fas fa-comments",
            link: "https://ms.pcglobalco.com",
            category: "external",
            animation: "bounce",
        },
        {
            title: "Technical Consultation",
            description: "Receive expert guidance and tailored strategies to optimize your system performance, and ensure scalability for future growth.",
            icon: "fas fa-tools",
            category: "internal",
            animation: "shake",
        },
    ];

    // Callback to handle hover state change
    const handleMouseEnter = useCallback((index, category) => {
        setHoveredIndex(index);
        setHoveredCategory(category);
    }, []);

    const handleMouseLeave = useCallback(() => {
        setHoveredIndex(null);
        setHoveredCategory(null);
    }, []);

    const getIconClass = (index, category, animation) => {
        if (hoveredIndex === index && hoveredCategory === category && animation !== "none") {
            return `fa-${animation}`;
        }
        return '';
    };

    return (
        <section className="services" id="services">
            <div className="services__container">
                <SectionHeader title="Our Services" />

                {/* External Services Section */}
                <div className="services__category">
                    <div className="services__category-header">
                        <div className="services__category-icon">
                            <i className="fa-brands fa-connectdevelop fa-spin-pulse"></i>
                        </div>
                        <div className="services__category-content">
                            <h2 className="services__category-title">User-Focused Digital Products</h2>
                            <p className="services__category-description">
                                Specialized external services crafted to deliver solutions that empower and engage users.
                            </p>
                        </div>
                    </div>
                    <div className="services__category-grid">
                        {services
                            .filter(service => service.category === "external")
                            .map((service, index) => (
                                <div
                                    className="service__item"
                                    key={index}
                                    onMouseEnter={() => handleMouseEnter(index, 'external')}  // Hover enter
                                    onMouseLeave={handleMouseLeave}
                                >
                                    <div className="service__icon">
                                        <i className={`${service.icon} ${getIconClass(index, 'external', service.animation)}`}></i>
                                    </div>
                                    <h2 className="service__title">{service.title}</h2>
                                    <p className="service__description">{service.description}</p>
                                    {service.link && (
                                        <a href={service.link} target="_blank" rel="noopener noreferrer" className="service__link">
                                            <button className="link-button">Visit Website</button>
                                        </a>
                                    )}
                                </div>
                            ))}
                    </div>
                </div>

                {/* Internal Services Section */}
                <div className="services__category">
                    <div className="services__category-header">
                        <div className="services__category-icon">
                            <i className="fa-brands fa-connectdevelop fa-spin-pulse"></i>
                        </div>
                        <div className="services__category-content">
                            <h2 className="services__category-title">Customized Business Solutions</h2>
                            <p className="services__category-description">
                                Tailored internal services designed to meet unique business needs and drive growth.
                            </p>
                        </div>
                    </div>
                    <div className="services__category-grid">
                        {services
                            .filter(service => service.category === "internal")
                            .map((service, index) => (
                                <div
                                    className="service__item"
                                    key={index}
                                    onMouseEnter={() => handleMouseEnter(index, 'internal')}  // Hover enter
                                    onMouseLeave={handleMouseLeave}
                                >
                                    <div className="service__icon">
                                        <i className={`${service.icon} ${getIconClass(index, 'internal', service.animation)}`}></i>
                                    </div>
                                    <h2 className="service__title">{service.title}</h2>
                                    <p className="service__description">{service.description}</p>
                                </div>
                            ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Services;
