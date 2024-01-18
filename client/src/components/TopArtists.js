import React, { useEffect, useState } from "react";
import {explaination } from "../utils/utils";
import {MdFiberNew} from "react-icons/md";
import {TiArrowSortedDown, TiArrowSortedUp, TiEquals} from "react-icons/ti";
import {BsQuestionCircleFill} from "react-icons/bs";
import Loading from "./Loading";
import { getHeaders, getTopArtists } from "../utils/spotifyAPI";

const TopArtists = () => {
    
    const [allTime, setAllTime] = useState();
    const [sixMonth, setSixMonth] = useState();
    const [sixMonthMap, setSixMonthMap] = useState();
    const [fourWeek, setFourWeek] = useState();

    const buildMap = (map, data) => {
        data.items.map((item, index)=> map.set(item.uri, index+1));
        setSixMonthMap(map);
    }

    const check = (artist) => {
        var pos = sixMonthMap.get(artist);
        return pos;
    }

    useEffect(() => {

        const fetchData = async () => {
            const headers = getHeaders();
            const data = await Promise.all([getTopArtists(headers)]);
            const {long_term, medium_term, short_term} = data[0];
            setAllTime(long_term);
            setSixMonth(medium_term);
            buildMap(new Map(), medium_term);
            setFourWeek(short_term);
        }

        fetchData();
    },[]);

    return (
        <>
        {fourWeek&&sixMonth&&allTime? 
            <div className="col-span-3 grid grid-cols-1 p-12 md:grid-cols-2 overflow-y-scroll overflow-y-hidden">
                <div className="p-2" id="alltime_chart">
                    <div className="flex items-center justify-between text-xl p-2">
                        TOP 50 ARTISTS ALL TIME
                    </div>
                    <div className="flex flex-col border-2 border-green-500 rounded-xl p-2">
                    {allTime.items.map((item, index)=>{
                        return (
                            <div className={`flex items-center p-2 justify-between ${index !== 0? 'border-t border-gray-500 ':''}`} key={index}>
                                <div className="flex items-center">
                                    <img src={item.images[0].url} className="rounded-full mr-5 aspect-square w-12 object-cover" alt="artist_photo"/>
                                    <span className="text-ellipsis">{item.name}</span>
                                </div>
                                <div className="flex">
                                    <div>{index+1}</div>
                                </div>
                            </div>
                        );
                    })}
                    </div>
                </div>
                <div className="p-2" id="month_chart">
                    <div className="flex items-center justify-between text-xl p-2">
                        <span className="truncate">TOP 50 ARTISTS THIS MONTH</span>
                        <span title={explaination} className="px-2"><BsQuestionCircleFill/></span>
                    </div>
                    <div className="flex flex-col border-2 border-green-500 rounded-xl p-2">
                    {fourWeek.items.map((item, index)=>{
                        return (
                            <div className={`flex items-center p-2 justify-between ${index !== 0? 'border-t border-gray-500 ':''}`} key={index}>
                                <div className="flex items-center">
                                    <img src={item.images[0].url} className="rounded-full mr-5 aspect-square w-12 object-cover" alt="artist_photo"/>
                                    <span className="text-ellipsis">{item.name}</span>
                                </div>
                                <div className="flex">
                                    <div>{index+1}</div>
                                    <div className="ml-5 items-center flex">
                                    {
                                        check(item.uri) === undefined? 
                                            <MdFiberNew/> : 
                                        check(item.uri) === index+1? 
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
                </div>
            </div>
            :
            <div className="col-span-3 p-12">
                <Loading />
            </div>
        }
        </>
    );
};

export default TopArtists;