const path = require('path');
const fs = require('fs');
const axios = require('axios').default;
const { from, interval, merge }  = require('rxjs');
const op = require('rxjs/operators');

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

const carSimulator = (license, coordinates) => {
    const coordinates$ = from(coordinates);
    return interval(2500).pipe(
        op.zip(coordinates$),
        op.map(([_, coordinate]) => ({
            timestamp: new Date().toISOString(),
            source: 'VEHICLE',
            type: 'NAV_POSITION',
            location: [coordinate.lat, coordinate.long],
            license,
        }))
    );
}

merge(
    carSimulator('A', fakeRoute1),
    carSimulator('B', fakeRoute2).pipe(op.delay(250)),
    carSimulator('C', fakeRoute3).pipe(op.delay(500)),
).subscribe(async log => {
    try {
        await axios.post(`http://${HOST}/api/log`, log);
        console.log('--> ')
    } catch (e) {
        console.log('---> error posting log: ');
        console.dir(e);
    }
});
