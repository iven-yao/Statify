import React, { useEffect, useState } from "react";
import { getProfile, logout, getHeaders} from "../utils/spotifyAPI";
import Dashboard from "./Dashboard";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Nav from "./Nav";
import Analysis from "./Analysis";
import Collage from "./Collage";
import TopCharts from "./TopCharts";
import Loading from "./Loading";

const Main = () => {

    const [profile, setProfile] = useState();


    useEffect(() => {
        const fetch = async() => {
            const headers = getHeaders();
            const data = await Promise.all([getProfile(headers)]);
            
            setProfile(data[0].data);
        };

        fetch().catch(err => {
            console.error(err);
            logout();
        });
    },[]);

    return (
        <>
            {profile?
                <div className="grid grid-cols-1 lg:grid-cols-4 md:h-screen pb-12">
                    <div className="flex flex-col items-center p-12">
                        <img src={profile.images[profile.images.length-1].url} width='150' height={150} className="rounded-full m-5 aspect-square" alt="profile pic"/> 
                        <div className="text-4xl font-black">{profile['display_name']}</div>
                        <div className="flex items-center"><button className="border rounded-xl px-3 hover:text-green-500 hover:border-green-500" onClick={logout}>LOGOUT</button></div>
                    </div>
                    <BrowserRouter>
                        <Nav />
                            <Routes>
                                <Route path="/" element={<Dashboard />} />
                                <Route path="/analysis" element={<Analysis />} />
                                <Route path="/collage" element={<Collage />} />
                                <Route path="/topchart" element={<TopCharts />} />
                            </Routes>
                    </BrowserRouter>
                </div>
                : 
                <div className="h-screen">
                    <Loading />
                </div>
            }
            
        </>
    );
};

export default Main;