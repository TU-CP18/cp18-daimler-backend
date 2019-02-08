import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { CpdaimlerSharedModule } from 'app/shared';
import {
    CarCleanlinessComponent,
    CarCleanlinessDetailComponent,
    CarCleanlinessUpdateComponent,
    CarCleanlinessDeletePopupComponent,
    CarCleanlinessDeleteDialogComponent,
    carCleanlinessRoute,
    carCleanlinessPopupRoute
} from './';

const ENTITY_STATES = [...carCleanlinessRoute, ...carCleanlinessPopupRoute];

@NgModule({
    imports: [CpdaimlerSharedModule, RouterModule.forChild(ENTITY_STATES)],
    declarations: [
        CarCleanlinessComponent,
        CarCleanlinessDetailComponent,
        CarCleanlinessUpdateComponent,
        CarCleanlinessDeleteDialogComponent,
        CarCleanlinessDeletePopupComponent
    ],
    entryComponents: [
        CarCleanlinessComponent,
        CarCleanlinessUpdateComponent,
        CarCleanlinessDeleteDialogComponent,
        CarCleanlinessDeletePopupComponent
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CpdaimlerCarCleanlinessModule {}
