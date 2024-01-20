import React, { useState } from "react";
import { explaination } from "../utils/utils";
import {BsQuestionCircleFill} from "react-icons/bs";
import { CiCirclePlus, CiCircleMinus } from "react-icons/ci";
import { HiSwitchVertical } from "react-icons/hi";
import { AllTimeTopTracks, RecentTopTracks } from "./topchart/TopTracks";
import { AllTimeTopArtists, RecentTopArtists } from "./topchart/TopArtists";

const TopCharts = () => {
    const [chartLen, setChartLen] = useState(10);
    const [chartType, setChartType] = useState("TRACKS");

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

    return (
        <div className="col-span-3 grid grid-cols-1 px-12 pt-6 pb-12 md:grid-cols-2">
            <div className="p-2" id="alltime_chart">
                <div className="flex items-center justify-start text-sm md:text-xl px-2 truncate">
                    TOP {chartLen} <button className="flex px-2 rounded-t-lg bg-green-500 mx-2 items-center" onClick={switchType}>{chartType}<HiSwitchVertical/></button> ALL TIME
                </div>
                {chartType === 'TRACKS' && <AllTimeTopTracks len={chartLen} />}
                {chartType === 'ARTISTS' && <AllTimeTopArtists len={chartLen} />}
            </div>
            <div className="p-2" id="month_chart">
                <div className="flex items-center justify-start text-sm md:text-xl px-2 truncate">
                    <span className="flex truncate">
                        TOP {chartLen} <button className="flex px-2 rounded-t-lg bg-green-500 mx-2 items-center" onClick={switchType}>{chartType}<HiSwitchVertical/></button> RECENT
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
    );
};

export default TopCharts;