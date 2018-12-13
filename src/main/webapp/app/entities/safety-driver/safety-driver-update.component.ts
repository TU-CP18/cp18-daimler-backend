import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { JhiAlertService } from 'ng-jhipster';

import { ISafetyDriver } from 'app/shared/model/safety-driver.model';
import { SafetyDriverService } from './safety-driver.service';
import { IUser, User, UserService } from 'app/core';
import { ICarLicence } from 'app/shared/model/car-licence.model';
import { CarLicenceService } from 'app/entities/car-licence';

@Component({
    selector: 'jhi-safety-driver-update',
    templateUrl: './safety-driver-update.component.html'
})
export class SafetyDriverUpdateComponent implements OnInit {
    safetyDriver: ISafetyDriver;
    isSaving: boolean;

    user: IUser;

    carlicences: ICarLicence[];

    constructor(
        private jhiAlertService: JhiAlertService,
        private safetyDriverService: SafetyDriverService,
        private userService: UserService,
        private carLicenceService: CarLicenceService,
        private activatedRoute: ActivatedRoute
    ) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ safetyDriver }) => {
            this.safetyDriver = safetyDriver;

            if (this.safetyDriver.user === undefined) {
                this.safetyDriver.user = new User();
            }
        });
        this.carLicenceService.query().subscribe(
            (res: HttpResponse<ICarLicence[]>) => {
                this.carlicences = res.body;
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
    }

    previousState() {
        window.history.back();
    }

    save() {
        this.isSaving = true;
        if (this.safetyDriver.id !== undefined) {
            this.subscribeToSaveResponse(this.safetyDriverService.update(this.safetyDriver));
        } else {
            this.subscribeToSaveResponse(this.safetyDriverService.create(this.safetyDriver));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<ISafetyDriver>>) {
        result.subscribe((res: HttpResponse<ISafetyDriver>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
    }

    private onSaveSuccess() {
        this.isSaving = false;
        this.previousState();
    }

    private onSaveError() {
        this.isSaving = false;
    }

    private onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }

    trackUserById(index: number, item: IUser) {
        return item.id;
    }

    trackCarLicenceById(index: number, item: ICarLicence) {
        return item.id;
    }

    getSelected(selectedVals: Array<any>, option: any) {
        if (selectedVals) {
            for (let i = 0; i < selectedVals.length; i++) {
                if (option.id === selectedVals[i].id) {
                    return selectedVals[i];
                }
            }
        }
        return option;
    }
}
