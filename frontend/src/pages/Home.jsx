import React from "react";
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from "../components/Footer";

const Home = () => {
    return (
        <div className="wrapper">
            
            <div className="content-container">
                <Header/>
                    <h2>Welcome to Folio</h2>
                        <div>
                            <Link to="/login">
                                <button>Login</button>
                             </Link>
                                <Link to="/signup">
                                 <button>Signup</button>
                             </Link>
                        </div> 
                <Footer/>
            </div>
        </div>
)}

export default Home;