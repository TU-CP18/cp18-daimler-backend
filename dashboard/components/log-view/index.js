import React from 'react';

import styles from './log-view.module.scss';

export default class LogView extends React.Component {

  renderLog = (l) => {
    return (
      <div className={styles.log}>
        <div className={styles.time}>10:42:AM</div>
        <div className={styles.message}>This is my message</div>
      </div>
    )
  }

  render() {
    const logs = [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}];

    return (
      <div className={styles.logView}>
        <div className={styles.title}>{this.props.title}</div>
        <div className={styles.inner}>
          {logs.map(l => this.renderLog(l))}
        </div>
      </div>
    );
  }
}
