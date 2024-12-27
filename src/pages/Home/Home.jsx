import Globe from '../../components/Globe/Globe';

const Home = () => {
    return (
        <div className="page-home">
            <div className="page-home__container">
                <div className="page-home__slice"></div>
                <div className="page-home__content">
                    <h1 className="page-home__content--title">ProCom </h1>
                    <p className="page-home__content--subtitle">Crafting Code, Elevating Elegance.</p>

                    <div className="page-home__content--buttons">
                        <button className="page-home__content--button">Learn More</button>
                        <button className="page-home__content--button">Get Started</button>
                    </div>
                </div>
                <Globe />
            </div>
        </div>
    );
};

export default Home;
