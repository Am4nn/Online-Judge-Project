import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { Provider } from 'react-redux';
import store from './store/index';
// import Ccursor from './compenents/Ccursor/Ccursor';
import './global.css'

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      {/* <Ccursor /> */}
      <App />
    </Provider>
  </React.StrictMode>
);