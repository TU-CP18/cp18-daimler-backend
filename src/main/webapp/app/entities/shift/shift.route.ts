import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { JhiPaginationUtil, JhiResolvePagingParams } from 'ng-jhipster';
import { UserRouteAccessService } from 'app/core';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Shift } from 'app/shared/model/shift.model';
import { ShiftService } from './shift.service';
import { ShiftComponent } from './shift.component';
import { ShiftDetailComponent } from './shift-detail.component';
import { ShiftUpdateComponent } from './shift-update.component';
import { ShiftDeletePopupComponent } from './shift-delete-dialog.component';
import { IShift } from 'app/shared/model/shift.model';

@Injectable({ providedIn: 'root' })
export class ShiftResolve implements Resolve<IShift> {
    constructor(private service: ShiftService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const id = route.params['id'] ? route.params['id'] : null;
        if (id) {
            return this.service.find(id).pipe(map((shift: HttpResponse<Shift>) => shift.body));
        }
        return of(new Shift());
    }
}

export const shiftRoute: Routes = [
    {
        path: 'shift',
        component: ShiftComponent,
        resolve: {
            pagingParams: JhiResolvePagingParams
        },
        data: {
            authorities: ['ROLE_FLEETMANAGER'],
            defaultSort: 'id,asc',
            pageTitle: 'cpdaimlerApp.shift.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'shift/:id/view',
        component: ShiftDetailComponent,
        resolve: {
            shift: ShiftResolve
        },
        data: {
            authorities: ['ROLE_FLEETMANAGER'],
            pageTitle: 'cpdaimlerApp.shift.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'shift/new',
        component: ShiftUpdateComponent,
        resolve: {
            shift: ShiftResolve
        },
        data: {
            authorities: ['ROLE_FLEETMANAGER'],
            pageTitle: 'cpdaimlerApp.shift.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'shift/:id/edit',
        component: ShiftUpdateComponent,
        resolve: {
            shift: ShiftResolve
        },
        data: {
            authorities: ['ROLE_FLEETMANAGER'],
            pageTitle: 'cpdaimlerApp.shift.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const shiftPopupRoute: Routes = [
    {
        path: 'shift/:id/delete',
        component: ShiftDeletePopupComponent,
        resolve: {
            shift: ShiftResolve
        },
        data: {
            authorities: ['ROLE_FLEETMANAGER'],
            pageTitle: 'cpdaimlerApp.shift.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
