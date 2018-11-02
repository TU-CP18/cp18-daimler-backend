import { ICarLicence } from 'app/shared/model//car-licence.model';

export interface ICar {
    id?: number;
    model?: string;
    licnece?: ICarLicence;
}

export class Car implements ICar {
    constructor(public id?: number, public model?: string, public licnece?: ICarLicence) {}
}
