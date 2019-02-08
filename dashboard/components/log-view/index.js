import React from 'react';
import moment from 'moment';

import styles from './log-view.module.scss';

export default class LogView extends React.Component {

  handleLogItemSelect = (id) => () => {
    this.props.onLogItemSelect(id);
  }

  renderMessage = (l) => {
    return <span><span>{l.type}</span>&nbsp; Car: <strong>{l.vehicleId}</strong>&nbsp;</span>
  }

  renderLog = (l) => {
    return (
      <div key={l.id} className={styles.log} onClick={this.handleLogItemSelect(l.id)}>
        <div className={styles.time}>{moment(l.timestamp).format('hh:mm A')}</div>
        <div className={styles.message}>{this.renderMessage(l)}</div>
      </div>
    )
  }

  render() {
    return (
      <div className={styles.logView}>
        <div className={styles.title}>{this.props.title}</div>
        <div className={styles.inner}>
          {this.props.logs.map(l => this.renderLog(l))}
        </div>
      </div>
    );
  }
}
