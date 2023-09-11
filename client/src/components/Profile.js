import React, { useEffect, useState } from "react";
// import {RxDotFilled} from 'react-icons/rx';
import { serverURI } from "../utils";
import { RxDotFilled} from "react-icons/rx";
import Loading from "./Loading";

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
                    <div className="flex justify-center items-end">
                        <img src={profile.images[0].url} width='150' className="rounded-full m-5 aspect-square" alt="profile pic"/> 
                        <div>
                            <div className="text-xl pb-5">Profile</div>
                            <div className="text-6xl font-black">{profile['display_name']}</div>
                            <div className="flex items-center">xx Public Playlists<RxDotFilled/>{profile.followers.total} Follower<RxDotFilled/> xx Following</div>
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