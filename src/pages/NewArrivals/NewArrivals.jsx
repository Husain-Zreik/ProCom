import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import SectionHeader from "../../components/SectionHeader/SectionHeader";

const NewArrivals = () => {
    const arrivals = [
        {
            title: "AI Integration: Revolutionize Your Workflow",
            description:
                "Our cutting-edge AI integration service empowers your business to automate mundane tasks, analyze data in real-time, and deliver smarter insights. Stay ahead in your industry with seamless technology designed for you.",
            image: "https://i.pinimg.com/736x/5a/6d/ec/5a6decdffbab6f9aad17ba5c02debc62.jpg",
            link: "/services/ai-integration",
        },
        {
            title: "Smart Dashboard: Real-Time Insights",
            description:
                "Introducing our new Smart Dashboard that brings real-time analytics and user-friendly insights directly to your fingertips. Make data-driven decisions effortlessly.",
            image: "https://i.pinimg.com/736x/87/17/da/8717daaeb5837fcd9fd15e9d8cecd8b0.jpg",
            link: "/products/smart-dashboard",
        },
        {
            title: "Version 2.0: Enhanced Performance",
            description:
                "Our latest update, Version 2.0, delivers improved performance, new features, and an enhanced user experience across all platforms.",
            image: "https://i.pinimg.com/736x/1a/b6/ba/1ab6bae07f2b6cefab8c61e9f3b72004.jpg",
            link: "/updates/version-2.0",
        },
    ];

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 5000,
        arrows: false,
    };

    return (
        <section className="arrivals" id="arrivals">
            <div className="arrivals__container">
                <SectionHeader title="New Arrivals" isColored={true} />
                <div className="arrivals__carousel">
                    <Slider {...settings}>
                        {arrivals.map((arrival, index) => (
                            <div key={index} className="arrivals__banner">
                                <img src={arrival.image} alt={arrival.title} className="arrivals__image" />
                                <div className="arrivals__content">
                                    <h1 className="arrivals__title">{arrival.title}</h1>
                                    <p className="arrivals__description">{arrival.description}</p>
                                    <a href={arrival.link} className="arrivals__button">
                                        Explore the Service
                                    </a>
                                </div>
                            </div>
                        ))}
                    </Slider>
                </div>
            </div>
        </section>
    );
};

export default NewArrivals;
