import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import TaskActionCreators from '../actions/TaskActionCreators';

class CheckList extends Component {
  checkInputKeyPress(event) {
    if (event.key === 'Enter') {
      let newTask = { id: Date.now(), name: event.target.value, done: false };
      this.props.addTask(this.props.cardId, newTask);
      event.target.value = '';
    }
  }
  render() {
    let tasks = this.props.tasks.map((task, taskIndex) => (
      <li key={task.id} className="checklist_task">
        <input
          type="checkbox"
          checked={task.done}
          onChange={this.props.toggleTask.bind(null, this.props.cardId, task, taskIndex)}
        />
        {task.name}{' '}
        <a
          href="#"
          className="checklist_task--remove"
          onClick={this.props.deleteTask.bind(null, this.props.cardId, task, taskIndex)}
        />
      </li>
    ));
    return (
      <div className="checklist">
        <ul>{tasks}</ul>
        {/* uncontrolled component*/}
        <input
          type="text"
          className="checkList--add-task"
          placeholder="Type, then hit enter to add a task"
          onKeyPress={this.checkInputKeyPress.bind(this)}
        />
      </div>
    );
  }
}

CheckList.propTypes = {
  cardId: PropTypes.number,
  tasks: PropTypes.array(PropTypes.object),
  addTask: PropTypes.func.isRequired,
  toggleTask: PropTypes.func.isRequired,
  deleteTask: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({});

const mapDispatchToProps = dispatch => ({
  addTask: (cardId, newTask) => dispatch(TaskActionCreators.addTask(cardId, newTask)),
  toggleTask: (cardId, task, taskIndex) =>
    dispatch(TaskActionCreators.toggleTask(cardId, task, newTask)),
  deleteTask: (cardId, task, taskIndex) =>
    dispatch(TaskActionCreators.deleteTask(cardId, task, taskIndex)),
});

export default cinnect(mapStateToProps, mapDispatchToProps)(CheckList);
