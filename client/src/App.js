import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';

const App = () => {
  const [apiRes, setApiRes] = useState();

  // useEffect(() => {
  //   fetch("http://localhost:9000/test")
  //     .then(res => res.text())
  //     .then(res => setApiRes(res))
  //     .catch(err => console.log(err));
  // });

  const login = () => {
    fetch("http://localhost:9000/login")
      .then(res => res.text())
      .then(res => setApiRes(res))
      .catch(err => console.log(err));
  };

  return (
    <>
    <div className="App center">
      <button className="login-btn" onClick={login}>
          <span className="front">
              LOGIN
          </span>
      </button>
    </div>
    <div className='center'>
      {apiRes}
    </div>
    </>
  );

}

export default App;
