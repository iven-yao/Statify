import React, { useEffect, useState } from 'react';
import './App.css';
import Login from './components/Login';
import { getHashParams } from './utils';
import Main from './components/Main';


const App = () => {
  const [loginState, setLoginState] = useState();
  
  useEffect(() => {
    let login = getHashParams()['login'];
    if(login==='success') {
      localStorage.setItem('expiration', Math.floor(Date.now() / 1000) + 3600);
    }
    var expiration = localStorage.getItem('expiration');
    if(expiration < Math.floor(Date.now()/1000)) {
      localStorage.removeItem('expiration');
      expiration = null;
    }
    setLoginState(expiration);
  },[]);

  return (
    <>
      {!loginState?<Login />:<Main/>}
    </>
  );

}

export default App;
