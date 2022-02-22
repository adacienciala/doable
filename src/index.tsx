import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { MantineProvider } from '@mantine/core';

ReactDOM.render(
  <React.StrictMode>
    <MantineProvider
      theme={{
        colors: {
          // you can generate it with those: https://mantine.dev/theming/extend-theme/#extend-or-replace-colors
          yellow: ['#FFF9C5', '#FFF7B2', '#FFF69F', '#FFF48B', '#FFF278', '#FFEF5B', '#FFEC3E', '#f7e436', '#f2df30','#ebca28' ],
        },
        primaryColor: "yellow",
        fontFamily: 'Montserrat, sans-serif',
      }}
    >
      <App />
    </MantineProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
