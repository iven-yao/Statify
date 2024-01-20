import React, { useEffect, useState } from "react";
import Loading from "../Loading";
import { Bar } from 'react-chartjs-2';
import { popColor, popOptions } from "../../utils/chart-options";
import 'chart.js/auto'
const { getTopArtists, getHeaders, logout } = require("../../utils/spotifyAPI");

const PopAnalysis = (props) => {
    const [popAllTime, setPopAllTime] = useState(new Map());
    const [popSixMonth, setPopSixMonth] = useState(new Map());
    const [popFourWeek, setPopFourWeek] = useState(new Map());

    const [popAllTimeAvg, setPopAllTimeAvg] = useState(0.0);
    const [popSixMonthAvg, setPopSixMonthAvg] = useState(0.0);
    const [popFourWeekAvg, setPopFourWeekAvg] = useState(0.0);

    const [chartData, setChartData] = useState();
    const [period, setPeriod] = useState("all");
    const [avg, setAvg] = useState(0.0);

    const buildPopChartData = (map) => (
        {
            labels: [...map.keys()],
            datasets: [
                {
                    label: "count",
                    data: [...map.values()],
                    backgroundColor: popColor(),
                    barPercentage: 1,
                    categoryPercentage:1,
                }
            ]
        }
    );

    const buildPopMap = (map, data) => {
        for(let i = 0; i <= 100; i+=10) {
            map.set(i, 0);
        }

        let sum = 0;
        let count = 0;

        data.items.forEach((item) => {
            let interval = Math.round(item.popularity/10)*10;
            map.set(interval, map.get(interval) + 1);
            sum += item.popularity;
            count++;
        });

        let average = sum/count;

        return [map, average];
    }

    useEffect(() => {
        const fetch = async() => {
            const headers = getHeaders();
            const data = await Promise.all([getTopArtists(headers, 50)]);

            const [allmap, allavg] = buildPopMap(new Map(), data[0].long_term);
            setPopAllTime(allmap);
            setPopAllTimeAvg(allavg);
            const [sixmmap, sixmavg] = buildPopMap(new Map(), data[0].medium_term);
            setPopSixMonth(sixmmap);
            setPopSixMonthAvg(sixmavg);
            const [fourwmap, fourwavg] = buildPopMap(new Map(), data[0].short_term);
            setPopFourWeek(fourwmap);
            setPopFourWeekAvg(fourwavg);          
        };

        fetch().catch(err => {
            console.error(err);
            logout();
        });
    },[]);

    useEffect(() => {
            let poplist = [];
            switch (period){
                case 'all':
                    if(popAllTime.size > 0) {
                        poplist = [...popAllTime.entries()].sort((a, b) => a[0] - b[0]);
                    }
                    if(poplist.length > 0){
                        setChartData(buildPopChartData(new Map(poplist)));
                        setAvg(popAllTimeAvg);
                    }
                    break;
                case '6m':
                    if(popSixMonth.size > 0) {
                        poplist = [...popSixMonth.entries()].sort((a, b) => a[0] - b[0]);
                    }
                    if(poplist.length > 0) {
                        setChartData(buildPopChartData(new Map(poplist)));
                        setAvg(popSixMonthAvg);
                    }
                    break;
                case '4w':
                    if(popFourWeek.size > 0) {
                        poplist = [...popFourWeek.entries()].sort((a, b) => a[0] - b[0]);
                    }
                    if(poplist.length > 0) {
                        setChartData(buildPopChartData(new Map(poplist)));
                        setAvg(popFourWeekAvg);
                    }
                    break;
                default:
                    break;
            }
    }, [popAllTime, popSixMonth, popFourWeek, period]);

    useEffect(() => {
        setPeriod(props.prop_period);
    },[props.prop_period])

    return (
        <>
        {chartData ?
            <div>
                <Bar data={chartData} options={popOptions}/>
                <div className="text-xs md:text-base flex justify-end text-gray-400">Average Popularity: {avg}</div>
            </div>
            :
            <Loading />
        }
        </>
    )
}

export default PopAnalysis;