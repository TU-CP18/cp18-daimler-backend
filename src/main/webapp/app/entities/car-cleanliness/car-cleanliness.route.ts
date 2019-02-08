import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { JhiPaginationUtil, JhiResolvePagingParams } from 'ng-jhipster';
import { UserRouteAccessService } from 'app/core';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';
import { CarCleanliness } from 'app/shared/model/car-cleanliness.model';
import { CarCleanlinessService } from './car-cleanliness.service';
import { CarCleanlinessComponent } from './car-cleanliness.component';
import { CarCleanlinessDetailComponent } from './car-cleanliness-detail.component';
import { CarCleanlinessUpdateComponent } from './car-cleanliness-update.component';
import { CarCleanlinessDeletePopupComponent } from './car-cleanliness-delete-dialog.component';
import { ICarCleanliness } from 'app/shared/model/car-cleanliness.model';

@Injectable({ providedIn: 'root' })
export class CarCleanlinessResolve implements Resolve<ICarCleanliness> {
    constructor(private service: CarCleanlinessService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const id = route.params['id'] ? route.params['id'] : null;
        if (id) {
            return this.service.find(id).pipe(map((carCleanliness: HttpResponse<CarCleanliness>) => carCleanliness.body));
        }
        return of(new CarCleanliness());
    }
}

export const carCleanlinessRoute: Routes = [
    {
        path: 'car-cleanliness',
        component: CarCleanlinessComponent,
        resolve: {
            pagingParams: JhiResolvePagingParams
        },
        data: {
            authorities: ['ROLE_USER'],
            defaultSort: 'id,asc',
            pageTitle: 'cpdaimlerApp.carCleanliness.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'car-cleanliness/:id/view',
        component: CarCleanlinessDetailComponent,
        resolve: {
            carCleanliness: CarCleanlinessResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'cpdaimlerApp.carCleanliness.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'car-cleanliness/new',
        component: CarCleanlinessUpdateComponent,
        resolve: {
            carCleanliness: CarCleanlinessResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'cpdaimlerApp.carCleanliness.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'car-cleanliness/:id/edit',
        component: CarCleanlinessUpdateComponent,
        resolve: {
            carCleanliness: CarCleanlinessResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'cpdaimlerApp.carCleanliness.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const carCleanlinessPopupRoute: Routes = [
    {
        path: 'car-cleanliness/:id/delete',
        component: CarCleanlinessDeletePopupComponent,
        resolve: {
            carCleanliness: CarCleanlinessResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'cpdaimlerApp.carCleanliness.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
