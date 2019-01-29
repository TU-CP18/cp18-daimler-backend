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
        vehicleId: 1,
        vehicleModel: 'URBANETIC',
        startTime: new Date(2019, 1, 14, 9, 0),
        endTime: new Date(2019, 1, 14, 13, 0),
        driverId: 1,
        longStart: 54,
        latStart: 51
    },
    {
        id: 2,
        vehicleId: 2,
        vehicleModel: 'URBANETIC',
        startTime: new Date(2019, 1, 14, 9, 0),
        endTime: new Date(2019, 1, 14, 13, 0),
        driverId: 2
    },
    {
        id: 3,
        vehicleId: 3,
        vehicleModel: 'URBANETIC',
        startTime: new Date(2019, 1, 14, 9, 0),
        endTime: new Date(2019, 1, 14, 13, 0),
        driverId: 3
    },
    {
        id: 4,
        vehicleId: 1,
        vehicleModel: 'URBANETIC',
        startTime: new Date(2019, 1, 14, 13, 0),
        endTime: new Date(2019, 1, 14, 17, 0),
        driverId: 4
    },
    {
        id: 5,
        vehicleId: 5,
        vehicleModel: 'URBANETIC',
        startTime: new Date(2019, 1, 14, 10, 0),
        endTime: new Date(2019, 1, 14, 14, 0),
        driverId: 5
    },
    {
        id: 6,
        vehicleId: 2,
        vehicleModel: 'URBANETIC',
        startTime: new Date(2019, 1, 14, 13, 0),
        endTime: new Date(2019, 1, 14, 17, 0),
        driverId: 6
    },
    {
        id: 7,
        vehicleId: 5,
        vehicleModel: 'URBANETIC',
        startTime: new Date(2019, 1, 14, 14, 0),
        endTime: new Date(2019, 1, 14, 18, 0),
        driverId: 1
    },
    {
        id: 8,
        vehicleId: 3,
        vehicleModel: 'URBANETIC',
        startTime: new Date(2019, 1, 14, 13, 0),
        endTime: new Date(2019, 1, 14, 17, 0),
        driverId: 7
    },
    {
        id: 9,
        vehicleId: 4,
        vehicleModel: 'URBANETIC',
        startTime: new Date(2019, 1, 14, 11, 0),
        endTime: new Date(2019, 1, 14, 15, 0),
        driverId: 8
    },
    {
        id: 10,
        vehicleId: 6,
        vehicleModel: 'URBANETIC',
        startTime: new Date(2019, 1, 14, 9, 0),
        endTime: new Date(2019, 1, 14, 13, 0),
        driverId: 9
    }
];
