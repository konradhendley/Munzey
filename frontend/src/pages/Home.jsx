import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

const messages = [
    "Track your expenses with ease.",
    "Take control of your finances.",
    "Plan your budget.",
    "Visualize your spending habits."
];

const Home = () => {
    const isAuthenticated = localStorage.getItem("idToken") !== null;
    const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
    const [fade, setFade] = useState(true);

    useEffect(() => {
        if (!isAuthenticated) {
        const interval = setInterval(() => {
            setFade(false);
            setTimeout(() => {
                setCurrentMessageIndex((prevIndex) => (prevIndex + 1) % messages.length);
                setFade(true);
            }, 3000);
        }, 5000);

        return () => clearInterval(interval);
            }
        }, [isAuthenticated]);

    return (
        <div className="wrapper">
            <Header />
            <div className="content-container">
            <div className="content">
                
                <h1>Welcome to Munzey</h1>
                <div>
                    Click<a href="https://munzey-demo-videos.s3.us-east-1.amazonaws.com/Munzey+Demo.mp4" target="_blank" rel="noopener noreferrer"> here </a> to watch a demo
                </div>
                {!isAuthenticated && (
                    <div>
                    <div className={`fade-message ${fade ? "fade-in" : "fade-out"}`}>
                    {messages[currentMessageIndex]}
                </div>
                    <div className="button-container">
                        <Link to="/login">
                            <button className="custom-button">Login</button>
                        </Link>
                        <Link to="/signup">
                            <button className="custom-button">Signup</button>
                        </Link>
                    </div>
                    </div>
                )}      
                </div>
                </div>
            <Footer />
        </div>
    );
};

export default Home;