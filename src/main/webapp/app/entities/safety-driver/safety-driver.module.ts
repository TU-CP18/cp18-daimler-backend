import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { CpdaimlerSharedModule } from 'app/shared';
import { CpdaimlerAdminModule } from 'app/admin/admin.module';
import {
    SafetyDriverComponent,
    SafetyDriverDetailComponent,
    SafetyDriverUpdateComponent,
    SafetyDriverDeletePopupComponent,
    SafetyDriverDeleteDialogComponent,
    safetyDriverRoute,
    safetyDriverPopupRoute
} from './';

const ENTITY_STATES = [...safetyDriverRoute, ...safetyDriverPopupRoute];

@NgModule({
    imports: [CpdaimlerSharedModule, CpdaimlerAdminModule, RouterModule.forChild(ENTITY_STATES)],
    declarations: [
        SafetyDriverComponent,
        SafetyDriverDetailComponent,
        SafetyDriverUpdateComponent,
        SafetyDriverDeleteDialogComponent,
        SafetyDriverDeletePopupComponent
    ],
    entryComponents: [
        SafetyDriverComponent,
        SafetyDriverUpdateComponent,
        SafetyDriverDeleteDialogComponent,
        SafetyDriverDeletePopupComponent
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CpdaimlerSafetyDriverModule {}
