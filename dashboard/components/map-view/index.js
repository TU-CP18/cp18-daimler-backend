import React from 'react';
import Map from 'pigeon-maps';
import Overlay from 'pigeon-overlay';

import styles from './map-view.module.scss';

export default class MapView extends React.Component {
    static defaultProps = {
        cars: [],
    };

    render() {
        return (
            <div className={styles.mapView}>
                <Map center={[52.5126276, 13.3218814]} zoom={15} width={1000} height={800}>
                    {this.props.cars.map(c => (
                        <Overlay key={c.carLicense} anchor={[c.lat, c.long]} offset={[0, 0]}>
                            <svg width={25} height={25}>
                                <rect x={0} y={0} width={25} height={25} />
                                <text x={7.5} y={17.5} fill="#fefefe">{c.carLicense}</text>
                            </svg>
                        </Overlay>
                    ))}
                </Map>
            </div>
        )
    }
}
