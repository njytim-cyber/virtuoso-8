import React from 'react';
import ReactDOM from 'react-dom/client';
import AppContainerMock from './containers/AppContainerMock';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <AppContainerMock />
    </React.StrictMode>
);
