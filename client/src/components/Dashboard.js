import React, { useEffect, useState } from "react";
import Loading from "./Loading";
import { NavLink } from "react-router-dom";
import { MdOutlineKeyboardDoubleArrowRight } from "react-icons/md";
const { getTopArtists, getTopTracks, getHeaders, logout } = require("../utils/spotifyAPI");

const Dashboard = () => {
    const [allTime, setAllTime] = useState();
    const [fourWeek, setFourWeek] = useState();
    const [allTimeTrack, setAllTimeTrack] = useState();
    const [fourWeekTrack, setFourWeekTrack] = useState();


    useEffect(() => {
        const fetch = async() => {
            const headers = getHeaders();
            const data = await Promise.all([getTopArtists(headers, 50), getTopTracks(headers, 50)]);
            
            setAllTime(data[0].long_term);
            setFourWeek(data[0].short_term);
            
            setAllTimeTrack(data[1].long_term);
            setFourWeekTrack(data[1].short_term);
        };

        fetch().catch(err => {
            console.error(err);
            logout();
        });
    },[]);

    return (
        <>
        {allTime&&fourWeek&&allTimeTrack&&fourWeekTrack?
            <div className="col-span-3 flex flex-col px-12 grid grid-cols-1 md:grid-cols-2 md:py-5">
                <div className="border-l border-b border-green-500 rounded-xl p-4 m-2">
                    <div className="text-lg m-2 font-bold flex justify-between">
                        <div>All-time Favorite Artists</div>
                        <NavLink to='/collage' state={{period: "all"}} className="text-gray-500 flex items-center"><MdOutlineKeyboardDoubleArrowRight/>MORE</NavLink>
                    </div>
                    <div className="grid grid-cols-2">
                        <img src={allTime.items[0].images[0].url} className="aspect-square object-cover" alt="artist_photo"/>
                        <div className="grid grid-cols-2">
                            <img src={allTime.items[1].images[0].url} className="aspect-square object-cover" alt="artist_photo"/>
                            <img src={allTime.items[2].images[0].url} className="aspect-square object-cover" alt="artist_photo"/>
                            <img src={allTime.items[3].images[0].url} className="aspect-square object-cover" alt="artist_photo"/>
                            <img src={allTime.items[4].images[0].url} className="aspect-square object-cover" alt="artist_photo"/>
                        </div>
                    </div>
                </div>
                <div className="border-r border-t border-green-500 rounded-xl p-4 m-2">
                    <div className="text-lg m-2 font-bold">All-time Favorite Tracks</div>
                    <div className="flex flex-col">
                        {allTimeTrack.items.slice(0,5).map((item, index) => (
                            <div key={item.id} className="flex flex-row align-text-bottom justify-between border-t border-gray-500 p-2">
                                <div>{item.name}</div>
                                <div className="truncate text-gray-400">
                                    {item.artists.map((artist, index) => {
                                        return index === 0? artist.name: ', '+artist.name;
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="border-l border-b border-green-500 rounded-xl p-4 m-2">
                    <div className="text-lg m-2 font-bold flex justify-between">
                        <div>Recent Favorite Artists</div>
                        <NavLink to='/collage' state={{period: "recent"}} className="text-gray-500 flex items-center"><MdOutlineKeyboardDoubleArrowRight/>MORE</NavLink>
                    </div>
                    <div className="grid grid-cols-2">
                        <img src={fourWeek.items[0].images[0].url} className="aspect-square object-cover" alt="artist_photo"/>
                        <div className="grid grid-cols-2">
                            <img src={fourWeek.items[1].images[0].url} className="aspect-square object-cover" alt="artist_photo"/>
                            <img src={fourWeek.items[2].images[0].url} className="aspect-square object-cover" alt="artist_photo"/>
                            <img src={fourWeek.items[3].images[0].url} className="aspect-square object-cover" alt="artist_photo"/>
                            <img src={fourWeek.items[4].images[0].url} className="aspect-square object-cover" alt="artist_photo"/>
                        </div>
                    </div>
                </div>
                <div className="border-r border-t border-green-500 rounded-xl p-4 m-2">
                    <div className="text-lg m-2 font-bold">Recent Favorite Tracks </div>
                    <div className="flex flex-col">
                        {fourWeekTrack.items.slice(0,5).map((item, index) => (
                            <div key={item.id} className="flex flex-row align-text-bottom justify-between border-t border-gray-500 p-2">
                                <div>{item.name}</div>
                                <div className="truncate text-gray-400">
                                    {item.artists.map((artist, index) => {
                                        return index === 0? artist.name: ', '+artist.name;
                                    })}
                                </div>
                            </div>
                        ))}
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

export default Dashboard;