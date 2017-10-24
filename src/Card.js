import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import marked from 'marked'; //library to render markdown https://github.com.chjj/marked
import { DragSource, DropTarget } from 'react-dnd';
import constants from './constants';
import CheckList from './CheckList';
import { Link } from 'react-router';

// Custom validator
let titlePropType = (props, propName, componentName) => {
  if (props[propName]) {
    let value = props[propName];
    if (typeof value !== 'string' || value.length > 80) {
      return new Error(`${propName} in ${componentName} is longer than 80 characters`);
    }
  }
};

// Drag and Drop Spec ---  "A plain object implementing the drop target spec"

//  -DropTarget Methods (All Optional)
//  -drop: Called when a compatible item is dropped
//  -hover: Called when an item is hovered over the component
//  -canDrop: Use it to specify wheter the drop target is able to accept the item

//  -beginDrag (Required)
//  -endDrag (Optional)
//  -canDrag (Optional)
//  -isDragging (Optional)

const cardDragSpec = {
  beginDrag(props) {
    return {
      id: props.id,
      status: props.status,
    };
  },
  endDrag(props) {
    props.cardCallbacks.persistCardDrag(props.id, props.status);
  },
};

const cardDropSpec = {
  hover(props, monitor) {
    const draggedId = monitor.getItem().id;
    props.cardCallbacks.updatePosition(draggedId, props.id);
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

let collectDrop = (connect, monitor) => {
  return {
    connectDropTarget: connect.dropTarget(),
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
    const { connectDragSource, connectDropTarget } = this.props;
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
          <span dangerouslySetInnerHTML={{ __html: marked(this.props.description) }} />
          <CheckList
            cardId={this.props.id}
            tasks={this.props.tasks}
            taskCallbacks={this.props.taskCallbacks}
          />
        </div>
      );
    }
    return connectDropTarget(
      connectDragSource(
        <div className="card">
          <div style={sideColor} />
          <div className="card_edit">
            <Link to={'/edit/' + this.props.id}>✎</Link>
          </div>
          <div
            className={this.state.showDetails ? 'card_title card_title--is-open' : 'card_title'}
            onClick={this.toggleDetails.bind(this)}>
            {this.props.title}
          </div>
          <ReactCSSTransitionGroup
            transitionName="toggle"
            transitionEnterTimeout={250}
            transitionLeaveTimeout={250}>
            {cardDetails}
          </ReactCSSTransitionGroup>
        </div>,
      ),
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
  cardCallback: PropTypes.object,
  connectDragSource: PropTypes.func.isRequired,
  connectDropTarget: PropTypes.func.isRequired,
};

const dragHigherOrderCard = DragSource(constants.CARD, cardDragSpec, collectDrag)(Card);
const dragDropHigherOrderCard = DropTarget(constants.CARD, cardDropSpec, collectDrop)(
  dragHigherOrderCard,
);

export default dragDropHigherOrderCard;
