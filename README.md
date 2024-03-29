# Statify
personal visualize data from your spotify<br/>
created with Node.js, Express, React, React Router, TailwindCSS, chart.js and Spotify Api

## https://statify-you.vercel.app/
Spotify API quota extension is under review, in the meantime, if you want to test the functions, [try locally](#try-locally)

## Demo


https://github.com/iven-yao/Statify/assets/25358966/04c9019f-ef35-49cb-b484-55727b79c7e5



## Try Locally
- clone this repo
- Register a Spotify App and add http://localhost:9000/callback as a Redirect URI in the app settings
- get `CLIENT_ID` and `CLIENT_SECRET` from Spotify API, and put in `server/.env.sample` then rename it as `server/.env`
- in the root directory, run `npm run install-all` to install all dependacies in nested folders
- then run `npm run start`, it will then concurrently run server and client
- check out `http://localhost:3000`

## links

[SpotifyAPI](https://developer.spotify.com/documentation/web-api)

[chart.js](https://github.com/reactchartjs/react-chartjs-2)

[highcharts](https://github.com/highcharts/highcharts-react?tab=readme-ov-file#getting-started)

[PostgreSQL](https://www.postgresqltutorial.com/postgresql-getting-started/)

[PostgreSQL + Cloud](https://towardsdatascience.com/setting-up-a-postgresql-instance-on-the-cloud-4ec4cf168239)
