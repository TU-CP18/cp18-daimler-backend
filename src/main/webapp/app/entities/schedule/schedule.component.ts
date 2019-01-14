import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { JhiAlertService, JhiEventManager, JhiParseLinks } from 'ng-jhipster';

import { Principal } from 'app/core';

@Component({
    selector: 'jhi-schedule',
    templateUrl: './schedule.component.html',
    styleUrls: ['./schedule.css']
})
export class ScheduleComponent implements OnInit, OnDestroy {
    error: any;
    success: any;

    chart = [];

    constructor(
        private parseLinks: JhiParseLinks,
        private jhiAlertService: JhiAlertService,
        private principal: Principal,
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private eventManager: JhiEventManager
    ) {}

    ngOnInit() {}

    ngOnDestroy() {}

    private onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }
}
