import React, { useEffect, useState } from "react";

const Profile = () => {

    const [apiResponse, setApiResponse] = useState();

    useEffect(() => {
        fetch('http://localhost:9000/test')
            .then(res => res.text())
            .then(res => setApiResponse(res))
            .catch(err => console.log(err));
    });

    return (
        <div className="container">
            PROFILE_PAGE
            <p>
                {apiResponse}
            </p>
        </div>
    );
};

export default Profile;