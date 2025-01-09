// import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import SectionHeader from '../../components/SectionHeader/SectionHeader';

function AboutUs() {
    return (
        <section id='about' className="about">
            <div className="about__container">
                <SectionHeader title="About ProCom" />
                <div className="about__content">
                    <div className="about__media">
                        {/* <DotLottieReact
                            src="Welcome.json"
                            loop
                            autoplay
                        /> */}
                        <img src="https://i.pinimg.com/736x/25/97/91/259791bed227fa612f46a9c46530766d.jpg" alt={"hi"} className="about__image" />
                    </div>

                    <div className="about__text">
                        <p>
                            ProCom is a leading software company based in Qatar, focused on empowering businesses with innovative technology solutions. We specialize in custom software development, cloud services, and technical consultation. Our products, including eSIM service, PCG MS (WhatsApp MARKETING), Bulk SMS marketing, and SaaS, are designed to deliver scalable, reliable, and cost-effective solutions tailored to our clients’ needs. For more details on our services, please explore our website.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default AboutUs;
