import React, { useEffect, useState } from "react";
// import {RxDotFilled} from 'react-icons/rx';
import { serverURI } from "../utils";
import TopArtists from "./TopArtists";
import TopTracks from "./TopTracks";

const Profile = () => {

    const [profile, setProfile] = useState();

    useEffect(() => {
        fetch(`${serverURI}/profile`)
            .then(res => res.json())
            .then(res => setProfile(res))
            .catch(err => console.log(err));
    },[]);

    return (
        <>
            {profile?
                <div>
                    <div className="flex justify-center items-end bg-black">
                        <img src={profile.images[0].url} height='300' width='300' className="rounded-full m-5" alt="profile pic"/> 
                        <div>
                            <div className="text-base pb-5">Statify - your personal charts</div>
                            <div className="text-8xl font-black">{profile['display_name']}</div>
                            {/* <div className="flex items-center pt-8">xx Public Playlists<RxDotFilled/>{profile.followers.total} Follower<RxDotFilled/> xx Following</div> */}
                        </div>
                    </div>
                    <div className="flex justify-evenly items-start bg-black">
                        <TopArtists/>
                        <TopTracks />
                    </div>
                </div>
                : 
                <div className="flex justify-center items-center">
                    LOADING...
                </div>
            }
            
        </>
    );
};

export default Profile;