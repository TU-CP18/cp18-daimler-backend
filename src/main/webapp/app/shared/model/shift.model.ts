import { ICar } from 'app/shared/model//car.model';
import { ISafetyDriver } from 'app/shared/model//safety-driver.model';

export interface IShift {
    id?: number;
    start?: number;
    end?: number;
    car?: ICar;
    safetyDriver?: ISafetyDriver;
}

export class Shift implements IShift {
    constructor(public id?: number, public start?: number, public end?: number, public car?: ICar, public safetyDriver?: ISafetyDriver) {}
}
