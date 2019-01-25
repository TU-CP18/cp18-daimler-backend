export interface IScheduleShift {
    id?: number;
    vehicleId?: number;
    description?: string;
    startTime?: Date;
    endTime?: Date;
    driverId?: number;
}

export class ScheduleShift implements IScheduleShift {
    constructor(
        public id?: number,
        public vehicleId?: number,
        public description?: string,
        public startTime?: Date,
        public endTime?: Date,
        public driverId?: number
    ) {}
}
