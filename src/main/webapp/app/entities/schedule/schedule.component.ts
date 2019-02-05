// general imports
import { Component, Inject, ViewChild, ViewEncapsulation, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { JhiEventManager, JhiParseLinks, JhiAlertService } from 'ng-jhipster';

// SyncFusion imports for schedule
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
import { DataManager, Query } from '@syncfusion/ej2-data';
import { EventSettings } from '@syncfusion/ej2-schedule/src/schedule/models/event-settings';

// component-specific imports
import { SafetyDriverService } from './../safety-driver/safety-driver.service';
import { ShiftService } from '../shift/shift.service';
import { ScheduleService } from './schedule.service';
import { ScheduleShift } from 'app/shared/model/schedule-shift.model';
import { ScheduleDriver } from 'app/shared/model/schedule-driver.model';
import { ISafetyDriver } from 'app/shared/model/safety-driver.model';
import { IShift } from 'app/shared/model/shift.model';

import { Principal } from 'app/core';

@Component({
    selector: 'jhi-schedule',
    templateUrl: './schedule.component.html',
    styleUrls: ['./schedule.css', 'material.css'],
    encapsulation: ViewEncapsulation.None
})
export class CPScheduleComponent implements OnInit, OnDestroy {
    // default date displayed by the schedule (set to 14.02.2019 for demo)
    public selectedDate: Date = new Date(2019, 1, 14);

    // time scale of the schedule view
    public timeScale: TimeScaleModel = { interval: 60, slotCount: 1 };

    // working hours are displayed in a lighter shade than non-working hours
    public workHours: WorkHoursModel = { start: '08:00', end: '20:00' };

    // set default view of the schedule to weekly timeline
    public currentView: View = 'TimelineWeek';

    // group model used by the schedule
    public group: GroupModel = {
        enableCompactView: false,
        resources: ['Driver']
    };

    // array of drivers, populated by querying the API
    public drivers: ScheduleDriver[] = [];

    // array of shifts, populated with data retrieved from the DB
    shifts: ScheduleShift[] = [];

    // DataManager object used to connect the schedule to the array of shifts retrieved from the DB
    dataManager: DataManager = new DataManager(this.shifts);

    // only allow one driver per shift
    public allowMultiple: Boolean = false;

    // array of colours used to display shifts
    private colours: string[] = ['#ea7a57', '#7fa900', '#5978ee', '#fec200', '#df5286', '#00bdae', '#865fcf', '#1aaa55'];

    // define event settings model of the schedule
    public eventSettings: EventSettingsModel = {
        // set dataManager as data source to connect schedule to array of shifts
        dataSource: this.dataManager,
        // map schedule model fields to corresponding ScheduleShift fields
        fields: {
            id: 'id',
            subject: { title: 'Vehicle', name: 'vehicleId' },
            description: { title: 'Vehicle Model', name: 'vehicleModel' },
            startTime: { title: 'Start', name: 'startTime' },
            endTime: { title: 'End', name: 'endTime' }
        }
    };

    // connect local schedule object to ScheduleComponent
    @ViewChild('scheduleObj') public scheduleObj: ScheduleComponent;

    currentAccount: any;
    eventSubscriber: Subscription;

    constructor(
        private safetyDriverService: SafetyDriverService,
        private shiftService: ShiftService,
        private scheduleService: ScheduleService,
        private jhiAlertService: JhiAlertService,
        private principal: Principal,
        private eventManager: JhiEventManager
    ) {}

    // load all safety drivers and shifts into the schedule
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

    ngOnInit() {}

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInShifts() {
        this.eventSubscriber = this.eventManager.subscribe('shiftListModification', response => this.loadAll());
    }

    // maps IShift[] object retrieved from the DB to a ScheduleShift[] object compatible with the schedule
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

    // maps ISafetyDriver[] object retrieved from the DB to a ScheduleDriver[] object compatible with the schedule
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

    // used by wait(), returns after a given number of ms
    private reloadDelay(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // same effect as Thread.sleep(ms)
    async wait(ms: number) {
        await this.reloadDelay(ms);
    }

    // adds loaded shifts to the schedule after a delay of two seconds
    // to prevent them from being added while the schedule is not fully initialized
    refreshSchedule() {
        // this.wait(2000);
        this.scheduleObj.addEvent(this.shifts);
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
        console.log('myyyyyyy ' + args.requestType);
        if (args.requestType === 'eventCreate' || args.requestType === 'eventChange') {
            const data: { [key: string]: Object } = args.data as { [key: string]: Object };
            const groupIndex: number = this.scheduleObj.eventBase.getGroupIndexFromEvent(data);
            if (!this.scheduleObj.isSlotAvailable(data.StartTime as Date, data.EndTime as Date, groupIndex as number)) {
                args.cancel = true;
            }
        }
        if (args.requestType === 'eventRemove') {
            const data: { [key: string]: ScheduleShift } = args.data as { [key: string]: ScheduleShift };
            const groupIndex: number = this.scheduleObj.eventBase.getGroupIndexFromEvent(data);
            console.log(data);
            console.log(data[0].id);

            this.shiftService.delete(data[0].id).subscribe(response => {
                this.eventManager.broadcast({
                    name: 'shiftListModification',
                    content: 'Deleted an shift'
                });
            });
        }

        if (args.requestType === 'toolbarItemRendering') {
            this.loadAll();
            this.principal.identity().then(account => {
                this.currentAccount = account;
            });
            this.registerChangeInShifts();
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
