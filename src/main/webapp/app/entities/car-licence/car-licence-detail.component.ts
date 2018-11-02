import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ICarLicence } from 'app/shared/model/car-licence.model';

@Component({
    selector: 'jhi-car-licence-detail',
    templateUrl: './car-licence-detail.component.html'
})
export class CarLicenceDetailComponent implements OnInit {
    carLicence: ICarLicence;

    constructor(private activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ carLicence }) => {
            this.carLicence = carLicence;
        });
    }

    previousState() {
        window.history.back();
    }
}
