import React from 'react';
import ReactDOM from 'react-dom';
import { render } from 'react-dom';
import { Router, Route } from 'react-router';
//import { Provider } from 'react-redux';
import createBrowserHistory from 'history/lib/createBrowserHistory';
import KanbanAppContainer from './src/KanbanAppContainer';
import KanbanBoard from './src/KanbanBoard.js';
import EditCard from './src//EditCard.js';
import NewCard from './src//NewCard.js';

render(
  <Router history={createBrowserHistory()}>
    <Route component={KanbanAppContainer}>
      <Route path="/" component={KanbanBoard}>
        <Route path="new" component={NewCard} />
        <Route path="edit/:card_id" component={EditCard} />
      </Route>
    </Route>
  </Router>,
  document.getElementById('root'),
);
