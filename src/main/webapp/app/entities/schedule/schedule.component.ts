import { Component, Inject, ViewChild, ViewEncapsulation, OnInit, OnDestroy } from '@angular/core';
import { extend, isNullOrUndefined, Browser } from '@syncfusion/ej2-base';
import {
    ScheduleComponent,
    ActionEventArgs,
    PopupOpenEventArgs,
    EventRenderedArgs,
    RenderCellEventArgs,
    DragAndDropService,
    TimelineViewsService,
    GroupModel,
    EventSettingsModel,
    ResizeService,
    TimeScaleModel,
    WorkHoursModel,
    View
} from '@syncfusion/ej2-angular-schedule';
import { newShifts } from './datasource';

import { ScheduleService } from './schedule.service';
import { SafetyDriverService } from './../safety-driver/safety-driver.service';

import { HttpErrorResponse, HttpHeaders, HttpResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { JhiEventManager, JhiParseLinks, JhiAlertService } from 'ng-jhipster';

import { IShift } from 'app/shared/model/shift.model';
import { ScheduleShift, IScheduleShift } from 'app/shared/model/schedule-shift.model';
import { ScheduleDriver, IScheduleDriver } from 'app/shared/model/schedule-driver.model';
import { ISafetyDriver, SafetyDriver } from 'app/shared/model/safety-driver.model';

import { Principal, User } from 'app/core';
import { EventSettings } from '@syncfusion/ej2-schedule/src/schedule/models/event-settings';

@Component({
    selector: 'jhi-schedule',
    templateUrl: './schedule.component.html',
    styleUrls: ['./schedule.css', 'material.css'],
    encapsulation: ViewEncapsulation.None
})
export class CPScheduleComponent implements OnInit, OnDestroy {
    // BEGIN SYNCFUSION FIELDS
    public selectedDate: Date = new Date(2019, 1, 14);
    public timeScale: TimeScaleModel = { interval: 60, slotCount: 1 };
    public workHours: WorkHoursModel = { start: '08:00', end: '20:00' };
    public currentView: View = 'TimelineWeek';
    public group: GroupModel = {
        enableCompactView: false,
        resources: ['Driver']
    };

    // array of drivers, populated by querying the API
    public drivers: ScheduleDriver[] = [];

    // array of shifts, populated by querying the API
    shifts: ScheduleShift[] = [new ScheduleShift(1, 1, 'URBANETIC', new Date(2019, 1, 14, 8, 0), new Date(2019, 1, 14, 12, 0), 1, 52, 54)];

    // only allow one driver per shift
    public allowMultiple: Boolean = false;

    // array of colours used to display shifts
    private colours: string[] = ['#ea7a57', '#7fa900', '#5978ee', '#fec200', '#df5286', '#00bdae', '#865fcf', '#1aaa55'];

    public eventSettings: EventSettingsModel = {
        dataSource: <Object[]>extend([], newShifts, null, true),
        fields: {
            id: 'id',
            subject: { title: 'Vehicle', name: 'vehicleId' },
            description: { title: 'Vehicle Model', name: 'vehicleModel' },
            startTime: { title: 'Start', name: 'startTime' },
            endTime: { title: 'End', name: 'endTime' }
        }
    };

    @ViewChild('scheduleObj') public scheduleObj: ScheduleComponent;
    // END SYNCFUSION FIELDS

    currentAccount: any;
    eventSubscriber: Subscription;

    constructor(
        private safetyDriverService: SafetyDriverService,
        private scheduleService: ScheduleService,
        private jhiAlertService: JhiAlertService,
        private principal: Principal,
        private eventManager: JhiEventManager
    ) {}

    loadAll() {
        this.safetyDriverService
            .query({})
            .subscribe(
                (res: HttpResponse<ISafetyDriver[]>) => this.parseDrivers(res.body),
                (res: HttpErrorResponse) => this.onError(res.message)
            );

        this.scheduleService
            .getAllFullShifts({})
            .subscribe((res: HttpResponse<IShift[]>) => this.parseShifts(res.body), (res: HttpErrorResponse) => this.onError(res.message));
    }

    ngOnInit() {
        this.loadAll();
        this.principal.identity().then(account => {
            this.currentAccount = account;
        });
        this.registerChangeInShifts();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInShifts() {
        this.eventSubscriber = this.eventManager.subscribe('shiftListModification', response => this.loadAll());
    }

    private parseShifts(data: IShift[]) {
        this.shifts = data.map(
            x =>
                new ScheduleShift(
                    x.id,
                    x.car.id,
                    x.car.model,
                    new Date(x.start),
                    new Date(x.end),
                    x.safetyDriver.id,
                    x.longStart,
                    x.latStart
                )
        );
        console.log(this.shifts);
        this.refreshSchedule();
    }

    private parseDrivers(data: ISafetyDriver[]) {
        this.drivers = data.map(
            x =>
                new ScheduleDriver(
                    x.id,
                    x.user.lastName,
                    x.user.firstName,
                    x.user.firstName + ' ' + x.user.lastName,
                    this.colours[x.id % 8]
                )
        );
        console.log(this.drivers);
    }

    refreshSchedule() {
        this.scheduleObj.refreshEvents();
        // this.scheduleObj.refresh();
    }

    private onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }

    // Syncfusion: shifts in the past are read-only
    isReadOnly(endDate: Date): boolean {
        return endDate < new Date(Date.now());
    }

    // Syncfusion: specify options for popups that open when a shift is selected
    onPopupOpen(args: PopupOpenEventArgs): void {
        const data: { [key: string]: Object } = <{ [key: string]: Object }>args.data;
        if (args.type === 'QuickInfo' || args.type === 'Editor' || args.type === 'RecurrenceAlert' || args.type === 'DeleteAlert') {
            const target: HTMLElement =
                args.type === 'RecurrenceAlert' || args.type === 'DeleteAlert' ? (args.data as any).element[0] : args.target;
            if (!isNullOrUndefined(target) && target.classList.contains('e-work-cells')) {
                if (
                    target.classList.contains('e-read-only-cells') ||
                    !this.scheduleObj.isSlotAvailable(data.startTime as Date, data.endTime as Date, data.groupIndex as number)
                ) {
                    args.cancel = true;
                }
            } else if (!isNullOrUndefined(target) && target.classList.contains('e-appointment') && this.isReadOnly(data.EndTime as Date)) {
                args.cancel = true;
            }
        }
    }

    // Syncfusion: specify behaviour for user actions eventCreate and eventChange
    onActionBegin(args: ActionEventArgs): void {
        if (args.requestType === 'eventCreate' || args.requestType === 'eventChange') {
            const data: { [key: string]: Object } = args.data as { [key: string]: Object };
            const groupIndex: number = this.scheduleObj.eventBase.getGroupIndexFromEvent(data);
            if (!this.scheduleObj.isSlotAvailable(data.StartTime as Date, data.EndTime as Date, groupIndex as number)) {
                args.cancel = true;
            }
        }
    }

    // Syncfusion: define how cells should be rendered
    onRenderCell(args: RenderCellEventArgs): void {
        if (args.element.classList.contains('e-work-cells')) {
            if (args.date < new Date(2018, 6, 31, 0, 0)) {
                args.element.setAttribute('aria-readonly', 'true');
                args.element.classList.add('e-read-only-cells');
            }
        }
        if (args.elementType === 'emptyCells' && args.element.classList.contains('e-resource-left-td')) {
            const target: HTMLElement = args.element.querySelector('.e-resource-text') as HTMLElement;
            target.innerHTML =
                '<div class="lastName">Last Name</div><div class="firstName">First Name</div><div class="driverId">Driver ID</div>';
        }
    }

    // Syncfusion: define how events should be rendered
    onEventRendered(args: EventRenderedArgs): void {
        const data: { [key: string]: Object } = args.data;
        if (this.isReadOnly(data.EndTime as Date)) {
            args.element.setAttribute('aria-readonly', 'true');
            args.element.classList.add('e-read-only');
        }
    }
}
