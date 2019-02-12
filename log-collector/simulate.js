const R = require('ramda');
const path = require('path');
const fs = require('fs');
const axios = require('axios').default;
const { Observable } = require('@reactivex/rxjs');

const HOST = process.env.HOST || 'localhost:8080';

function readFakeRoute(gpsCsvFile) {
    const lines = fs.readFileSync(path.join(__dirname, 'fake-routes', gpsCsvFile)).toString();
    return lines
        .split('\n').map(l => l.trim().split(','))
        .map(([lat, long, heading]) => ({ lat: parseFloat(lat), long: parseFloat(long), heading: parseFloat(heading) }));
}

const fakeRoute1 = readFakeRoute('route1.csv')
const fakeRoute2 = readFakeRoute('route2.csv')
const fakeRoute3 = readFakeRoute('route3.csv')

const carSimulator = (vehicleId, coordinates) => {
    const coordinates$ = Observable.from(coordinates);
    return Observable.interval(2500)
        .zip(coordinates$)
        .map(([_, coordinate]) => ({
            vehicleId,
            timestamp: new Date().toISOString(),
            source: 'VEHICLE',
            type: 'NAV_POSITION',
            location: [coordinate.lat, coordinate.long],
        }))
}

const carEmergencySimulator = (vehicleId, coordinates) => {
    const coordinates$ = Observable.from(coordinates);
    return Observable
        .interval(2500)
        .zip(coordinates$)
        .map(([_, coordinate]) => ({
            vehicleId,
            timestamp: new Date().toISOString(),
            source: 'VEHICLE',
            type: 'NAV_POSITION',
            location: [coordinate.lat, coordinate.long],
        }))
}

Observable.merge(
    carSimulator('A', fakeRoute1),
    carSimulator('B', fakeRoute2).delay(250),
    carSimulator('C', fakeRoute3).delay(500),
).subscribe(async log => {
    try {
        await axios.post(`http://${HOST}/api/log`, log);
        console.log('-');
    } catch (e) {
        console.log('---> error posting log: ');
        console.dir(e);
    }
});
