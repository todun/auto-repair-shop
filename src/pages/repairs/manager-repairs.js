import React, { Component } from 'react';
import PropTypes from 'prop-types';

import firebase from '../../firebase';
import RepairList from '../../components/repair-list';

import { hourRange } from '../../moment';

const mapBlockedTimes = repair => ({
  key: repair.key,
  range: hourRange(repair)
});

class ManagerRepairs extends Component {
  static propTypes = {
    currentUser: PropTypes.object.isRequired,
  }

  state = {
    repairs: [],
  }

  componentWillMount() {
    const repairsRef = firebase.database().ref('/repairs');
    this.setState({ repairsRef });

    repairsRef.on('value', this.updateRepairs);
  }

  componentWillUnmount() {
    this.state.repairsRef.off('value', this.updateRepairs);
  }

  updateRepairs = snapshot => {
    const repairHash = snapshot.val() || {};
    const repairs = [];

    for (let key of Object.keys(repairHash)) {
      repairs.push({ ...repairHash[key], key });
    }

    this.setState({ repairs });
  }

  render() {
    return (
      <RepairList
        {...this.props}
        repairs={this.state.repairs}
        blockedTimes={this.state.repairs.map(mapBlockedTimes)}
      />
    );
  }
}

export default ManagerRepairs;
