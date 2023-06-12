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
        {fourWeek? 
            <div className="m-5">
                TOP ARTISTS THIS MONTH
                {fourWeek.items.map((item, index)=>{
                    return (
                        <div className="flex items-center my-2 justify-between" key={index}>
                            <div className="flex items-center">
                                <img src={item.images[0].url} className="rounded-full mr-5 aspect-square w-12 object-cover" />
                                {item.name}
                            </div>
                            <div className="ml-5 flex">
                                <div>{index+1}</div>
                                <div>(-)</div>
                            </div>
                        </div>
                    );
                })}
            </div>
            :<div>TOP ARTISTS</div>
        }
        </>
    );
};

export default TopArtists;