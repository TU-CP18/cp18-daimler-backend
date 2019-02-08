import { Moment } from 'moment';
import { ICar } from 'app/shared/model//car.model';
import { IShift } from 'app/shared/model//shift.model';

export interface ICarCleanliness {
    id?: number;
    rating?: number;
    event?: string;
    part?: string;
    createdAt?: Moment;
    car?: ICar;
    shift?: IShift;
}

export class CarCleanliness implements ICarCleanliness {
    constructor(
        public id?: number,
        public rating?: number,
        public event?: string,
        public part?: string,
        public createdAt?: Moment,
        public car?: ICar,
        public shift?: IShift
    ) {}
}
