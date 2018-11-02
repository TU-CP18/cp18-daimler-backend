import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { JhiAlertService } from 'ng-jhipster';

import { ICar } from 'app/shared/model/car.model';
import { CarService } from './car.service';
import { ICarLicence } from 'app/shared/model/car-licence.model';
import { CarLicenceService } from 'app/entities/car-licence';

@Component({
    selector: 'jhi-car-update',
    templateUrl: './car-update.component.html'
})
export class CarUpdateComponent implements OnInit {
    car: ICar;
    isSaving: boolean;

    carlicences: ICarLicence[];

    constructor(
        private jhiAlertService: JhiAlertService,
        private carService: CarService,
        private carLicenceService: CarLicenceService,
        private activatedRoute: ActivatedRoute
    ) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ car }) => {
            this.car = car;
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
        if (this.car.id !== undefined) {
            this.subscribeToSaveResponse(this.carService.update(this.car));
        } else {
            this.subscribeToSaveResponse(this.carService.create(this.car));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<ICar>>) {
        result.subscribe((res: HttpResponse<ICar>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
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

    trackCarLicenceById(index: number, item: ICarLicence) {
        return item.id;
    }
}
