import React, { Component } from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import PropTypes from 'prop-types';
import CheckList from './CheckList.js';
import { DragSource } from 'react-dnd';
import constants from './constants.js';
import marked from 'marked'; //library to render markdown https://github.com.chjj/marked

// Custom validator
let titlePropType = (props, propName, componentName) => {
  if (props[propName]) {
    let value = props[propName];
    if (typeof value !== 'string' || value.length > 80) {
      return new Error(
        `${propName} in ${componentName} is longer than 80 characters`,
      );
    }
  }
};

// Drag and Drop Spec ---  "A plain object implementing the drop target spec"

//  -DropTarget Methods (All Optional)
//  -drop: Called when a compatible item is dropped
//  -hover: Called when an item is hoveered over the component
//  -canDrop: Use it to specify wheter the drop target is able to accept the item

//  -beginDrag (Required)
//  -endDrag (Optional)
//  -canDrag (Optional)
//  -isDragging (Optional)

const cardDragSpec = {
  beginDrag(props) {
    return {
      id: props.id,
    };
  },
};

// DragSource collect collecting function
// -connect: An instance of the DropTargetConnector.
//           You use it to assign the drop target role to a DOM node
// -monitor: An instance of DropTargetMonitor
//           You use it to connect state form ReactDND to props.
//           Available functions to get state include canDrop(), isOver(), and didDrop()

let collectDrag = (connect, monitor) => {
  return {
    connectDragSource: connect.dragSource(),
  };
};

class Card extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      showDetails: false,
    };
  }
  toggleDetails() {
    this.setState({ showDetails: !this.state.showDetails });
  }
  // conditional render
  render() {
    const { connectDragSource } = this.props;
    let cardDetails;
    {
      /* inline style*/
    }
    let sideColor = {
      position: 'absolute',
      zIndex: -1,
      top: 0,
      bottom: 0,
      left: 0,
      width: 7,
      backgroundColor: this.props.color,
    };

    if (this.state.showDetails) {
      cardDetails = (
        <div className="card_details">
          {/* pass jsx expression into marked(), use dangerouslySetInnerHTML to render html in JSX*/}
          <span
            dangerouslySetInnerHTML={{ __html: marked(this.props.description) }}
          />
          <CheckList
            cardId={this.props.id}
            tasks={this.props.tasks}
            taskCallbacks={this.props.taskCallbacks}
          />
        </div>
      );
    }
    return connectDragSource(
      <div className="card">
        <div style={sideColor} />
        <div
          className={
            this.state.showDetails
              ? 'card_title card_title--is-open'
              : 'card_title'
          }
          onClick={this.toggleDetails.bind(this)}>
          {this.props.title}
        </div>
        <ReactCSSTransitionGroup
          transitionName="toggle"
          transitionEnterTimeout={250}
          transitionLeaveTimeout={250}>
          {cardDetails}
        </ReactCSSTransitionGroup>
      </div>
    );
  }
}

Card.propTypes = {
  id: PropTypes.number,
  title: titlePropType,
  description: PropTypes.string,
  color: PropTypes.string,
  tasks: PropTypes.arrayOf(PropTypes.object),
  taskCallbacks: PropTypes.object,
  cardCallback: PropTypes.object
  connectDragSource: PropTypes.func.isRequired
};

export default Card(constants.CARD, cardDragSpec, collectDrag)(Card);
