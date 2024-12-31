import React from "react";
import { Link } from 'react-router-dom';
import Header from '../components/Header';

const Home = () => {
    return <div>
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
        </div>
}

export default Home;