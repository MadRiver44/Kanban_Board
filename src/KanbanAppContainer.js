import React, { Component } from 'react';
import update from 'react-addons-update';
import { throttle } from './utils.js';
import KanbanBoard from './KanbanBoard.js';
import 'whatwg-fetch';

const API_URL = 'http://kanbanapi.pro-react.com';
const API_HEADERS = {
  'Content-Type': 'application/json',
  Authorization: 'blah,blah,blah',
};

class KanbanAppContainer extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      cards: [],
    };
    // only call updateCardStatus when arguments change
    this.updateCardStatus = throttle(this.updateCardStatus.bind(this));
    // call updateCardPosition at max every 500ms or when arguments change
    this.updateCardPosition = throttle(this.updateCardPosition.bind(this), 500);
  }

  componentDidMount() {
    fetch(API_URL + '/cards', { headers: API_HEADERS })
      .then(response => response.json())
      .then(responseData => {
        this.setState({ cards: responseData });
      })
      .catch(error => {
        console.log('Error fetching and parsing data', error);
      });
  }

  addTask(cardId, taskName) {
    // keep a reference to original state prior to mutations
    // in case you t=need to revert the optimistic changes in UI
    let prevState = this.state;
    // find the index of the card
    let cardIndex = this.state.cards.findIndex(card => card.id === cardId);
    // create a new task with the given name and a temporary id
    let newTask = { id: Date.now(), name: taskName, done: false };
    // create a new object and push the new task to the array of tasks
    let nextState = update(this.state.cards, {
      [cardIndex]: {
        tasks: { $push: [newTask] },
      },
    });
    // set the component state to the mutated object
    this.setState({ cards: nextState });
    // call the API to add the task on the server
    fetch(`${API_URL}/cards/${cardId}/tasks`, {
      method: 'post',
      headers: API_HEADERS,
      body: JSON.stringify(newTask),
    })
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          // throw an error if server response wasn't ok
          // so optimistic rollbacks are possible
          throw new Error("Server response wasn't ok");
        }
      })
      .then(responseData => {
        // when server return the definitive id
        // used for the new task on the server, update it in React
        newTask.id = responseData.id;
        this.setState({ cards: nextState });
      })
      .catch(error => {
        this.setState(prevState);
      });
  }

  deleteTask(cardId, taskId, taskIndex) {
    // keep areference to original state prior to mutations
    let prevState = this.state;
    // find index of card
    let cardIndex = this.state.cards.findIndex(card => card.id === cardId);
    // create a new object without the task
    let nextState = update(this.state.cards, {
      [cardIndex]: {
        tasks: { $splice: [[taskIndex, 1]] },
      },
    });
    // set the component state to the mutated object
    this.setState({ cards: nextState });
    // call the api to remove the task on the server
    fetch(`${API_URL}/cards/${cardId}/tasks/${taskId}`, {
      method: 'delete',
      headers: API_HEADERS,
    })
      .then(response => {
        if (!response.ok) {
          // throw an error if the server respnse wasn't ok
          // to be able to rollback optimistic changes
          throw new Error("Server response wasn't ok");
        }
      })
      .catch(error => {
        console.error('Fetch error: ', error);
        this.setState(prevState);
      });
  }

  toggleTask(cardId, taskId, taskIndex) {
    // keep a reference to original state prior to mutation
    let prevState = this.state;
    // find the index of the card
    let cardIndex = this.state.cards.findIndex(card => card.id === cardId);
    // save a reference to the task's done value
    let newDoneValue;
    // using $apply command, change the value to the oppposite
    let nextState = update(this.state.cards, {
      [cardIndex]: {
        tasks: {
          [taskIndex]: {
            done: {
              $apply: done => {
                newDoneValue = !done;
                return newDoneValue;
              },
            },
          },
        },
      },
    });
    // set the component state to the mutated object
    this.setState({ cards: nextState });
    // call API  to toggle task on server
    fetch(`${API_URL}/cards/${cardId}/tasks/${taskId}`, {
      method: 'put',
      headers: API_HEADERS,
      body: JSON.stringify({ done: newDoneValue }),
    })
      .then(response => {
        if (!response.ok) {
          // throw an error if the server wasn't ok
          // to be able to rollback optimistic changes
          throw new Error("Server response wasn't ok");
        }
      })
      .catch(error => {
        console.error('Fetch error: ', error);
        this.setState(prevState);
      });
  }

  updateCardStatus(cardId, listId) {
    // find the indes of the card
    let cardIndex = this.state.cards.findIndex(card => card.id === cardId);
    // get current card
    let card = this.state.cards[cardIndex];
    // only proceed if hovering over a different list
    if (card.status !== listId) {
      // set the component state to the mutated object using immmutability helpers
      this.setState(
        update(this.state, {
          cards: {
            [cardIndex]: {
              status: { $set: listId },
            },
          },
        }),
      );
    }
  }

  updateCardPosition(cardId, afterId) {
    // only proceed if hovering over a different card
    if (cardId !== afterId) {
      // find the index of the card
      let cardIndex = this.state.cards.findIndex(card => card.id === cardId);
      // get current card
      let card = this.state.cards[cardIndex];
      // find the index of the card the user is hovering over
      let afterIndex = this.state.cards.findIndex(card => card.id === afterId);
      // use splice to remove the card and reinsert it at the new index
      this.setState(
        update(this.state, {
          cards: {
            $splice: [[cardIndex, 1], [afterIndex, 0, card]],
          },
        }),
      );
    }
  }

  persistCardDrag(cardId, status) {
    // find the index of the card
    let cardIndex = this.state.cards.findIndex(card => card.id === cardId);
    // get current card
    let card = this.state.cards[cardIndex];

    fetch(`${API_URL}/cards/${cardId}`, {
      method: 'put',
      headers: API_HEADERS,
      body: JSON.stringify({
        status: card.status,
        row_order_position: cardIndex,
      }),
    })
      .then(response => {
        if (!response.ok) {
          // throw an error and rollback optimistic changes to the UI
          throw new Error("Server response wasn't OK");
        }
      })
      .catch(error => {
        console.error('Fetch error', error);
        this.setState(
          update(this.state, {
            cards: {
              [cardIndex]: {
                status: { $set: status },
              },
            },
          }),
        );
      });
  }

  addCard(card) {
    // Keep a reference to the original state prior to the mutations
    // in case we need to revert the optimistic changes in the UI
    let prevState = this.state;

    // Add a temporary ID to the card
    if (card.id === null) {
      let card = Object.assign({}, card, { id: Date.now() });
    }

    // Create a new object and push the new card to the array of cards
    let nextState = update(this.state.cards, { $push: [card] });

    // set the component state to the mutated object
    this.setState({ cards: nextState });

    // Call the API to add the card on the server
    fetch(`${API_URL}/cards`, {
      method: 'post',
      headers: API_HEADERS,
      body: JSON.stringify(card),
    })
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          // Throw an error if server response wasn't 'ok'
          // so we can revert back the optimistic changes
          // made to the UI.
          throw new Error("Server response wasn't OK");
        }
      })
      .then(responseData => {
        // When the server returns the definitive ID
        // used for the new Card on the server, update it on React
        card.id = responseData.id;
        this.setState({ cards: nextState });
      })
      .catch(error => {
        this.setState(prevState);
      });
  }

  updateCard(card) {
    // keep a reference to original state prior to mutations
    let prevState = this.state;
    // find the index of the card
    let cardIndex = this.state.cards.findIndex(c => c.id === card.id);
    // using the $set command, we change the whole card
    let nextState = update(this.state.cards, { [cardIndex]: { $set: card } });
    // set component state to mutated object
    this.setState({ cards: nextState });
    // call the Api and update the card on the server
    fetch(`${API_URL}/cards/${card.id}`, {
      method: 'put',
      headers: API_HEADERS,
      body: JSON.stringify(card),
    })
      .then(response => {
        if (!response.ok) {
          // throw an error and revert back optimistic ui changes
          throw new Error("Server response wasn't ok");
        }
      })
      .catch(error => {
        console.error('Fetch error:', error);
        this.setState(prevState);
      });
  }

  render() {
    let kanbanBoard =
      this.props.children &&
      React.cloneElement(this.props.children, {
        cards: this.state.cards,
        taskCallbacks: {
          toggle: this.toggleTask.bind(this),
          delete: this.deleteTask.bind(this),
          add: this.addTask.bind(this),
        },
        cardCallbacks: {
          addCard: this.addCard.bind(this),
          updateCard: this.updateCard.bind(this),
          updateStatus: this.updateCardStatus.bind(this),
          updatePosition: throttle(this.updateCardPosition.bind(this), 500),
          persistCardDrag: this.persistCardDrag.bind(this),
        },
      });
    return kanbanBoard;
  }
}

export default KanbanAppContainer;
