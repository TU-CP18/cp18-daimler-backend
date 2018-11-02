import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { ICarLicence } from 'app/shared/model/car-licence.model';
import { CarLicenceService } from './car-licence.service';

@Component({
    selector: 'jhi-car-licence-update',
    templateUrl: './car-licence-update.component.html'
})
export class CarLicenceUpdateComponent implements OnInit {
    carLicence: ICarLicence;
    isSaving: boolean;

    constructor(private carLicenceService: CarLicenceService, private activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ carLicence }) => {
            this.carLicence = carLicence;
        });
    }

    previousState() {
        window.history.back();
    }

    save() {
        this.isSaving = true;
        if (this.carLicence.id !== undefined) {
            this.subscribeToSaveResponse(this.carLicenceService.update(this.carLicence));
        } else {
            this.subscribeToSaveResponse(this.carLicenceService.create(this.carLicence));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<ICarLicence>>) {
        result.subscribe((res: HttpResponse<ICarLicence>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
    }

    private onSaveSuccess() {
        this.isSaving = false;
        this.previousState();
    }

    private onSaveError() {
        this.isSaving = false;
    }
}
