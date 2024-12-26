const Services = () => {
    const services = [
        {
            title: "eSIM Activation",
            description: "Experience instant activation and seamless switching between carriers with our eSIM service.",
            icon: "fas fa-sim-card",
            link: "https://pcgesim.com/welcome/",
            category: "external",
        },
        {
            title: "Bulk SMS Marketing",
            description: "Engage thousands of customers instantly with an efficient and cost-effective Bulk SMS solution.",
            icon: "fas fa-envelope",
            link: "https://bulksms.pcglobalco.com",
            category: "external",
        },
        {
            title: "Custom Software Development",
            description: "Scalable and reliable software solutions tailored to meet specific business requirements.",
            icon: "fas fa-laptop-code",
            category: "internal",
        },
        {
            title: "Software as a Service (SaaS)",
            description: "Access on-demand tools and services without the need for extensive infrastructure investment.",
            icon: "fas fa-cloud",
            category: "internal",
        },
        {
            title: "PCG MS Marketing Service",
            description: "Enhance customer engagement with the WhatsApp Business API for support and marketing.",
            icon: "fas fa-comments",
            link: "https://ms.pcglobalco.com",
            category: "external",
        },
        {
            title: "Technical Consultation",
            description: "Receive expert guidance and tailored strategies to optimize your system performance, and ensure scalability for future growth.",
            icon: "fas fa-tools",
            category: "internal",
        },
    ];

    return (
        <div className="services" id="services">
            <div className="services__header">
                <h2 className="services__title">Our Services</h2>
                <p className="services__subtitle">
                    Explore the range of services we offer to help elevate your business.
                </p>
            </div>

            {/* Internal Services Section */}
            <div className="services__container">
                <div className="services__category">
                    <div className="services__category-header">
                        <div className="services__category-icon">
                            <i className="fa-brands fa-connectdevelop fa-spin-pulse"></i>                    </div>
                        <div className="services__category-content">
                            <h3 className="services__category-title">Internal Services</h3>
                            <p className="services__category-description">
                                Services offered to the public, customizable or created based on specific requirements.
                            </p>
                        </div>
                    </div>
                    <div className="services__category-grid">
                        {services
                            .filter(service => service.category === "internal")
                            .map((service, index) => (
                                <div className="service__item" key={index}>
                                    <div className="service__icon">
                                        <i className={service.icon}></i>
                                    </div>
                                    <h3 className="service__title">{service.title}</h3>
                                    <p className="service__description">{service.description}</p>
                                </div>
                            ))}
                    </div>
                </div>

                {/* External Services Section */}
                <div className=" services__category ">
                    <div className="services__category-header">
                        <div className="services__category-icon">
                            <i className="fa-brands fa-connectdevelop fa-spin-pulse"></i>                    </div>
                        <div className="services__category-content">
                            <h3 className="services__category-title">External Services</h3>
                            <p className="services__category-description">
                                Products developed to deliver a need or service to users.
                            </p>
                        </div>
                    </div>
                    <div className="services__category-grid">
                        {services
                            .filter(service => service.category === "external")
                            .map((service, index) => (
                                <div className="service__item" key={index}>
                                    <div className="service__icon">
                                        <i className={service.icon}></i>
                                    </div>
                                    <h3 className="service__title">{service.title}</h3>
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
            </div>
        </div>
    );
};

export default Services;