/**
 * Entry point for browserify
 */

import React from 'react';
import App from './components/App.jsx';

// connects react for chrome tools
window.React = React;

React.render(React.createElement(App), document.getElementById('app'));

console.info('Loaded');
