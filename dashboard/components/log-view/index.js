import React from 'react';
import moment from 'moment';

import styles from './log-view.module.scss';

export default class LogView extends React.Component {

  renderMessage = (l) => {
    switch(l.type) {
      case 'NAV_START':
      case 'NAV_POSITION': return <span><span>{l.type}</span>&nbsp; Car: <strong>{l.license || l.carId}</strong>&nbsp;</span>
    }
  }

  renderLog = (l) => {
    return (
      <div key={l.id} className={styles.log}>
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
