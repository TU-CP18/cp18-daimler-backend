const path = require('path');
const fs = require('fs');
const axios = require('axios').default;
const { from, interval, merge }  = require('rxjs');
const op = require('rxjs/operators');

function readFakeRoute(gpsCsvFile) {
    const lines = fs.readFileSync(path.join(__dirname, 'fake-routes', gpsCsvFile)).toString();
    return lines
        .split('\n').map(l => l.trim().split(','))
        .map(([lat, long, heading]) => ({ lat: parseFloat(lat), long: parseFloat(long), heading: parseFloat(heading) }));
}

const fakeRoute1 = readFakeRoute('route1.csv')
const fakeRoute2 = readFakeRoute('route2.csv')
const fakeRoute3 = readFakeRoute('route3.csv')

const carSimulator = (carLicense, coordinates) => {
    const coordinates$ = from(coordinates);
    return interval(1000).pipe(
        op.zip(coordinates$),
        op.map(([_, coordinate]) => ({ ...coordinate, carLicense, timestamp: new Date().toISOString() }))
    );
}

merge(
    carSimulator('A', fakeRoute1),
    carSimulator('B', fakeRoute2).pipe(op.delay(250)),
    carSimulator('C', fakeRoute3).pipe(op.delay(500)),
).subscribe(async carStatus => {
    try {
        await axios.post('http://localhost:8000/api/log', carStatus);
    } catch (e) { }
});
