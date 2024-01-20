import React, { useEffect, useState } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend} from 'chart.js';
import { activeButton, inActiveButton } from "../utils/chart-options";
import { IoIosArrowDropright, IoIosArrowDropleft, IoIosArrowDropdown, IoIosArrowDropup } from "react-icons/io";
import GenreAnalysis from "./analysis/GenreAnalysis";
import PopAnalysis from "./analysis/PopAnalysis";
import AudioAnalysis from "./analysis/AudioAnalysis";

ChartJS.register(ArcElement, Tooltip, Legend);
const Analysis = () => {
    const [period, setPeriod] = useState("all");
    const [chartType, setChartType] = useState("genre");
    const [title, setTitle] = useState("");

    const periods = ['4w','6m','all'];

    const nextState = () => {
        const curr = periods.indexOf(period);
        const len = periods.length;
        let next = curr+1 === len? 0: curr+1;
        setPeriod(periods[next]);
    }

    const prevState = () => {
        const curr = periods.indexOf(period);
        const len = periods.length;
        let prev = curr-1 === -1? len-1: curr-1;
        setPeriod(periods[prev]);
    }

    const setGenre = () => {
        setChartType('genre');
    }

    const setPop = () => {
        setChartType('pop');
    }

    const setAudio = () => {
        setChartType('audio');
    }

    useEffect(() => {
        // Genre
        if(chartType === 'genre') {
            switch (period){
                case 'all':
                    setTitle("All-time Genre");
                    break;
                case '6m':
                    setTitle("Half-year Genre");
                    break;
                case '4w':
                    setTitle("Recent Genre");
                    break;
                default:
                    setTitle("");
                    break;
            }
        // Popularity
        } else if(chartType === 'pop') {
            switch (period){
                case 'all':
                    setTitle("All-time Popularity");
                    break;
                case '6m':
                    setTitle("Half-year Popularity");
                    break;
                case '4w':
                    setTitle("Recent Popularity");
                    break;
                default:
                    break;
            }
        } else if(chartType === 'audio') {
            switch (period){
                case 'all':
                    setTitle("All-time Audio Features");
                    break;
                case '6m':
                    setTitle("Half-year Audio Features");
                    break;
                case '4w':
                    setTitle("Recent Audio Features");
                    break;
                default:
                    break;
            }
        }
        
    }, [period, chartType]);

    return (
        <div className="col-span-3 grid grid-cols-1 md:grid-cols-8 px-2 md:px-16 md:pb-16 lg:my-auto lg:pb-0">
            <div className="flex flex-col justify-center items-center text-green-500">
                <button onClick={prevState}>
                    <IoIosArrowDropleft size={35} className="hidden md:block"/>
                    <IoIosArrowDropup size={25} className="md:hidden" />
                </button>
            </div>
            <div className="flex flex-col justify-center col-span-6 px-10 rounded-xl border-x md:border-x-0 md:border-y-2 border-green-500">
                <div className="text-center mt-2">{title}</div>
                {chartType === 'genre' && <GenreAnalysis prop_period={period} />}
                {chartType === 'pop' && <PopAnalysis prop_period={period}/>}
                {chartType === 'audio' && <AudioAnalysis prop_period={period}/>}
                <div className="flex mt-2 md:mt-0 justify-center md:justify-start">
                    <button className={chartType==='genre'?activeButton:inActiveButton} onClick={setGenre}>Genre</button>
                    <button className={chartType==='pop'?activeButton:inActiveButton} onClick={setPop}>Popularity</button>
                    <button className={chartType==='audio'?activeButton:inActiveButton} onClick={setAudio}>Audio Features</button>
                    <div className="hidden md:block md:pt-4 md:pl-2  text-gray-500">based on your favorite artists/tracks</div>
                </div>
            </div>
            <div className="flex flex-col justify-center items-center text-green-500">
                <button onClick={nextState}>
                    <IoIosArrowDropright size={35} className="hidden md:block"/>
                    <IoIosArrowDropdown size={25} className="md:hidden" />
                </button>
            </div>
        </div>  
    );
}

export default Analysis;