import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';

const App = () => {
  const [apiRes, setApiRes] = useState();

  useEffect(() => {
    fetch("http://localhost:9000/test")
      .then(res => res.text())
      .then(res => setApiRes(res))
      .catch(err => console.log(err));
  });

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <p>
          {apiRes}
        </p>
      </header>
    </div>
  );

}

export default App;
