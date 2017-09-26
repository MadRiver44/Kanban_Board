import React, {Component} from 'react';
import PropTypes from 'prop-types';
import CardForm from './CardForm.js';

class EditCard extends Component {
  componentWillMount() {
    let card = this.props.cards.find(card => card.id === this.props.params.card_id);
    this.setState({...card});
  }

  handleCahnge(field, value) {
    this.setState({[field]: value});
  }

  handleSubmit(event) {
    event.preventDefault();
    this.props.cardCallbacks.update(this.state);
    this.props.history.pushState(null, '/');
  }

  handleClose(event) {
    this.props.history.pushState(null, '/');
  }

  render() {
    return (
      <CardForm
        draftCard={this.state}
        buttonLabel="Edit Card"
        handleCahnge={this.handleChange.bind(this)}
        handleSubmit={this.handleSubmit.bind(this)}
        handleClose={this.handleClose.bind(this)}
      />
    );
  }
}

EditCard.propTypes = {
  cardCallbacks: PropTypes.object,
};

export default EditCard;
