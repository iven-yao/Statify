import React, { useEffect, useState } from "react";
import Loading from "./Loading";
import { Chart as ChartJS, ArcElement, Tooltip, Legend} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { activeButton, color, inActiveButton, options } from "../utils/chart-options";
import { IoIosArrowDropright, IoIosArrowDropleft, IoIosArrowDropdown, IoIosArrowDropup } from "react-icons/io";
const { getTopArtists, getTopTracks, getHeaders, logout } = require("../utils/spotifyAPI");

ChartJS.register(ArcElement, Tooltip, Legend);
const Analysis = () => {
    const [genreAllTime, setGenreAllTime] = useState(new Map());
    const [genreSixMonth, setGenreSixMonth] = useState(new Map());
    const [genreFourWeek, setGenreFourWeek] = useState(new Map());

    const [popAllTime, setPopAllTime] = useState();
    const [popSixMonth, setPopSixMonth] = useState();
    const [popFourWeek, setPopFourWeek] = useState();

    const [chartData, setChartData] = useState();
    const [period, setPeriod] = useState("all");
    const [chartType, setChartType] = useState("genre");
    const [title, setTitle] = useState("");

    const periods = ['4w','6m','all'];

    const nextState = () => {
        const curr = periods.indexOf(period);
        const len = periods.length;
        let next = curr+1 == len? 0: curr+1;
        setPeriod(periods[next]);
    }

    const prevState = () => {
        const curr = periods.indexOf(period);
        const len = periods.length;
        let prev = curr-1 == -1? len-1: curr-1;
        setPeriod(periods[prev]);
    }

    const setGenre = () => {
        setChartType('genre');
    }

    const setPop = () => {
        setChartType('pop');
    }

    const buildGenreChartData = (map) => (
        {
            labels: [...map.keys()],
            datasets: [
                {
                    label: "count",
                    data: [...map.values()],
                    backgroundColor: color([...map.keys()].length),
                    borderWidth: 0,
                    spacing: 0,
                    rotation: -45,
                    clip: {left: 20, top: false, right: 20, bottom: 0},
                }
            ]
        }
    );

    const buildGenreMap = (map, data) => {
        data.items.forEach((item) => {
            item.genres.forEach((genre) => {
                map.set(genre, (map.get(genre)||0) + 1);
            })
        })

        return map;
    }

    const buildPopArr = (arr, data) => {
        data.items.forEach((item) => {
            arr[item.popularity-1]++;
        })

        return arr;
    }

    useEffect(() => {
        const fetch = async() => {
            const headers = getHeaders();
            const data = await Promise.all([getTopArtists(headers, 50), getTopTracks(headers, 50)]);

            // genre total won't be 50, since each artists will have multiple genre tag
            setGenreAllTime(buildGenreMap(new Map(), data[0].long_term));
            setGenreSixMonth(buildGenreMap(new Map(), data[0].medium_term));
            setGenreFourWeek(buildGenreMap(new Map(), data[0].short_term));

            // pop arr
            setPopAllTime(buildPopArr(new Array(100).fill(0), data[0].long_term));
            setPopSixMonth(buildPopArr(new Array(100).fill(0), data[0].medium_term));
            setPopFourWeek(buildPopArr(new Array(100).fill(0), data[0].short_term));            
        };

        fetch().catch(err => {
            console.error(err);
            logout();
        });
    },[]);

    useEffect(() => {
        // Genre
        if(chartType === 'genre') {
            let fourweekGenre = [], sixmonthGenre = [], alltimeGenre = [];
            switch (period){
                case 'all':
                    if(genreAllTime.size > 0) {
                        alltimeGenre = [...genreAllTime.entries()].filter((entry)=>entry[1] >1).sort((a, b) => b[1] - a[1]);
                        let othera = [...genreAllTime.entries()].filter((entry) => entry[1] == 1);
                        alltimeGenre.push(['others', othera.length]);
                    }
                    if(alltimeGenre.length > 0){
                        setChartData(buildGenreChartData(new Map(alltimeGenre)));
                        setTitle("All-time Genre");
                    }
                    break;
                case '6m':
                    if(genreSixMonth.size > 0) {
                        sixmonthGenre = [...genreSixMonth.entries()].filter((entry)=>entry[1] >1).sort((a, b) => b[1] - a[1]);
                        let other6 = [...genreSixMonth.entries()].filter((entry) => entry[1] == 1);
                        sixmonthGenre.push(['others', other6.length]);
                    }
                    if(sixmonthGenre.length > 0) {
                        setChartData(buildGenreChartData(new Map(sixmonthGenre)));
                        setTitle("Half-year Genre");
                    }
                    break;
                case '4w':
                    if(genreFourWeek.size > 0) {
                        fourweekGenre = [...genreFourWeek.entries()].filter((entry)=>entry[1] >1).sort((a, b) => b[1] - a[1]);
                        let other4 = [...genreFourWeek.entries()].filter((entry) => entry[1] == 1);
                        fourweekGenre.push(['others', other4.length]);
                    }
                    if(fourweekGenre.length > 0) {
                        setChartData(buildGenreChartData(new Map(fourweekGenre)));
                        setTitle("Recent Genre");
                    }
                    break;
            }
        // Popularity
        } else if(chartType === 'pop') {
            let fourweekPop = [], sixmonthPop = [], alltimePop = [];
            switch (period){
                case 'all':
                    if(genreAllTime.size > 0) {
                        alltimePop = [...genreAllTime.entries()].filter((entry)=>entry[1] >1).sort((a, b) => b[1] - a[1]);
                        let othera = [...genreAllTime.entries()].filter((entry) => entry[1] == 1);
                        alltimePop.push(['others', othera.length]);
                    }
                    if(alltimePop.length > 0){
                        setChartData(buildGenreChartData(new Map(alltimePop)));
                        setTitle("All-time Popularity");
                    }
                    break;
                case '6m':
                    if(genreSixMonth.size > 0) {
                        sixmonthPop = [...genreSixMonth.entries()].filter((entry)=>entry[1] >1).sort((a, b) => b[1] - a[1]);
                        let other6 = [...genreSixMonth.entries()].filter((entry) => entry[1] == 1);
                        sixmonthPop.push(['others', other6.length]);
                    }
                    if(sixmonthPop.length > 0) {
                        setChartData(buildGenreChartData(new Map(sixmonthPop)));
                        setTitle("Half-year Popularity");
                    }
                    break;
                case '4w':
                    if(genreFourWeek.size > 0) {
                        fourweekPop = [...genreFourWeek.entries()].filter((entry)=>entry[1] >1).sort((a, b) => b[1] - a[1]);
                        let other4 = [...genreFourWeek.entries()].filter((entry) => entry[1] == 1);
                        fourweekPop.push(['others', other4.length]);
                    }
                    if(fourweekPop.length > 0) {
                        setChartData(buildGenreChartData(new Map(fourweekPop)));
                        setTitle("Recent Popularity");
                    }
                    break;
            }
        }
        
    }, [genreAllTime, genreSixMonth, genreFourWeek, period, chartType]);

    return (
        <>
        {chartData?
            <div className="col-span-3 grid grid-cols-1 md:grid-cols-8 px-12 md:pb-16 lg:my-auto lg:pb-0">
                <div className="flex flex-col justify-center items-center text-green-500">
                    <button onClick={prevState}>
                        <IoIosArrowDropleft size={35} className="hidden md:block"/>
                        <IoIosArrowDropup size={25} className="md:hidden" />
                    </button>
                </div>
                <div className="flex flex-col justify-center col-span-6 px-10 rounded-xl border-x md:border-x-0 md:border-y-2 border-green-500">
                    <div className="text-center mt-2">{title}</div>
                    {chartType === 'genre' && <Doughnut data={chartData} options={options}/>}
                    {chartType === 'pop' && <Doughnut data={chartData} options={options}/>}
                    <div className="flex">
                        <button className={chartType==='genre'?activeButton:inActiveButton} onClick={setGenre}>Genre Analysis</button>
                        <button className={chartType==='pop'?activeButton:inActiveButton} onClick={setPop}>Popularity</button>
                    </div>
                </div>
                <div className="flex flex-col justify-center items-center text-green-500">
                    <button onClick={nextState}>
                        <IoIosArrowDropright size={35} className="hidden md:block"/>
                        <IoIosArrowDropdown size={25} className="md:hidden" />
                    </button>
                </div>
            </div>
            :
            <div className="col-span-3">
                <Loading />
            </div>
        }
        </>
    );
}

export default Analysis;