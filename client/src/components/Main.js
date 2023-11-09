import React from "react";
import Nav from "./Nav";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Profile from "./Profile";
import TopArtists from "./TopArtists";
import TopTracks from "./TopTracks";

const Main = () => {

    return (
        <>
            
            <BrowserRouter>
                <Nav/>
                <Routes>
                    <Route path="/" element={<Profile />} />
                    <Route path="/artists" element={<TopArtists/>} />
                    <Route path="/tracks" element={<TopTracks/>} />
                </Routes>
                
            </BrowserRouter>
            
        </>
    );
}

export default Main;