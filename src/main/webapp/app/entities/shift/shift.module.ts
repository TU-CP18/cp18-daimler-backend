import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { CpdaimlerSharedModule } from 'app/shared';
import {
    ShiftComponent,
    ShiftDetailComponent,
    ShiftUpdateComponent,
    ShiftDeletePopupComponent,
    ShiftDeleteDialogComponent,
    shiftRoute,
    shiftPopupRoute
} from './';

const ENTITY_STATES = [...shiftRoute, ...shiftPopupRoute];

@NgModule({
    imports: [CpdaimlerSharedModule, RouterModule.forChild(ENTITY_STATES)],
    declarations: [ShiftComponent, ShiftDetailComponent, ShiftUpdateComponent, ShiftDeleteDialogComponent, ShiftDeletePopupComponent],
    entryComponents: [ShiftComponent, ShiftUpdateComponent, ShiftDeleteDialogComponent, ShiftDeletePopupComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CpdaimlerShiftModule {}
