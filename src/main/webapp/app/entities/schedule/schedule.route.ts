import { Routes } from '@angular/router';
import { JhiResolvePagingParams } from 'ng-jhipster';
import { UserRouteAccessService } from 'app/core';
import { ScheduleComponent } from 'app/entities/schedule/schedule.component';

export const scheduleRoute: Routes = [
    {
        path: 'schedule',
        component: ScheduleComponent,
        data: {
            authorities: ['ROLE_FLEETMANAGER', 'ROLE_ADMIN'],
            pageTitle: 'Schedule'
        },
        canActivate: [UserRouteAccessService]
    }
];
