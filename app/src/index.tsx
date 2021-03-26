import React from 'react';
import ReactDOM from 'react-dom';
import { Drizzle, generateStore } from "@drizzle/store";
// @ts-ignore
import {DrizzleContext} from "@drizzle/react-plugin";
import drizzleOptions from './drizzleOptions';
import './index.css';
import './loading.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import {AppLayout} from "./routes/AppLayout";

const drizzleStore = generateStore({drizzleOptions});
const drizzle = new Drizzle(drizzleOptions, drizzleStore);
// @ts-ignore
window.drizzle = drizzle;

ReactDOM.render(
  <React.StrictMode>
  <DrizzleContext.Provider drizzle={drizzle}>
    <AppLayout>
      <App />
    </AppLayout>
  </DrizzleContext.Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
