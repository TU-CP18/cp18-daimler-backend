import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { JhiPaginationUtil, JhiResolvePagingParams } from 'ng-jhipster';
import { UserRouteAccessService } from 'app/core';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';
import { CarLicence } from 'app/shared/model/car-licence.model';
import { CarLicenceService } from './car-licence.service';
import { CarLicenceComponent } from './car-licence.component';
import { CarLicenceDetailComponent } from './car-licence-detail.component';
import { CarLicenceUpdateComponent } from './car-licence-update.component';
import { CarLicenceDeletePopupComponent } from './car-licence-delete-dialog.component';
import { ICarLicence } from 'app/shared/model/car-licence.model';

@Injectable({ providedIn: 'root' })
export class CarLicenceResolve implements Resolve<ICarLicence> {
    constructor(private service: CarLicenceService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const id = route.params['id'] ? route.params['id'] : null;
        if (id) {
            return this.service.find(id).pipe(map((carLicence: HttpResponse<CarLicence>) => carLicence.body));
        }
        return of(new CarLicence());
    }
}

export const carLicenceRoute: Routes = [
    {
        path: 'car-licence',
        component: CarLicenceComponent,
        resolve: {
            pagingParams: JhiResolvePagingParams
        },
        data: {
            authorities: ['ROLE_USER'],
            defaultSort: 'id,asc',
            pageTitle: 'cpdaimlerApp.carLicence.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'car-licence/:id/view',
        component: CarLicenceDetailComponent,
        resolve: {
            carLicence: CarLicenceResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'cpdaimlerApp.carLicence.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'car-licence/new',
        component: CarLicenceUpdateComponent,
        resolve: {
            carLicence: CarLicenceResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'cpdaimlerApp.carLicence.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'car-licence/:id/edit',
        component: CarLicenceUpdateComponent,
        resolve: {
            carLicence: CarLicenceResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'cpdaimlerApp.carLicence.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const carLicencePopupRoute: Routes = [
    {
        path: 'car-licence/:id/delete',
        component: CarLicenceDeletePopupComponent,
        resolve: {
            carLicence: CarLicenceResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'cpdaimlerApp.carLicence.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
