import React, { useEffect, useState } from 'react';
import './App.css';
import Login from './components/Login';
import Profile from './components/Profile';
import { getHashParams } from './utils';


const App = () => {
  const [loginState, setLoginState] = useState();
  
  useEffect(() => {
    setLoginState(getHashParams()['login']);
  });

  return (
    <>
      {loginState!=='true'?<Login />:<Profile/>}
    </>
  );

}

export default App;
