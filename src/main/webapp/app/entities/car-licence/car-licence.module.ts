import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { CpdaimlerSharedModule } from 'app/shared';
import {
    CarLicenceComponent,
    CarLicenceDetailComponent,
    CarLicenceUpdateComponent,
    CarLicenceDeletePopupComponent,
    CarLicenceDeleteDialogComponent,
    carLicenceRoute,
    carLicencePopupRoute
} from './';

const ENTITY_STATES = [...carLicenceRoute, ...carLicencePopupRoute];

@NgModule({
    imports: [CpdaimlerSharedModule, RouterModule.forChild(ENTITY_STATES)],
    declarations: [
        CarLicenceComponent,
        CarLicenceDetailComponent,
        CarLicenceUpdateComponent,
        CarLicenceDeleteDialogComponent,
        CarLicenceDeletePopupComponent
    ],
    entryComponents: [CarLicenceComponent, CarLicenceUpdateComponent, CarLicenceDeleteDialogComponent, CarLicenceDeletePopupComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CpdaimlerCarLicenceModule {}
