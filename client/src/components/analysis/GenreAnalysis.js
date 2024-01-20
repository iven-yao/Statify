import React, { useEffect, useState } from "react";
import Loading from "../Loading";
import { Doughnut } from 'react-chartjs-2';
import { genreColor, genreOptions } from "../../utils/chart-options";
const { getTopArtists, getHeaders, logout } = require("../../utils/spotifyAPI");

const GenreAnalysis = (props) => {
    const [genreAllTime, setGenreAllTime] = useState(new Map());
    const [genreSixMonth, setGenreSixMonth] = useState(new Map());
    const [genreFourWeek, setGenreFourWeek] = useState(new Map());

    const [chartData, setChartData] = useState();
    const [period, setPeriod] = useState("all");
    const [topgenres, setTopgenres] = useState("");

    const buildGenreChartData = (map) => (
        {
            labels: [...map.keys()],
            datasets: [
                {
                    label: "count",
                    data: [...map.values()],
                    backgroundColor: genreColor([...map.keys()].length),
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

    useEffect(() => {
        const fetch = async() => {
            const headers = getHeaders();
            const data = await Promise.all([getTopArtists(headers, 50)]);

            // genre total won't be 50, since each artists will have multiple genre tag
            setGenreAllTime(buildGenreMap(new Map(), data[0].long_term));
            setGenreSixMonth(buildGenreMap(new Map(), data[0].medium_term));
            setGenreFourWeek(buildGenreMap(new Map(), data[0].short_term));          
        };

        fetch().catch(err => {
            console.error(err);
            logout();
        });
    },[]);

    useEffect(() => {
            let genrelist = [];
            switch (period){
                case 'all':
                    if(genreAllTime.size > 0) {
                        genrelist = [...genreAllTime.entries()].filter((entry)=>entry[1] >1).sort((a, b) => b[1] - a[1]);
                        let othera = [...genreAllTime.entries()].filter((entry) => entry[1] === 1);
                        genrelist.push(['others', othera.length]);
                    }
                    if(genrelist.length > 0){
                        setChartData(buildGenreChartData(new Map(genrelist)));
                        setTopgenres(genrelist.slice(0,3).map((a)=>a[0]).join(","));
                    }
                    break;
                case '6m':
                    if(genreSixMonth.size > 0) {
                        genrelist = [...genreSixMonth.entries()].filter((entry)=>entry[1] >1).sort((a, b) => b[1] - a[1]);
                        let other6 = [...genreSixMonth.entries()].filter((entry) => entry[1] === 1);
                        genrelist.push(['others', other6.length]);
                    }
                    if(genrelist.length > 0) {
                        setChartData(buildGenreChartData(new Map(genrelist)));
                        setTopgenres(genrelist.slice(0,3).map((a)=>a[0]).join(","));
                    }
                    break;
                case '4w':
                    if(genreFourWeek.size > 0) {
                        genrelist = [...genreFourWeek.entries()].filter((entry)=>entry[1] >1).sort((a, b) => b[1] - a[1]);
                        let other4 = [...genreFourWeek.entries()].filter((entry) => entry[1] === 1);
                        genrelist.push(['others', other4.length]);
                    }
                    if(genrelist.length > 0) {
                        setChartData(buildGenreChartData(new Map(genrelist)));
                        setTopgenres(genrelist.slice(0,3).map((a)=>a[0]).join(","));
                    }
                    break;
                default:
                    break;
            }
    }, [genreAllTime, genreSixMonth, genreFourWeek, period]);

    useEffect(() => {
        setPeriod(props.prop_period);
    },[props.prop_period])

    return (
        <>
        {chartData ?
            <div>
                <Doughnut data={chartData} options={genreOptions}/>
                <div className="flex justify-end text-gray-400 text-xs md:text-base">Top Genres: {topgenres}</div>
            </div>
            :
            <Loading />
        }
        </>
    )
}

export default GenreAnalysis;