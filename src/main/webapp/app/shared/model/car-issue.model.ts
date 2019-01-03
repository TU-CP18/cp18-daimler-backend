import { ICar } from 'app/shared/model//car.model';

export interface ICarIssue {
    id?: number;
    description?: string;
    part?: string;
    posX?: number;
    posY?: number;
    car?: ICar;
}

export class CarIssue implements ICarIssue {
    constructor(
        public id?: number,
        public description?: string,
        public part?: string,
        public posX?: number,
        public posY?: number,
        public car?: ICar
    ) {}
}
