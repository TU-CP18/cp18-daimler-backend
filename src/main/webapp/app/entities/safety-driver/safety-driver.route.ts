import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { JhiPaginationUtil, JhiResolvePagingParams } from 'ng-jhipster';
import { UserRouteAccessService } from 'app/core';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';
import { SafetyDriver } from 'app/shared/model/safety-driver.model';
import { SafetyDriverService } from './safety-driver.service';
import { SafetyDriverComponent } from './safety-driver.component';
import { SafetyDriverDetailComponent } from './safety-driver-detail.component';
import { SafetyDriverUpdateComponent } from './safety-driver-update.component';
import { SafetyDriverDeletePopupComponent } from './safety-driver-delete-dialog.component';
import { ISafetyDriver } from 'app/shared/model/safety-driver.model';

@Injectable({ providedIn: 'root' })
export class SafetyDriverResolve implements Resolve<ISafetyDriver> {
    constructor(private service: SafetyDriverService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const id = route.params['id'] ? route.params['id'] : null;
        if (id) {
            return this.service.find(id).pipe(map((safetyDriver: HttpResponse<SafetyDriver>) => safetyDriver.body));
        }
        return of(new SafetyDriver());
    }
}

export const safetyDriverRoute: Routes = [
    {
        path: 'safety-driver',
        component: SafetyDriverComponent,
        resolve: {
            pagingParams: JhiResolvePagingParams
        },
        data: {
            authorities: ['ROLE_FLEETMANAGER'],
            defaultSort: 'id,asc',
            pageTitle: 'cpdaimlerApp.safetyDriver.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'safety-driver/:id/view',
        component: SafetyDriverDetailComponent,
        resolve: {
            safetyDriver: SafetyDriverResolve
        },
        data: {
            authorities: ['ROLE_FLEETMANAGER'],
            pageTitle: 'cpdaimlerApp.safetyDriver.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'safety-driver/new',
        component: SafetyDriverUpdateComponent,
        resolve: {
            safetyDriver: SafetyDriverResolve
        },
        data: {
            authorities: ['ROLE_FLEETMANAGER'],
            pageTitle: 'cpdaimlerApp.safetyDriver.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'safety-driver/:id/edit',
        component: SafetyDriverUpdateComponent,
        resolve: {
            safetyDriver: SafetyDriverResolve
        },
        data: {
            authorities: ['ROLE_FLEETMANAGER'],
            pageTitle: 'cpdaimlerApp.safetyDriver.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const safetyDriverPopupRoute: Routes = [
    {
        path: 'safety-driver/:id/delete',
        component: SafetyDriverDeletePopupComponent,
        resolve: {
            safetyDriver: SafetyDriverResolve
        },
        data: {
            authorities: ['ROLE_FLEETMANAGER'],
            pageTitle: 'cpdaimlerApp.safetyDriver.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
