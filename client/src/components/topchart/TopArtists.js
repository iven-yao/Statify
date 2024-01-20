import React, { useEffect, useState } from "react";
import {explaination } from "../../utils/utils";
import {MdFiberNew} from "react-icons/md";
import {TiArrowSortedDown, TiArrowSortedUp, TiEquals} from "react-icons/ti";
import {BsQuestionCircleFill} from "react-icons/bs";
import { CiCirclePlus, CiCircleMinus } from "react-icons/ci";
import Loading from "../Loading";
import { getHeaders, getTopArtists } from "../../utils/spotifyAPI";

const TopArtists = () => {
    
    const [allTime, setAllTime] = useState();
    const [sixMonth, setSixMonth] = useState();
    const [sixMonthMap, setSixMonthMap] = useState();
    const [fourWeek, setFourWeek] = useState();
    const [chartLen, setChartLen] = useState(10);

    const showMore = () => {
        setChartLen(50);
    }

    const showLess = () => {
        setChartLen(10);
    }

    const buildMap = (map, data) => {
        data.items.map((item, index)=> map.set(item.uri, index+1));
        setSixMonthMap(map);
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
        {fourWeek&&sixMonth&&allTime&&sixMonthMap? 
            <div className="col-span-3 grid grid-cols-1 px-12 pt-6 pb-12 md:grid-cols-2">
                <div className="p-2" id="alltime_chart">
                    <div className="flex items-center justify-between text-xl p-2 truncate">
                        TOP {chartLen} ARTISTS ALL TIME
                    </div>
                    <AllTimeTopArtists len={chartLen} />
                </div>
                <div className="p-2" id="month_chart">
                    <div className="flex items-center justify-between text-xl p-2 truncate">
                        <span className="truncate">TOP {chartLen} ARTISTS THIS MONTH</span>
                        <span title={explaination} className="px-2"><BsQuestionCircleFill/></span>
                    </div>
                    <RecentTopArtists len={chartLen} />
                </div>
                <div className="md:col-span-2 flex items-center justify-center pb-2">
                    {chartLen === 50?
                        <CiCircleMinus size={35} title="Show Less" onClick={showLess} className="cursor-pointer"/>
                        :
                        <CiCirclePlus size={35} title="Show More" onClick={showMore} className="cursor-pointer"/>
                    }
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

export const RecentTopArtists = (props) => {
    const [sixMonthMap, setSixMonthMap] = useState();
    const [fourWeek, setFourWeek] = useState();
    const [chartLen, setChartLen] = useState(10);

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
            /* eslint-disable no-unused-vars */
            const {long_term, medium_term, short_term} = data[0];
            buildMap(new Map(), medium_term);
            setFourWeek(short_term);
        }

        fetchData();
    },[]);
    
    useEffect(() => {
        setChartLen(props.len);
    },[props.len])

    return (
        <div className="flex flex-col border-2 border-green-500 rounded-xl p-2">
            {fourWeek && sixMonthMap && fourWeek.items.slice(0, chartLen).map((item, index)=>{
                return (
                    <div className={`flex items-center p-1 justify-between ${index !== 0? 'border-t border-gray-500 ':''}`} key={`recent${index}`}>
                        <div className="flex items-center">
                            <img src={item.images[0].url} className="rounded-full mr-5 aspect-square w-11 object-cover" alt="artist_photo"/>
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
    );
}

export const AllTimeTopArtists = (props) => {
    const [allTime, setAllTime] = useState();
    const [chartLen, setChartLen] = useState(10);

    useEffect(() => {
        const fetchData = async() => {
            const headers = getHeaders();
            /* eslint-disable no-unused-vars */
            const {long_term, medium_term, short_term} = await getTopArtists(headers);

            setAllTime(long_term);
        }

        fetchData();
    },[]);

    useEffect(() => {
        setChartLen(props.len);
    },[props.len])

    return (
        <div className="flex flex-col border-2 border-green-500 rounded-xl p-2">
            {allTime && allTime.items.slice(0,chartLen).map((item, index)=>{
                return (
                    <div className={`flex items-center p-1 justify-between ${index !== 0? 'border-t border-gray-500 ':''}`} key={index}>
                        <div className="flex items-center">
                            <img src={item.images[0].url} className="rounded-full mr-5 aspect-square w-11 object-cover" alt="artist_photo"/>
                            <span className="text-ellipsis">{item.name}</span>
                        </div>
                        <div className="flex">
                            <div>{index+1}</div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

export default TopArtists;