import React, { useEffect, useState } from "react";
import { serverURI } from "../utils";
import {MdFiberNew} from "react-icons/md";
import {TiArrowSortedDown, TiArrowSortedUp, TiEquals} from "react-icons/ti";
import {BsQuestionCircleFill} from "react-icons/bs";

const TopArtists = () => {
    
    const [allTime, setAllTime] = useState();
    const [sixMonth, setSixMonth] = useState();
    const [sixMonthMap, setSixMonthMap] = useState();
    const [fourWeek, setFourWeek] = useState();

    let explaination = "Position changed mark is relative to your own six-month data.";

    const buildMap = (map, data) => {
        data.items.map((item, index)=>{
            map.set(item.uri, index+1);
        });

        setSixMonthMap(map);
    }

    const check = (artist) => {
        var pos = sixMonthMap.get(artist);

        return pos;
    }

    useEffect(() => {
        fetch(`${serverURI}/top/artists/long_term`)
        .then(res => res.json())
        .then(res => setAllTime(res))
        .catch(err => console.log(err));
        
        fetch(`${serverURI}/top/artists/medium_term`)
        .then(res => res.json())
        .then((res) => {
            buildMap(new Map(), res);
            setSixMonth(res);
        })
        .catch(err => console.log(err));

        fetch(`${serverURI}/top/artists/short_term`)
        .then(res => res.json())
        .then(res => setFourWeek(res))
        .catch(err => console.log(err));
    },[]);

    return (
        <>
        {fourWeek&&sixMonth? 
            <div className="m-5">
                <div className="flex items-center justify-between">
                    TOP 50 ARTISTS THIS MONTH
                    <span title={explaination}><BsQuestionCircleFill/></span>
                </div>
                {fourWeek.items.map((item, index)=>{
                    return (
                        <div className="flex items-center my-2 justify-between" key={index}>
                            <div className="flex items-center">
                                <img src={item.images[0].url} className="rounded-full mr-5 aspect-square w-12 object-cover" />
                                {item.name}
                            </div>
                            <div className="ml-5 flex">
                                <div>{index+1}</div>
                                <div className="ml-5 items-center flex">
                                {
                                    check(item.uri) == undefined? 
                                        <MdFiberNew/> : 
                                    check(item.uri) == index+1? 
                                        <TiEquals/>: 
                                    check(item.uri) > index+1? 
                                        <span className="text-green-500"><TiArrowSortedUp/></span>:
                                        <span className="text-red-500"><TiArrowSortedDown/></span>
                                }
                                </div>
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