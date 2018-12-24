import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { JhiPaginationUtil, JhiResolvePagingParams } from 'ng-jhipster';
import { UserRouteAccessService } from 'app/core';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';
import { CarIssue } from 'app/shared/model/car-issue.model';
import { CarIssueService } from './car-issue.service';
import { CarIssueComponent } from './car-issue.component';
import { CarIssueDetailComponent } from './car-issue-detail.component';
import { CarIssueUpdateComponent } from './car-issue-update.component';
import { CarIssueDeletePopupComponent } from './car-issue-delete-dialog.component';
import { ICarIssue } from 'app/shared/model/car-issue.model';

@Injectable({ providedIn: 'root' })
export class CarIssueResolve implements Resolve<ICarIssue> {
    constructor(private service: CarIssueService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const id = route.params['id'] ? route.params['id'] : null;
        if (id) {
            return this.service.find(id).pipe(map((carIssue: HttpResponse<CarIssue>) => carIssue.body));
        }
        return of(new CarIssue());
    }
}

export const carIssueRoute: Routes = [
    {
        path: 'car-issue',
        component: CarIssueComponent,
        resolve: {
            pagingParams: JhiResolvePagingParams
        },
        data: {
            authorities: ['ROLE_USER'],
            defaultSort: 'id,asc',
            pageTitle: 'cpdaimlerApp.carIssue.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'car-issue/:id/view',
        component: CarIssueDetailComponent,
        resolve: {
            carIssue: CarIssueResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'cpdaimlerApp.carIssue.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'car-issue/new',
        component: CarIssueUpdateComponent,
        resolve: {
            carIssue: CarIssueResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'cpdaimlerApp.carIssue.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'car-issue/:id/edit',
        component: CarIssueUpdateComponent,
        resolve: {
            carIssue: CarIssueResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'cpdaimlerApp.carIssue.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const carIssuePopupRoute: Routes = [
    {
        path: 'car-issue/:id/delete',
        component: CarIssueDeletePopupComponent,
        resolve: {
            carIssue: CarIssueResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'cpdaimlerApp.carIssue.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
