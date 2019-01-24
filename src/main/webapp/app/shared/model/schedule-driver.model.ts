export interface IScheduleDriver {
    driverId?: number;
    lastName?: string;
    firstName?: string;
    fullName?: string;
    color?: string;
}

export class ScheduleDriver implements IScheduleDriver {
    constructor(
        public driverId?: number,
        public lastName?: string,
        public firstName?: string,
        public fullName?: string,
        public color?: string
    ) {}
}
