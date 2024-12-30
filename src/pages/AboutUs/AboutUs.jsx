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
                        <img src="https://cdn.prod.website-files.com/63e3828f575098222357ad70/641b4a7b49dd292cb0ef5c7e_Untitled%20design%20(9)-p-500.png" alt={"hi"} className="about__image" />
                    </div>

                    <div className="about__text">
                        <p>
                            ProCom is a leading software company based in Qatar, focused on empowering businesses with innovative technology solutions. We specialize in custom software development, cloud services, and technical consultation. Our products, including eSIM activation, Bulk SMS marketing, and SaaS, are designed to deliver scalable, reliable, and cost-effective solutions tailored to our clients’ needs. For more details on our services, please explore our website.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default AboutUs;
