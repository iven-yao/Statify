import React, { useEffect, useState } from "react";
import { explaination } from "../utils/utils";
import {MdFiberNew} from "react-icons/md";
import {TiArrowSortedDown, TiArrowSortedUp, TiEquals} from "react-icons/ti";
import {BsQuestionCircleFill} from "react-icons/bs";
import { CiCirclePlus, CiCircleMinus } from "react-icons/ci";
import Loading from "./Loading";
import { getTopTracks, getHeaders } from "../utils/spotifyAPI";
import { HiSwitchVertical } from "react-icons/hi";
import { AllTimeTopTracks, RecentTopTracks } from "./TopTracks";
import { AllTimeTopArtists, RecentTopArtists } from "./TopArtists";

const TopCharts = () => {
    
    const [allTime, setAllTime] = useState();
    const [sixMonth, setSixMonth] = useState();
    const [sixMonthMap, setSixMonthMap] = useState();
    const [fourWeek, setFourWeek] = useState();
    const [chartLen, setChartLen] = useState(10);
    const [chartType, setChartType] = useState("ARTISTS");

    const showMore = () => {
        setChartLen(50);
    }

    const showLess = () => {
        setChartLen(10);
    }

    const switchType = () => {
        if(chartType === 'ARTISTS') setChartType('TRACKS');
        else setChartType('ARTISTS');
    }

    const buildMap = (map, data) => {
        data.items.map((item, index)=>map.set(item.uri, index+1));

        setSixMonthMap(map);
    }

    const check = (track) => {
        var pos = sixMonthMap.get(track);

        return pos;
    }

    useEffect(() => {
        const fetchData = async() => {
            const headers = getHeaders();
            const {long_term, medium_term, short_term} = await getTopTracks(headers);

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
            <div className="col-span-3 grid grid-cols-1 px-12 pt-6 pb-12 md:grid-cols-2">
                <div className="p-2" id="alltime_chart">
                    <div className="flex items-center justify-start text-xl px-2 truncate">
                        TOP {chartLen} <button className="flex px-2 pt-1 rounded-t-xl bg-green-500 mx-2 items-center" onClick={switchType}>{chartType}<HiSwitchVertical/></button> ALL TIME
                    </div>
                    {chartType === 'TRACKS' && <AllTimeTopTracks len={chartLen} />}
                    {chartType === 'ARTISTS' && <AllTimeTopArtists len={chartLen} />}
                </div>
                <div className="p-2" id="month_chart">
                    <div className="flex items-center justify-start text-xl px-2 truncate">
                        <span className="flex truncate">
                            TOP {chartLen} <button className="flex px-2 pt-1 rounded-t-xl bg-green-500 mx-2 items-center" onClick={switchType}>{chartType}<HiSwitchVertical/></button> THIS MONTH
                        </span>
                        <span title={explaination} className="px-2"><BsQuestionCircleFill/></span>
                    </div>
                    {chartType === 'TRACKS' && <RecentTopTracks len={chartLen} />}
                    {chartType === 'ARTISTS' && <RecentTopArtists len={chartLen} />}
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
                <Loading/>
            </div>
        }
        </>
    );
};

export default TopCharts;