import { ICarIssue } from 'app/shared/model//car-issue.model';
import { ICarLicence } from 'app/shared/model//car-licence.model';

export const enum CARSTATUS {
    DRIVING_EMPTY = 'DRIVING_EMPTY',
    DRIVING_FULL = 'DRIVING_FULL',
    MAINTENANCE = 'MAINTENANCE',
    AVAILABLE = 'AVAILABLE',
    INACTIVE = 'INACTIVE'
}

export interface ICar {
    id?: number;
    model?: string;
    status?: CARSTATUS;
    issues?: ICarIssue[];
    licence?: ICarLicence;
}

export class Car implements ICar {
    constructor(
        public id?: number,
        public model?: string,
        public status?: CARSTATUS,
        public issues?: ICarIssue[],
        public licence?: ICarLicence
    ) {}
}
