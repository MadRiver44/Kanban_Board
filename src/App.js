import React from 'react';
import { render } from 'react-dom';
import { Router, Route } from 'react-router';
import { Provider } from 'react-redux';
import createBrowserHistory from 'history/lib/createBrowserHistory';
import KanbanAppContainer from './KanbanAppContainer';
import KanbanBoard from './KanbanBoard.js';
import EditCard from './EditCard.js';
import NewCard from './NewCard.js';

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
