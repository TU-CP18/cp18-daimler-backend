import { ScheduleShift } from 'app/shared/model/schedule-shift.model';

/**
 * Schedule datasource
 */

export let newShifts: ScheduleShift[] = [
    new ScheduleShift(1, 1, 'URBANETIC', new Date(2019, 1, 14, 8, 0), new Date(2019, 1, 14, 12, 0), 1, 52, 54)
];

export let oldShifts: Object[] = [
    {
        id: 1,
        vehicleId: 'Vehicle 1',
        description: 'A Klasse',
        startTime: new Date(2018, 7, 1, 9, 0),
        endTime: new Date(2018, 7, 1, 13, 0),
        driverId: 1
    },
    {
        id: 2,
        vehicleId: 'Vehicle 2',
        description: 'B Klasse',
        startTime: new Date(2018, 7, 1, 9, 0),
        endTime: new Date(2018, 7, 1, 13, 0),
        driverId: 2
    },
    {
        id: 3,
        vehicleId: 'Vehicle 3',
        description: 'C Klasse',
        startTime: new Date(2018, 7, 1, 9, 0),
        endTime: new Date(2018, 7, 1, 13, 0),
        driverId: 3
    },
    {
        id: 4,
        vehicleId: 'Vehicle 1',
        description: 'D Klasse',
        startTime: new Date(2018, 7, 1, 13, 0),
        endTime: new Date(2018, 7, 1, 17, 0),
        driverId: 4
    },
    {
        id: 5,
        vehicleId: 'Vehicle 5',
        description: 'E Klasse',
        startTime: new Date(2018, 7, 1, 10, 0),
        endTime: new Date(2018, 7, 1, 14, 0),
        driverId: 5
    },
    {
        id: 6,
        vehicleId: 'Vehicle 2',
        description: 'B Klasse',
        startTime: new Date(2018, 7, 1, 13, 0),
        endTime: new Date(2018, 7, 1, 17, 0),
        driverId: 6
    },
    {
        id: 7,
        vehicleId: 'Vehicle 5',
        description: 'E Klasse',
        startTime: new Date(2018, 7, 1, 14, 0),
        endTime: new Date(2018, 7, 1, 18, 0),
        driverId: 1
    },
    {
        id: 8,
        vehicleId: 'Vehicle 3',
        description: 'C Klasse',
        startTime: new Date(2018, 7, 1, 13, 0),
        endTime: new Date(2018, 7, 1, 17, 0),
        driverId: 7
    },
    {
        id: 9,
        vehicleId: 'Vehicle 4',
        description: 'D Klasse',
        startTime: new Date(2018, 7, 1, 11, 0),
        endTime: new Date(2018, 7, 1, 15, 0),
        driverId: 8
    },
    {
        id: 10,
        vehicleId: 'Vehicle 6',
        description: 'A Klasse',
        startTime: new Date(2018, 7, 1, 9, 0),
        endTime: new Date(2018, 7, 1, 13, 0),
        driverId: 9
    }
];
