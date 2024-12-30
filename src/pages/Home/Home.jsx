import Globe from '../../components/Globe/Globe';
import { Link } from 'react-scroll';

const Home = () => {
    return (
        <div id='home' className="home">
            <div className="home__container">
                <div className="home__slice"></div>
                <div className="home__content">
                    <h1 className="home__title">ProCom</h1>
                    <p className="home__subtitle">Crafting Code, Elevating Elegance.</p>
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
