import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { CpdaimlerCarModule } from './car/car.module';
import { CpdaimlerSafetyDriverModule } from './safety-driver/safety-driver.module';
import { CpdaimlerShiftModule } from './shift/shift.module';
import { CpdaimlerCarLicenceModule } from './car-licence/car-licence.module';
import { CpdaimlerCarIssueModule } from './car-issue/car-issue.module';
import { ChatModule } from './chat/chat.module';
import { CpdaimlerScheduleModule } from './schedule/schedule.module';
import { CpdaimlerCarCleanlinessModule } from './car-cleanliness/car-cleanliness.module';
/* jhipster-needle-add-entity-module-import - JHipster will add entity modules imports here */

@NgModule({
    // prettier-ignore
    imports: [
        CpdaimlerCarModule,
        CpdaimlerSafetyDriverModule,
        CpdaimlerShiftModule,
        CpdaimlerCarLicenceModule,
        CpdaimlerCarIssueModule,
        ChatModule,
        CpdaimlerScheduleModule,
        CpdaimlerCarCleanlinessModule,
        /* jhipster-needle-add-entity-module - JHipster will add entity modules here */
    ],
    declarations: [],
    entryComponents: [],
    providers: [],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CpdaimlerEntityModule {}
