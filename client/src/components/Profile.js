import React, { useEffect, useState } from "react";
import Loading from "./Loading";
import { getProfile, logout, getHeaders, getTopArtists, getTopTracks } from "../utils/spotifyAPI";
// import { getUesrs, createUser, updateUser} from "../utils/db";

const Profile = () => {

    const [profile, setProfile] = useState();
    const [allTime, setAllTime] = useState();
    const [fourWeek, setFourWeek] = useState();
    const [allTimeTrack, setAllTimeTrack] = useState();
    const [fourWeekTrack, setFourWeekTrack] = useState();


    useEffect(() => {
        const fetch = async() => {
            const headers = getHeaders();
            const data = await Promise.all([getTopArtists(headers,5), getTopTracks(headers,5), getProfile(headers)]);
            console.log(data);

            setAllTime(data[0].long_term);
            setFourWeek(data[0].short_term);
            
            setAllTimeTrack(data[1].long_term);
            setFourWeekTrack(data[1].short_term);
            
            setProfile(data[2].data);

            // check user existence, create new user, no db needed for now
            // const data = await getUesrs({spotify_id:res.data['id']});
            // if(!data.user.length) {
            //     // create new user
            //     await createUser(res.data).then((id) => console.log(id));
            // } else {
            //     // update existing user
            //     const userid = data.user[0].id;
            //     updateUser(userid, res.data);
            // }

            
        };

        fetch().catch(err => {
            console.error(err);
            logout();
        });
    },[]);

    return (
        <>
            {profile&&allTime?
                <div className="grid grid-cols-3 h-screen pb-[51px]">
                    <div className="flex flex-col items-center justify-center">
                        <img src={profile.images[profile.images.length-1].url} width='150' height={150} className="rounded-full m-5 aspect-square" alt="profile pic"/> 
                        <div className="text-6xl font-black">{profile['display_name']}</div>
                        <div className="flex items-center"><button className="border rounded-xl px-3 hover:text-green-500 hover:border-green-500" onClick={logout}>LOGOUT</button></div>
                    </div>
                    <div className="col-span-2 flex flex-col p-2 grid grid-cols-2">
                        <div className="border-l border-b border-green-500 rounded-xl p-4 m-2">
                            <div className="text-xl m-2">All-time Favorite Artists</div>
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
                            <div className="text-xl m-2">All-time Favorite Tracks</div>
                            <div className="flex flex-col">
                                {allTimeTrack.items.map((item, index) => (
                                    <div className="flex flex-row align-text-bottom justify-between border-t border-gray-500 p-2">
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
                            <div className="text-xl m-2">Recent Favorite Artists</div>
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
                            <div className="text-xl m-2">Recent Favorite Tracks </div>
                            <div className="flex flex-col">
                                {fourWeekTrack.items.map((item, index) => (
                                    <div className="flex flex-row align-text-bottom justify-between border-t border-gray-500 p-2">
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
                </div>
                : 
                <Loading/>
            }
            
        </>
    );
};

export default Profile;