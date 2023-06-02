import React, { useEffect, useState } from "react";
import { serverURI } from "../utils";

const TopArtists = () => {
    
    const [allTime, setAllTime] = useState();
    const [sixMonth, setSixMonth] = useState();
    const [fourWeek, setFourWeek] = useState();

    useEffect(() => {
        fetch(`${serverURI}/top/artists/long_term`)
        .then(res => res.json())
        .then(res => setAllTime(res))
        .catch(err => console.log(err));
        
        fetch(`${serverURI}/top/artists/medium_term`)
        .then(res => res.json())
        .then(res => setSixMonth(res))
        .catch(err => console.log(err));

        fetch(`${serverURI}/top/artists/short_term`)
        .then(res => res.json())
        .then(res => setFourWeek(res))
        .catch(err => console.log(err));
    },[]);

    return (
        <>
        </>
    );
};

export default TopArtists;