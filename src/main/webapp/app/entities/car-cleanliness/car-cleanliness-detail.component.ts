import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ICarCleanliness } from 'app/shared/model/car-cleanliness.model';

@Component({
    selector: 'jhi-car-cleanliness-detail',
    templateUrl: './car-cleanliness-detail.component.html'
})
export class CarCleanlinessDetailComponent implements OnInit {
    carCleanliness: ICarCleanliness;

    constructor(private activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ carCleanliness }) => {
            this.carCleanliness = carCleanliness;
        });
    }

    previousState() {
        window.history.back();
    }
}
