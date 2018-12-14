import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ICarIssue } from 'app/shared/model/car-issue.model';

@Component({
    selector: 'jhi-car-issue-detail',
    templateUrl: './car-issue-detail.component.html'
})
export class CarIssueDetailComponent implements OnInit {
    carIssue: ICarIssue;

    constructor(private activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ carIssue }) => {
            this.carIssue = carIssue;
        });
    }

    previousState() {
        window.history.back();
    }
}
