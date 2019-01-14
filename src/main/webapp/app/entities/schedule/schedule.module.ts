import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { CpdaimlerSharedModule } from 'app/shared';
import { ScheduleComponent, scheduleRoute } from './';

const ENTITY_STATES = [...scheduleRoute];

@NgModule({
    imports: [CpdaimlerSharedModule, RouterModule.forChild(ENTITY_STATES)],
    declarations: [ScheduleComponent],
    entryComponents: [ScheduleComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CpdaimlerScheduleModule {}
