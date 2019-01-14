import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { CpdaimlerCarModule } from './car/car.module';
import { CpdaimlerSafetyDriverModule } from './safety-driver/safety-driver.module';
import { CpdaimlerShiftModule } from './shift/shift.module';
import { CpdaimlerCarLicenceModule } from './car-licence/car-licence.module';
import { CpdaimlerCarIssueModule } from './car-issue/car-issue.module';
import { CpdaimlerScheduleModule } from './schedule/schedule.module';
/* jhipster-needle-add-entity-module-import - JHipster will add entity modules imports here */

@NgModule({
    // prettier-ignore
    imports: [
        CpdaimlerCarModule,
        CpdaimlerSafetyDriverModule,
        CpdaimlerShiftModule,
        CpdaimlerCarLicenceModule,
        CpdaimlerCarIssueModule,
        CpdaimlerScheduleModule
        /* jhipster-needle-add-entity-module - JHipster will add entity modules here */
    ],
    declarations: [],
    entryComponents: [],
    providers: [],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CpdaimlerEntityModule {}
