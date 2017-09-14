import React from 'react';
import { render } from 'react-dom';
import KanbanBoard from './KanbanBoard.js';

// hard coded data model
let cardsList = [
{
  id: 1,
  title: "Read the manual!!",
  description: "I should read everything.",
  status: "in-progress",
  tasks: []
},
{
  id: 2,
  title: "Write some code.",
  description: "practice, practice, practice!",
  status: "todo",
  tasks: [
    {
      id: 1,
      name: "create more react projects.",
      done: true,
    },
    {
      id: 2,
      name: "kanban Board",
      done: false
    },
    {id: 3,
     name: "My education",
     done: false
   }
   ]
  }
];

render(<KanbanBoard cards={cardsList} />, document.getElementById('root'));
