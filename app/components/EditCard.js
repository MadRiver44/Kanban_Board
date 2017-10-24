import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getCard } from '../reducers';
import CardForm from './CardForm.js';
import CardActionCreators from '../actions/CardActionCreators';

class EditCard extends Component {
  componentDidMount() {
    this.props.createDraft(this.props.card);
  }

  handleChange(field, value) {
    this.props.updateDraft(field, value);
  }

  handleSubmit(event) {
    event.preventDefault();
    this.props.updateCard(this.props.card, this.props.draft);
    console.log(this.props.card, this.props.draft);
    this.props.history.pushState(null, '/');
  }

  handleClose(event) {
    this.props.history.pushState(null, '/');
  }

  render() {
    return (
      <CardForm
        draftCard={this.props.draft}
        buttonLabel="Edit Card"
        handleChange={this.handleChange.bind(this)}
        handleSubmit={this.handleSubmit.bind(this)}
        handleClose={this.handleClose.bind(this)}
      />
    );
  }
}

EditCard.propTypes = {
  card: PropTypes.object,
  draft: PropTypes.object,
  createDraft: PropTypes.func.isRequired,
  updateDraft: PropTypes.func.isRequired,
  updateCard: PropTypes.func.isRequired,
};

const mapStateToProps = (state, ownProps) => ({
  draft: state.cardDraft,
  card: getCard(state, ownProps.params.card_id),
});

const mapDispatchToProps = dispatch => ({
  createDraft: card => dispatch(CardActionCreators.createDraft(card)),
  updateDraft: (field, value) => dispatch(CardActionCreators.updateDraft(field, value)),
  updateCard: (card, draft) => dispatch(CardActionCreators.updateCard(card, draft)),
});

export default connect(mapStateToProps, mapDispatchToProps)(EditCard);
