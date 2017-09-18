import React, { Component } from 'react';

class CheckList extends Component {
  render() {
    let tasks = this.props.tasks.map((task) => (
      <li key={task.id} className="checklist_task">
        <input type="checkbox" defaultChecked={task.done} />
        {task.name}
        <a href="#" className="checklist_task--remove"></a>
      </li>
      ));
    return (
        <div className="checklist">
          <ul>{tasks}</ul>
        {/* uncontrolled component*/}
          <input type="text"
                 className="checkList--add-task"
                 placeholder="Type then hit enter to add a task"/>
        </div>
      );
    }
  }

  export default CheckList;
