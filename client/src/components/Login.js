import React from "react";
import {SlSocialSpotify} from "react-icons/sl";

const Login = () => {

    return (
        <div className="App center">
            <a className="enter-btn" href='http://localhost:9000/login'>
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