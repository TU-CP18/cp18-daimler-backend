import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IShift } from 'app/shared/model/shift.model';

@Component({
    selector: 'jhi-shift-detail',
    templateUrl: './shift-detail.component.html'
})
export class ShiftDetailComponent implements OnInit {
    shift: IShift;

    constructor(private activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ shift }) => {
            this.shift = shift;
        });
    }

    previousState() {
        window.history.back();
    }
}
