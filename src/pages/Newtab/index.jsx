import React from 'react';
import * as ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from './App';
import './index.css';

const container = document.getElementById('app');
ReactDOM.createRoot(container).render(
    <React.StrictMode>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </React.StrictMode>
);
