import React, { useEffect, useState } from 'react';
import './App.css';
import Login from './components/Login';
import { getAccessToken } from './utils/spotifyAPI';
import Main from './components/Main';


const App = () => {
  const [access_token, setAccessToken] = useState();
  
  useEffect(() => {
    setAccessToken(getAccessToken());
  },[]);

  return (
    <>
      {!access_token?<Login />:<Main/>}
    </>
  );

}

export default App;
