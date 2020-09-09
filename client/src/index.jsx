import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Host from './app/Host';

if (module.hot) {
    module.hot.accept();
}

ReactDOM.render(<Host />, document.getElementById('root'));

if ('serviceWorker' in navigator) {
    window.addEventListener('load', async () => {
        await navigator.serviceWorker.register('./serviceWorker.js');
        console.log('Service Worker has been registered');
    })
}