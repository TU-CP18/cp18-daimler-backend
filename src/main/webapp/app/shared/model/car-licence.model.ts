export const enum LICENCE {
    A = 'A',
    B = 'B',
    B96 = 'B96',
    BE = 'BE',
    C1 = 'C1',
    C1E = 'C1E',
    C = 'C',
    CE = 'CE',
    D1 = 'D1',
    D1E = 'D1E',
    D = 'D',
    DE = 'DE'
}

export interface ICarLicence {
    id?: number;
    carLicence?: LICENCE;
}

export class CarLicence implements ICarLicence {
    constructor(public id?: number, public carLicence?: LICENCE) {}
}
