import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ISafetyDriver } from 'app/shared/model/safety-driver.model';

@Component({
    selector: 'jhi-safety-driver-detail',
    templateUrl: './safety-driver-detail.component.html'
})
export class SafetyDriverDetailComponent implements OnInit {
    safetyDriver: ISafetyDriver;

    constructor(private activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ safetyDriver }) => {
            this.safetyDriver = safetyDriver;
        });
    }

    previousState() {
        window.history.back();
    }
}
