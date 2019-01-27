import React from 'react';
import { Layout } from 'antd';
import axios from 'axios';

import styles from './index.module.css';

import MapView from '../components/map-view';

const { Content } = Layout;

export default class Index extends React.Component {
    state = {
        cars: [],
    };

    componentDidMount() {
        this.poller = setInterval(async () => {
            try {
                const carStatus = await axios.get('http://localhost:8000/api/car-status');
                this.setState({ cars: carStatus.data });
            } catch (e) { }
        }, 2500);
    }

    componentWillUnmount() {
        clearInterval(this.poller);
    }

    render() {
        return (
            <Layout>
                <Content>
                    <MapView cars={this.state.cars} />
                </Content>
            </Layout>
        );
    }
}
