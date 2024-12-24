import Globe from '../../components/Globe/Globe';

const Home = () => {
    return (
        <div className="page-home">
            <div className="page-home__slice">

                <div className="page-home__content">
                    <h1 className="page-home__content--title">ProCom </h1>
                    <p className="page-home__content--subtitle">Crafting Code, Elevating Elegance.</p>
                </div>
            </div>

            <Globe />
        </div>
    );
};

export default Home;
