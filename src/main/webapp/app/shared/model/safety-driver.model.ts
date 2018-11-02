import { IUser } from 'app/core/user/user.model';
import { ICarLicence } from 'app/shared/model//car-licence.model';

export interface ISafetyDriver {
    id?: number;
    login?: string;
    user?: IUser;
    licences?: ICarLicence[];
}

export class SafetyDriver implements ISafetyDriver {
    constructor(public id?: number, public login?: string, public user?: IUser, public licences?: ICarLicence[]) {}
}
