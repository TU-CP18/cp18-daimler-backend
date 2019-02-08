import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { DATE_TIME_FORMAT } from 'app/shared/constants/input.constants';
import { JhiAlertService } from 'ng-jhipster';

import { ICarCleanliness } from 'app/shared/model/car-cleanliness.model';
import { CarCleanlinessService } from './car-cleanliness.service';
import { ICar } from 'app/shared/model/car.model';
import { CarService } from 'app/entities/car';
import { IShift } from 'app/shared/model/shift.model';
import { ShiftService } from 'app/entities/shift';

@Component({
    selector: 'jhi-car-cleanliness-update',
    templateUrl: './car-cleanliness-update.component.html'
})
export class CarCleanlinessUpdateComponent implements OnInit {
    carCleanliness: ICarCleanliness;
    isSaving: boolean;

    cars: ICar[];

    shifts: IShift[];
    createdAt: string;

    constructor(
        private jhiAlertService: JhiAlertService,
        private carCleanlinessService: CarCleanlinessService,
        private carService: CarService,
        private shiftService: ShiftService,
        private activatedRoute: ActivatedRoute
    ) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ carCleanliness }) => {
            this.carCleanliness = carCleanliness;
            this.createdAt = this.carCleanliness.createdAt != null ? this.carCleanliness.createdAt.format(DATE_TIME_FORMAT) : null;
        });
        this.carService.query().subscribe(
            (res: HttpResponse<ICar[]>) => {
                this.cars = res.body;
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
        this.shiftService.query().subscribe(
            (res: HttpResponse<IShift[]>) => {
                this.shifts = res.body;
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
    }

    previousState() {
        window.history.back();
    }

    save() {
        this.isSaving = true;
        this.carCleanliness.createdAt = this.createdAt != null ? moment(this.createdAt, DATE_TIME_FORMAT) : null;
        if (this.carCleanliness.id !== undefined) {
            this.subscribeToSaveResponse(this.carCleanlinessService.update(this.carCleanliness));
        } else {
            this.subscribeToSaveResponse(this.carCleanlinessService.create(this.carCleanliness));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<ICarCleanliness>>) {
        result.subscribe((res: HttpResponse<ICarCleanliness>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
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

    trackCarById(index: number, item: ICar) {
        return item.id;
    }

    trackShiftById(index: number, item: IShift) {
        return item.id;
    }
}
