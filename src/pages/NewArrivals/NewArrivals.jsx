function NewArrivals() {
    return (
        <section className="new-arrivals">
            <h2 className="new-arrivals__title">New Arrivals</h2>
            <div className="new-arrivals__grid">
                {/* Map through new arrival items */}
                <div className="new-arrivals__item">
                    <img src="product1.jpg" alt="Product 1" />
                    <h3>Product Name</h3>
                    <p>Short description here...</p>
                    <button className="new-arrivals__btn">Learn More</button>
                </div>
                {/* Repeat for other products */}
            </div>
        </section>
    );
}

export default NewArrivals;
