import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { JhiAlertService } from 'ng-jhipster';

import { ICarIssue } from 'app/shared/model/car-issue.model';
import { CarIssueService } from './car-issue.service';
import { ICar } from 'app/shared/model/car.model';
import { CarService } from 'app/entities/car';

@Component({
    selector: 'jhi-car-issue-update',
    templateUrl: './car-issue-update.component.html'
})
export class CarIssueUpdateComponent implements OnInit {
    carIssue: ICarIssue;
    isSaving: boolean;

    cars: ICar[];

    constructor(
        private jhiAlertService: JhiAlertService,
        private carIssueService: CarIssueService,
        private carService: CarService,
        private activatedRoute: ActivatedRoute
    ) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ carIssue }) => {
            this.carIssue = carIssue;
        });
        this.carService.query().subscribe(
            (res: HttpResponse<ICar[]>) => {
                this.cars = res.body;
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
    }

    previousState() {
        window.history.back();
    }

    save() {
        this.isSaving = true;
        if (this.carIssue.id !== undefined) {
            this.subscribeToSaveResponse(this.carIssueService.update(this.carIssue));
        } else {
            this.subscribeToSaveResponse(this.carIssueService.create(this.carIssue));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<ICarIssue>>) {
        result.subscribe((res: HttpResponse<ICarIssue>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
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
}
