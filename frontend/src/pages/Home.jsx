import React from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

const Home = () => {
    const isAuthenticated = localStorage.getItem("idToken") !== null; // Check if user is signed in

    return (
        <div className="wrapper">
            <div className="content-container">
                <Header />
                <h2>Welcome to Munzey</h2>
                {!isAuthenticated && (
                    <div className="button-container">
                        <Link to="/login">
                            <button className="custom-button">Login</button>
                        </Link>
                        <Link to="/signup">
                            <button className="custom-button">Signup</button>
                        </Link>
                    </div>
                )}
                <Footer />
            </div>
        </div>
    );
};

export default Home;