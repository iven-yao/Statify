import React, { useEffect, useState } from "react";
import Loading from "../Loading";
import { Radar } from 'react-chartjs-2';
import { audioOptions } from "../../utils/chart-options";
import 'chart.js/auto'
const { getTopTracks, getHeaders, logout, getAudioFeatures } = require("../../utils/spotifyAPI");

const AudioAnalysis = (props) => {
    const [audioAllTime, setAudioAllTime] = useState(new Map());
    const [audioSixMonth, setAudioSixMonth] = useState(new Map());
    const [audioFourWeek, setAudioFourWeek] = useState(new Map());

    const [chartData, setChartData] = useState();
    const [period, setPeriod] = useState("all");

    const fields = ['acousticness', 'danceability', 'energy', 'instrumentalness', 'liveness', 'speechiness', 'valence'];

    const buildAudioChartData = (map) => (
        {
            labels: [...map.keys()],
            datasets: [
                {
                    label: "count",
                    data: [...map.values()],
                    backgroundColor: 'rgba(0,220,0,0.5)',
                    borderColor: 'rgba(0,220,0,1)',
                    borderWidth: 1,
                    pointBackgroundColor: 'white',
                    pointBorderColor: 'rgba(0,0,0,0.5)',

                }
            ],
        }
    );

    const buildAudioMap = (map, data) => {
        for(let field of fields) {
            map.set(field, 0);
        }

        data.audio_features.forEach((audio_feature) => {
            for(let field of fields) {
                map.set(field, map.get(field) + audio_feature[field]);
            }
        });

        for(let field of fields) {
            map.set(field, map.get(field)/data.audio_features.length);
        }

        return map;
    }

    useEffect(() => {
        const fetch = async() => {
            const headers = getHeaders();
            const data = await Promise.all([getTopTracks(headers, 50)]);
            
            const idsAll = data[0].long_term.items.map((item) => item.id);
            const ids6m = data[0].medium_term.items.map((item) => item.id);
            const ids4w = data[0].short_term.items.map((item) => item.id);
            const trackFeatures = await Promise.all([getAudioFeatures(headers, idsAll),getAudioFeatures(headers, ids6m),getAudioFeatures(headers, ids4w)]);

            setAudioAllTime(buildAudioMap(new Map(), trackFeatures[0].data));
            setAudioSixMonth(buildAudioMap(new Map(), trackFeatures[1].data));
            setAudioFourWeek(buildAudioMap(new Map(), trackFeatures[2].data));
        };

        fetch().catch(err => {
            console.error(err);
            logout();
        });
         // eslint-disable-next-line
    }, []);

    useEffect(() => {
            let audiolist = [];
            switch (period){
                case 'all':
                    if(audioAllTime.size > 0) {
                        audiolist = [...audioAllTime.entries()];
                    }
                    if(audiolist.length > 0){
                        setChartData(buildAudioChartData(new Map(audiolist)));
                    }
                    break;
                case '6m':
                    if(audioSixMonth.size > 0) {
                        audiolist = [...audioSixMonth.entries()];
                    }
                    if(audiolist.length > 0) {
                        setChartData(buildAudioChartData(new Map(audiolist)));
                    }
                    break;
                case '4w':
                    if(audioFourWeek.size > 0) {
                        audiolist = [...audioFourWeek.entries()];
                    }
                    if(audiolist.length > 0) {
                        setChartData(buildAudioChartData(new Map(audiolist)));
                    }
                    break;
                default:
                    break;
            }
    }, [audioAllTime, audioSixMonth, audioFourWeek, period]);

    useEffect(() => {
        setPeriod(props.prop_period);
    },[props.prop_period])

    return (
        <>
        {chartData ?
            <div>
                <Radar data={chartData} options={audioOptions}/>
            </div>
            :
            <Loading />
        }
        </>
    )
}

export default AudioAnalysis;