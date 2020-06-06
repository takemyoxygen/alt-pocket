import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Host from './app/Host';

if (module.hot) {
    module.hot.accept();
}

ReactDOM.render(<Host />, document.getElementById('root'));
