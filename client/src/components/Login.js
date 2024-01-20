import React from "react";
import {SlSocialSpotify} from "react-icons/sl";

const Login = () => {

    const LOGIN_URL = process.env.REACT_APP_LOGIN_URI || 'https://statify-server.vercel.app/login';

    return (
        <div className="App center">
            <a className="enter-btn" href={LOGIN_URL}>
                <span className="front">
                    <div className="flex items-center text-center">
                        <div className="pr-1">L</div>
                        <SlSocialSpotify className="pr-1" size={40}/>
                        <div className="pr-1">G</div>
                        <div className="pr-1">I</div>
                        <div>N</div>
                    </div>
                </span>
            </a>
        </div>
    );
};

export default Login;