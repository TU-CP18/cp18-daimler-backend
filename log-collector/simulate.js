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
        .map(([lat, long, heading]) => ({ lat: parseFloat(lat), long: parseFloat(long), heading: parseFloat(heading) }))
        .filter(({ lat, long }) => !isNaN(lat) && !isNaN(long))
}

const fakeRoute1 = readFakeRoute('route1.csv')
const fakeRoute2 = readFakeRoute('route2.csv')
const fakeRoute3 = readFakeRoute('route3.csv')
const fakeRoute4 = readFakeRoute('route4.csv')
const fakeRoute5 = readFakeRoute('route5.csv')
const fakeRoute6 = readFakeRoute('route6.csv')
const fakeRoute7 = readFakeRoute('route7.csv')
const fakeRoute8 = readFakeRoute('route8.csv')
const fakeRoute9 = readFakeRoute('route9.csv')
const fakeRoute10 = readFakeRoute('route10.csv')

const emergencyFakeRoute1 = readFakeRoute('eroute1.csv');

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
    const filteredCoords = coordinates.filter(c => c);
    const coordinates$ = Observable.from(R.dropLast(1, filteredCoords));
    const coordinatesE$ = Observable.from(R.takeLast(1, filteredCoords));
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
        .concat(
            coordinatesE$.map((coordinate) => ({
                vehicleId,
                timestamp: new Date().toISOString(),
                source: 'VEHICLE',
                type: 'ESTOP',
                location: [coordinate.lat, coordinate.long],
            }))
        )
}

Observable.merge(
    carSimulator('A', fakeRoute1),
    carSimulator('B', fakeRoute2).delay(250),
    carSimulator('C', fakeRoute3).delay(500),
    carSimulator('D', fakeRoute4).delay(750),
    carSimulator('E', fakeRoute5).delay(1000),
    carSimulator('F', fakeRoute6).delay(1250),
    carSimulator('G', fakeRoute7).delay(1250),
    carSimulator('H', fakeRoute8).delay(1500),
    carSimulator('I', fakeRoute9).delay(1750),
    carSimulator('J', fakeRoute10).delay(2000),
    carEmergencySimulator('X', emergencyFakeRoute1),
).subscribe(async log => {
    try {
        await axios.post(`http://${HOST}/api/log`, log);
        console.log('-> ', log);
    } catch (e) {
        console.log('---> error posting log: ');
        console.dir(e);
    }
});
