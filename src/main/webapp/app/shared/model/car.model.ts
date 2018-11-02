import { ICarLicence } from 'app/shared/model//car-licence.model';

export const enum CARSTATUS {
    DRIVING_EMPTY = 'DRIVING_EMPTY',
    DRIVING_FULL = 'DRIVING_FULL',
    MAINTENANCE = 'MAINTENANCE',
    AVAILABLE = 'AVAILABLE'
}

export interface ICar {
    id?: number;
    model?: string;
    status?: CARSTATUS;
    licnece?: ICarLicence;
}

export class Car implements ICar {
    constructor(public id?: number, public model?: string, public status?: CARSTATUS, public licnece?: ICarLicence) {}
}
