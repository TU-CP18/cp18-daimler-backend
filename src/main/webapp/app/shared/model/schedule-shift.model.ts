export interface IScheduleShift {
    Id?: number;
    VehicleId?: string;
    VehicleModel?: string;
    StartTime?: Date;
    EndTime?: Date;
    DriverId?: number;
    LongStart?: number;
    LatStart?: number;
}

export class ScheduleShift implements IScheduleShift {
    constructor(
        public id?: number,
        public VehicleId?: string,
        public VehicleModel?: string,
        public StartTime?: Date,
        public EndTime?: Date,
        public DriverId?: number,
        public LongStart?: number,
        public LatStart?: number
    ) {}
}
