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
            image: "https://cdn.prod.website-files.com/63e3828f575098222357ad70/641b4a7b49dd292cb0ef5c7e_Untitled%20design%20(9)-p-500.png",
            link: "/services/ai-integration",
        },
        {
            title: "Smart Dashboard: Real-Time Insights",
            description:
                "Introducing our new Smart Dashboard that brings real-time analytics and user-friendly insights directly to your fingertips. Make data-driven decisions effortlessly.",
            image: "https://cdn.prod.website-files.com/63e3828f575098222357ad70/648ae6ac6c902afee33f9630_uix-p-500.png",
            link: "/products/smart-dashboard",
        },
        {
            title: "Version 2.0: Enhanced Performance",
            description:
                "Our latest update, Version 2.0, delivers improved performance, new features, and an enhanced user experience across all platforms.",
            image: "https://cdn.prod.website-files.com/63e3828f575098222357ad70/641b4c0dcca89bfab16ce7ab_Untitled%20design%20(10)-p-500.png",
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
        <div className="arrivals">
            <div className="arrivals__container">
                <SectionHeader title="New Arrivals" />
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
        </div>
    );
};

export default NewArrivals;
