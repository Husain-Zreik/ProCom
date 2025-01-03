import { ReactSVG } from 'react-svg';
import Globe from '../../components/Globe/Globe';
import { Link } from 'react-scroll';

const Home = () => {
    return (
        <div id='home' className="home">
            <div className="home__container">
                <div className="home__slice"></div>
                <div className="home__content">
                    <div className="home__header">
                        <ReactSVG src="/PRC-Logo/P-logo2.svg" className="home__logo" />
                        <h1 className="home__title">OCOM</h1>
                    </div>
                    <p className="home__subtitle">
                        <b>PROCOM :</b> Innovating solutions, empowering connections. Your partner in building the digital future.
                    </p>
                    <div className="home__buttons">
                        <button className="home__button">
                            <Link to="about" spy={true} smooth={true} duration={500}>
                                Learn More
                            </Link>
                        </button>

                        <button className="home__button">
                            <Link to="services" spy={true} smooth={true} duration={500}>
                                Get Started
                            </Link>
                        </button>
                    </div>
                </div>
                <Globe />
            </div>
        </div>
    );
};
export default Home;
