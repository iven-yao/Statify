import React, { useEffect, useState } from "react";
import { RxDotFilled} from "react-icons/rx";
import Loading from "./Loading";
import { getProfile, logout } from "../utils/spotifyAPI";
import { getUesrs, createUser, updateUser} from "../utils/db";

const Profile = () => {

    const [profile, setProfile] = useState();

    useEffect(() => {
        const fetch = async() => {
            const res = await getProfile();
            // check user existence, create new user
            const data = await getUesrs({spotify_id:res.data['id']});
            console.log(data);
            if(!data.user.length) {
                // create new user
                const userid = await createUser(res.data);
                console.log(userid);
            } else {
                // update existing user
                const userid = data.user[0].id;
                updateUser(userid, res.data);
            }

            setProfile(res.data);
        };

        fetch().catch(err => {
            console.error(err);
            logout();
        });
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