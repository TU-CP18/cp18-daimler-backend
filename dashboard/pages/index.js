import React from 'react';
import { Layout, message } from 'antd';
import axios from 'axios';

import styles from './index.module.scss';

import MapView from '../components/map-view';
import LogView from '../components/log-view';

const { Content } = Layout;

export default class Index extends React.Component {
  state = {
    cars: [],
    logs: [],
    emergencyEvents: [],
    selectedCar: null,
  };

  refreshLogs = async () => {
    try {
      const response = await this.http.get('/logs');
      this.setState({ logs: response.data });
    } catch (e) { }
  }

  refreshCars = async () => {
    try {
      const response = await this.http.get('/cars');
      this.setState({ cars: response.data });
    } catch (e) { }
  }

  getEmergencyEvents = async () => {
    try {
      if (this.state.emergencyEvents.length === 0) {
        message.error('Car A Emergency STOP!', 10 * 1000);
      }
      this.setState({ emergencyEvents: [{ message: 'Car A Emergency STOP', license: 'A' }] });
    } catch (e) { }
  }

  handleCarSelect = (license) => {
    this.setState({ selectedCar: license });
  }

  componentDidMount() {
    if (typeof window !== 'undefined') {
      this.poller = setInterval(async () => {
        const HOSTNAME = window.location.hostname === 'localhost' ? 'localhost:8000' : 'log-collector.isecp.de'
        this.http = axios.create({ baseURL: `http://${HOSTNAME}/api/`});
        this.refreshLogs();
        this.refreshCars();
        this.getEmergencyEvents();
      }, 2500);
    }
  }

  componentWillUnmount() {
    clearInterval(this.poller);
  }

  render() {
    return (
      <Layout className={styles.layout}>
        <Content className={styles.content}>
          <div className={styles.mapContainer}>
            <MapView
              cars={this.state.cars}
              emergencyEvents={this.state.emergencyEvents}
              selectedCar={this.state.selectedCar}
              onCarSelect={this.handleCarSelect}
            />
          </div>
          <div className={styles.sidebarContainer}>
            <LogView
              title={this.state.selectedCar ? `Car ${this.state.selectedCar} Events` : 'Recent Events'}
              logs={this.state.logs}
              selectedCar={this.state.selectedCar}
            />
          </div>
        </Content>
      </Layout>
    );
  }
}
