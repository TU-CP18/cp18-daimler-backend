import { ICar } from 'app/shared/model//car.model';

export const enum CARISSUESTATUS {
    OPEN = 'OPEN',
    CLOSED = 'CLOSED'
}

export interface ICarIssue {
    id?: number;
    description?: string;
    part?: string;
    posX?: number;
    posY?: number;
    status?: CARISSUESTATUS;
    car?: ICar;
}

export class CarIssue implements ICarIssue {
    constructor(
        public id?: number,
        public description?: string,
        public part?: string,
        public posX?: number,
        public posY?: number,
        public status?: CARISSUESTATUS,
        public car?: ICar
    ) {}
}
