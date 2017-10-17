import React from 'react';
import { render } from 'react-dom';
import { Router, Route } from 'react-router';
import { Provider } from 'react-redux';
import createBrowserHistory from 'history/lib/createBrowserHistory';
import kanbanStore from './store/kanbanStore';
import KanbanBoard from './components/KanbanBoard.js';
import EditCard from './components/EditCard.js';
import NewCard from './components/NewCard.js';

// hard coded data model
/*
let cardsList = [
  {
    id: 1,
    title: 'Read the manual!!',
    description: 'I should read **everything**.',
    color: '#BD8D31',
    status: 'in-progress',
    tasks: [],
  },
  {
    id: 2,
    title: 'Write some code.',
    description: 'practice, practice, practice!',
    color: '#3A7E28',
    status: 'todo',
    tasks: [
      {
        id: 1,
        name: 'create more react projects.',
        done: true,
      },
      {
        id: 2,
        name: 'kanban Board',
        done: false,
      },
      {
        id: 3,
        name: 'My education',
        done: false,
      },
    ],
  },
]
*/

  <Router history={createBrowserHistory()}>
    <Route component={KanbanBoardContainer}>
      <Route path="/" component={KanbanBoard}>
        <Route path="new" component={NewCard} />
        <Route path="edit/:card_id" component={EditCard} />
      </Route>
    </Route>
  </Router>
), document.getElementById('root'));
