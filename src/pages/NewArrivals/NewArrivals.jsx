import { useEffect, useRef } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import SectionHeader from "../../components/SectionHeader/SectionHeader";

const NewArrivals = () => {
    const sliderRef = useRef(null);

    // Handle accessibility fixes and ARIA-related adjustments
    useEffect(() => {
        // Ensure that the ref is set before attempting to interact with it
        if (sliderRef.current) {
            // Add focus management and accessibility adjustments after the slider is initialized
            const handleAfterChange = (currentSlide) => {
                const allSlides = document.querySelectorAll('.slick-slide');

                // Remove focusable behavior from non-active slides
                allSlides.forEach((slide) => {
                    const slideAnchor = slide.querySelector("a.arrivals__button");
                    if (slideAnchor) {
                        slideAnchor.setAttribute('tabindex', '-1');
                    }
                    slide.setAttribute('aria-hidden', 'true');
                });

                // Make the current (active) slide focusable
                const activeSlide = document.querySelector(`.slick-slide[data-index="${currentSlide}"]`);
                if (activeSlide) {
                    const focusable = activeSlide.querySelector("a.arrivals__button");
                    if (focusable) {
                        focusable.setAttribute('tabindex', '0');
                    }
                    activeSlide.setAttribute('aria-hidden', 'false');
                }
            };

            // Ensure the slider is fully initialized before calling setProps
            if (sliderRef.current && sliderRef.current.slick) {
                sliderRef.current.slick.setProps({ afterChange: handleAfterChange });
            }

            // Handle cloned slides
            const clonedSlides = document.querySelectorAll('.slick-slide.slick-cloned a.arrivals__button');
            clonedSlides.forEach((slide) => {
                slide.setAttribute('tabindex', '-1');
            });
        }
    }, []);

    const arrivals = [
        {
            title: "eSIM Activation: Seamless Carrier Switching",
            description:
                "Our new eSIM Activation service offers instant activation and smooth switching between mobile carriers, without the need for physical SIM cards. Reach more customers with this cutting-edge mobile technology and promote the ease of use in your marketing.",
            image: "https://i.pinimg.com/736x/5a/6d/ec/5a6decdffbab6f9aad17ba5c02debc62.jpg",
            link: "https://pcgesim.com/welcome/",
        },
        {
            title: "Bulk SMS Marketing: Instant Customer Engagement",
            description:
                "Leverage our Bulk SMS Marketing service to engage thousands of customers instantly. This service is perfect for businesses looking to amplify their reach and boost conversions. New and efficient, it's time to spread the word and market your services effectively.",
            image: "https://i.pinimg.com/736x/87/17/da/8717daaeb5837fcd9fd15e9d8cecd8b0.jpg",
            link: "https://bulksms.pcglobalco.com",
        },
        {
            title: "PCG MS Marketing Service: Boost Your WhatsApp Engagement",
            description:
                "Our PCG MS Marketing Service uses WhatsApp Business API to help you connect with customers directly. It's a powerful marketing tool, ideal for businesses needing to enhance engagement. Discover how it can elevate your customer support and marketing efforts.",
            image: "https://i.pinimg.com/736x/1a/b6/ba/1ab6bae07f2b6cefab8c61e9f3b72004.jpg",
            link: "https://ms.pcglobalco.com",
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
        accessibility: true, // Enable accessibility
    };

    return (
        <section className="arrivals" id="arrivals">
            <div className="arrivals__container">
                <SectionHeader title="New Arrivals" isColored={true} />
                <div className="arrivals__carousel">
                    <Slider {...settings} ref={sliderRef}>
                        {arrivals.map((arrival, index) => (
                            <div
                                key={index}
                                className="arrivals__banner"
                                aria-hidden={index !== 0} // Make non-active slides hidden from screen readers
                            >
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
