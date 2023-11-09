import React, { useEffect, useState } from "react";
import { RxDotFilled} from "react-icons/rx";
import Loading from "./Loading";
import { getProfile, logout, getHeaders } from "../utils/spotifyAPI";
import { getUesrs, createUser, updateUser} from "../utils/db";

const Profile = () => {

    const [profile, setProfile] = useState();

    useEffect(() => {
        const fetch = async() => {
            const headers = getHeaders();
            const res = await getProfile(headers);
            // check user existence, create new user
            const data = await getUesrs({spotify_id:res.data['id']});
            // console.log(data);
            if(!data.user.length) {
                // create new user
                await createUser(res.data).then((id) => console.log(id));
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
                    <div className="flex justify-center items-center">
                        <img src={profile.images[profile.images.length-1].url} width='150' className="rounded-full m-5 aspect-square" alt="profile pic"/> 
                        <div>
                            <div className="text-xl pb-5">Profile</div>
                            <div className="text-6xl font-black">{profile['display_name']}</div>
                            <div className="flex items-center">xx Public Playlists<RxDotFilled/>{profile.followers.total} Follower<RxDotFilled/> xx Following</div>
                        </div>
                    </div>
                    <div className="flex justify-center">
                        <button className="border rounded-xl px-3" onClick={logout}>LOGOUT</button>
                    </div>
                </div>
                : 
                <Loading/>
            }
            
        </>
    );
};

export default Profile;