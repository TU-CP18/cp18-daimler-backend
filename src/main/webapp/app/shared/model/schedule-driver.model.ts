import { IUser } from 'app/core/user/user.model';
import { ICarLicence } from 'app/shared/model//car-licence.model';

export interface IScheduleDriver {
    id?: number;
    lastName?: string;
    firstName?: string;
    fullName?: string;
    color?: string;
}

export class ScheduleDriver implements IScheduleDriver {
    constructor(public id?: number, public lastName?: string, public firstName?: string, public fullName?: string, public color?: string) {}
}
