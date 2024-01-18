import React, { useEffect, useState } from "react";
import Loading from "./Loading";
import { getProfile, logout, getHeaders} from "../utils/spotifyAPI";
import Dashboard from "./Dashboard";
import TopArtists from "./TopArtists";
import TopTracks from "./TopTracks";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Nav from "./Nav";

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
                <div className="grid grid-cols-1 md:grid-cols-4 h-screen pb-12">
                    <div className="flex flex-col items-center p-12">
                        <img src={profile.images[profile.images.length-1].url} width='150' height={150} className="rounded-full m-5 aspect-square" alt="profile pic"/> 
                        <div className="text-6xl font-black">{profile['display_name']}</div>
                        <div className="flex items-center"><button className="border rounded-xl px-3 hover:text-green-500 hover:border-green-500" onClick={logout}>LOGOUT</button></div>
                    </div>
                    <BrowserRouter>
                        <Nav />
                            <Routes>
                                <Route path="/" element={<Dashboard />} />
                                <Route path="/artists" element={<TopArtists/>} />
                                <Route path="/tracks" element={<TopTracks/>} />
                            </Routes>
                    </BrowserRouter>
                </div>
                : 
                <></>
            }
            
        </>
    );
};

export default Main;