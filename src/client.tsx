import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { createApp } from './component';
import { messages } from './messages';

const parent = document.getElementById('app');
const App = createApp(messages);

ReactDOM.render(<App { ...JSON.parse(parent.dataset['props']) } />, parent);
