import React, { useEffect, useState } from "react";
import {RxDotFilled} from 'react-icons/rx';

const Profile = () => {

    const [profile, setProfile] = useState();

    useEffect(() => {
        fetch('http://localhost:9000/profile')
            .then(res => res.json())
            .then(res => setProfile(res))
            .catch(err => console.log(err));
    },[]);

    return (
        <>
            {profile?
                <div className="flex justify-start items-end">
                    <img src={profile.images[0].url} height='300' width='300' className="rounded-full m-5"/> 
                    <div className>
                        <div className="text-base pb-5">Profile</div>
                        <div className="text-8xl font-black pb-8">{profile['display_name']}</div>
                        <div className="flex items-center">xx Public Playlists<RxDotFilled/>{profile.followers.total} Follower<RxDotFilled/> xx Following</div>

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