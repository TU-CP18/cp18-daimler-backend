import * as R from 'ramda';
import React from 'react';
import Map from 'pigeon-maps';
import Overlay from 'pigeon-overlay';
import Measure from 'react-measure';

import styles from './map-view.module.scss';

export default class MapView extends React.Component {
  static defaultProps = {
    cars: []
  };

  state = {
    dimensions: { width: -1, height: -1 },
  }

  isCarInEmergency = (license) => {
    return R.findIndex(
      c => c.license === license,
      this.props.emergencyEvents
    ) >= 0;
  }

  render() {
    return (
      <Measure
        bounds
        onResize={contentRect => { this.setState({ dimensions: contentRect.bounds }) }}
      >
        {({ measureRef }) => (
          <div ref={measureRef} className={styles.mapView}>
            <Map center={[52.5126276, 13.3218814]} zoom={15} width={this.state.dimensions.width} height={this.state.dimensions.height}>
              {this.props.cars.map(c => (
                <Overlay key={c.carLicense || c.license || c.carId} anchor={c.location} offset={[0, 0]}>
                  <svg width={25} height={25}>
                    <rect x={0} y={0} width={25} height={25} fill={this.isCarInEmergency(c.license) ? '#f00' : '#000'} />
                    <text x={7.5} y={17.5} fill="#fefefe">
                      { c.carLicense || c.license || c.carId }
                    </text>
                  </svg>
                </Overlay>
              ))}
            </Map>
          </div>
        )}
      </Measure>
    );
  }
}
