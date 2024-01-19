import React, { useEffect, useState } from "react";
import Loading from "./Loading";
import { Chart as ChartJS, ArcElement, Tooltip, Legend} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { color, options } from "../utils/chart-options";
import { IoIosArrowDropright, IoIosArrowDropleft, IoIosArrowDropdown, IoIosArrowDropup } from "react-icons/io";
const { getTopArtists, getTopTracks, getHeaders, logout } = require("../utils/spotifyAPI");

ChartJS.register(ArcElement, Tooltip, Legend);
const Stats = () => {
    const [genreAllTime, setGenreAllTime] = useState(new Map());
    const [genreSixMonth, setGenreSixMonth] = useState(new Map());
    const [genreFourWeek, setGenreFourWeek] = useState(new Map());

    const [popAllTime, setPopAllTime] = useState();
    const [popSixMonth, setPopSixMonth] = useState();
    const [popFourWeek, setPopFourWeek] = useState();

    const [chartData, setChartData] = useState();
    const [state, setState] = useState("all");
    const [title, setTitle] = useState("");

    const states = ['4w','6m','all'];

    const nextState = () => {
        const curr = states.indexOf(state);
        const len = states.length;
        let next = curr+1 == len? 0: curr+1;
        setState(states[next]);
    }

    const prevState = () => {
        const curr = states.indexOf(state);
        const len = states.length;
        let prev = curr-1 == -1? len-1: curr-1;
        setState(states[prev]);
    }

    const buildChartData = (map) => (
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
        // chartdata
        let fourweek = [], sixmonth = [], alltime = [];
        switch (state){
            case 'all':
                if(genreAllTime.size > 0) {
                    alltime = [...genreAllTime.entries()].filter((entry)=>entry[1] >1).sort((a, b) => b[1] - a[1]);
                    let othera = [...genreAllTime.entries()].filter((entry) => entry[1] == 1);
                    alltime.push(['others', othera.length]);
                }
                if(alltime.length > 0){
                    setChartData(buildChartData(new Map(alltime)));
                    setTitle("All-time Genre");
                }
                break;
            case '6m':
                if(genreSixMonth.size > 0) {
                    sixmonth = [...genreSixMonth.entries()].filter((entry)=>entry[1] >1).sort((a, b) => b[1] - a[1]);
                    let other6 = [...genreSixMonth.entries()].filter((entry) => entry[1] == 1);
                    sixmonth.push(['others', other6.length]);
                }
                if(sixmonth.length > 0) {
                    setChartData(buildChartData(new Map(sixmonth)));
                    setTitle("Half-year Genre");
                }
                break;
            case '4w':
                if(genreFourWeek.size > 0) {
                    fourweek = [...genreFourWeek.entries()].filter((entry)=>entry[1] >1).sort((a, b) => b[1] - a[1]);
                    let other4 = [...genreFourWeek.entries()].filter((entry) => entry[1] == 1);
                    fourweek.push(['others', other4.length]);
                }
                if(fourweek.length > 0) {
                    setChartData(buildChartData(new Map(fourweek)));
                    setTitle("This Month Genre");
                }
                break;
        }
        
    }, [genreAllTime, genreSixMonth, genreFourWeek, state]);

    return (
        <>
        {chartData?
            <div className="col-span-3 grid grid-cols-1 md:grid-cols-6 p-12">
                <div className="flex flex-col justify-center items-center text-green-500">
                    <button onClick={prevState}>
                        <IoIosArrowDropleft size={35} className="hidden md:block"/>
                        <IoIosArrowDropup size={25} className="md:hidden" />
                    </button>
                </div>
                <div className="flex flex-col justify-center col-span-4 rounded-xl border-x md:border-x-0 md:border-y-2 border-green-500">
                    <Doughnut data={chartData} options={options}/>
                    <div className="text-center">{title}</div>
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

export default Stats;