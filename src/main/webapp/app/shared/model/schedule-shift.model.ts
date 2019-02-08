export interface IScheduleShift {
    id?: number;
    vehicleId?: number;
    vehicleModel?: string;
    startTime?: Date;
    endTime?: Date;
    driverId?: number;
    longStart?: number;
    latStart?: number;
}

export class ScheduleShift implements IScheduleShift {
    constructor(
        public id?: number,
        public vehicleId?: number,
        public vehicleModel?: string,
        public startTime?: Date,
        public endTime?: Date,
        public driverId?: number,
        public longStart?: number,
        public latStart?: number
    ) {}
}
