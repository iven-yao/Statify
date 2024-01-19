import React, { useEffect, useState } from "react";
import Loading from "./Loading";
import {NavLink, useLocation} from 'react-router-dom';
import { IoMdCloseCircleOutline } from "react-icons/io";
const { getTopArtists, getHeaders, logout } = require("../utils/spotifyAPI");

const Collage = () => {
    const location = useLocation();
    const [artistsData, setArtistsData] = useState();
    const [title, setTitle] = useState("");

    useEffect(() => {
        const fetch = async() => {
            const headers = getHeaders();
            const data = await Promise.all([getTopArtists(headers, 50)]);
            
            if(location.state.period === 'all') {
                setArtistsData(data[0].long_term);
                setTitle("All Time Favorite 50");
            }
            if(location.state.period === 'recent') {
                setArtistsData(data[0].short_term);
                setTitle("Recent Favorite 50");
            }
        };

        fetch().catch(err => {
            console.error(err);
            logout();
        });
    },[location.state.period]);
    return (
        <>
        {artistsData?
            <div className="col-span-3 flex flex-col px-12 md:pb-12 lg:my-auto lg:pb-0">
                <NavLink to='/' className="absolute right-10 bg-[--black] rounded-full"><IoMdCloseCircleOutline size={35} className="text-white"/></NavLink>
                <div className="border-x border-green-500 rounded-xl px-10 py-4 m-2 grid grid-cols-1 md:grid-cols-8">
                    <div className="md:col-span-3 grid grid-cols-2 md:grid-cols-2">
                        {artistsData.items.slice(0,4).map((item) =>
                        <img key={item.id} src={item.images[0].url} className="aspect-square object-cover" alt="artist_photo"/>
                        )}
                    </div>
                    <div className="md:col-span-5 grid grid-cols-3 md:grid-cols-5">
                        {artistsData.items.slice(4,19).map((item) =>
                        <img key={item.id} src={item.images[0].url} className="aspect-square object-cover" alt="artist_photo"/>
                        )}
                    </div>
                    <div className="md:col-span-8 grid grid-cols-5 md:grid-cols-11">
                        {artistsData.items.slice(19,50).map((item) =>
                        <img key={item.id} src={item.images[0].url} className="aspect-square object-cover" alt="artist_photo"/>
                        )}
                        <div className="text-xs md:text-base col-span-4 md:col-span-2 flex items-center justify-center m-1 border-y border-green-500 rounded-xl">
                            {title}
                        </div>
                    </div>
                </div>
            </div>
            :
            <div className="col-span-3 p-12">
                <Loading />
            </div>
        }
        </>
    );
}

export default Collage;

