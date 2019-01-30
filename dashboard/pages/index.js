import React from 'react';
import { Layout } from 'antd';
import axios from 'axios';

import styles from './index.module.scss';

import MapView from '../components/map-view';
import LogView from '../components/log-view';

const { Content } = Layout;

export default class Index extends React.Component {
  state = {
    cars: [],
    logs: [],
  };

  componentDidMount() {
    // this.poller = setInterval(async () => {
    //   try {
    //     const carStatus = await axios.get('http://localhost:8000/api/car-status');
    //     this.setState({ cars: carStatus.data });
    //   } catch (e) { }
    // }, 2500);
  }

  componentWillUnmount() {
    // clearInterval(this.poller);
  }

  render() {
    return (
      <Layout className={styles.layout}>
        <Content className={styles.content}>
          <div className={styles.mapContainer}>
            <MapView cars={this.state.cars} />
          </div>
          <div className={styles.sidebarContainer}>
            <LogView title="Recent Events" logs={this.state.logs} />
          </div>
        </Content>
      </Layout>
    );
  }
}
