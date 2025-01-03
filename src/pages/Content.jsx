import Services from './Services/Services';
import Home from './Home/Home';
import NewArrivals from './NewArrivals/NewArrivals';
import AboutUs from './AboutUs/AboutUs';
import ContactUs from './ContactUs/ContactUs';
import FAQs from './FAQs/FAQs';

function Content() {
    return (
        <>
            <Home />
            <AboutUs />
            <NewArrivals />
            <Services />
            <FAQs />
            <ContactUs />
        </>

    );
}

export default Content;
