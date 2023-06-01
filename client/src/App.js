import React, { useEffect, useState } from 'react';
import './App.css';
import Login from './components/Login';
import Profile from './components/Profile';
import { getHashParams } from './utils';


const App = () => {
  const [loginState, setLoginState] = useState();
  
  useEffect(() => {
    let login = getHashParams()['login'];
    setLoginState(login==='success');
  },[]);

  return (
    <>
      {!loginState?<Login />:<Profile/>}
    </>
  );

}

export default App;
