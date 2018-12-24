import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { CpdaimlerSharedModule } from 'app/shared';
import {
    CarIssueComponent,
    CarIssueDetailComponent,
    CarIssueUpdateComponent,
    CarIssueDeletePopupComponent,
    CarIssueDeleteDialogComponent,
    carIssueRoute,
    carIssuePopupRoute
} from './';

const ENTITY_STATES = [...carIssueRoute, ...carIssuePopupRoute];

@NgModule({
    imports: [CpdaimlerSharedModule, RouterModule.forChild(ENTITY_STATES)],
    declarations: [
        CarIssueComponent,
        CarIssueDetailComponent,
        CarIssueUpdateComponent,
        CarIssueDeleteDialogComponent,
        CarIssueDeletePopupComponent
    ],
    entryComponents: [CarIssueComponent, CarIssueUpdateComponent, CarIssueDeleteDialogComponent, CarIssueDeletePopupComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CpdaimlerCarIssueModule {}
