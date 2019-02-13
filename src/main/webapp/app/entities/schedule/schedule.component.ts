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
import { shiftData } from './datasource';

@Component({
    selector: 'jhi-schedule',
    templateUrl: './schedule.component.html',
    styleUrls: ['./schedule.css', 'material.css'],
    encapsulation: ViewEncapsulation.None
})
export class CPScheduleComponent implements OnInit, OnDestroy {
    public selectedDate: Date = new Date(Date.now());
    public timeScale: TimeScaleModel = { interval: 60, slotCount: 1 };
    public workHours: WorkHoursModel = { start: '08:00', end: '20:00' };
    public currentView: View = 'TimelineWeek';
    public group: GroupModel = {
        enableCompactView: false,
        resources: ['Driver']
    };
    public resourceDataSource: Object[] = [
        { lastName: 'Kent', firstName: 'Clark', fullName: 'Clark Kent', driverId: 1, color: '#ea7a57' },
        { lastName: 'Wayne', firstName: 'Bruce', fullName: 'Bruce Wayne', driverId: 2, color: '#7fa900' },
        { lastName: 'Stark', firstName: 'Tony', fullName: 'Tony Stark', driverId: 3, color: '#5978ee' },
        { lastName: 'Parker', firstName: 'Peter', fullName: 'Clark Kent', driverId: 4, color: '#fec200' },
        { lastName: 'Romanov', firstName: 'Natasha', fullName: 'Clark Kent', driverId: 5, color: '#df5286' },
        { lastName: 'Banner', firstName: 'Bruce', fullName: 'Clark Kent', driverId: 6, color: '#00bdae' },
        { lastName: 'Xavier', firstName: 'Charles', fullName: 'Clark Kent', driverId: 7, color: '#865fcf' },
        { lastName: 'Queen', firstName: 'Oliver', fullName: 'Clark Kent', driverId: 8, color: '#1aaa55' },
        { lastName: 'Rogers', firstName: 'Steve', fullName: 'Clark Kent', driverId: 9, color: '#df5286' },
        { lastName: 'Strange', firstName: 'Stephen', fullName: 'Clark Kent', driverId: 10, color: '#710193' }
    ];

    // array of drivers, populated by querying the API
    public drivers: ScheduleDriver[] = [];

    // array of shifts, populated with data retrieved from the DB
    shifts: ScheduleShift[] = [];

    // DataManager object used to connect the schedule to the array of shifts retrieved from the DB
    // dataManager: DataManager = new DataManager(this.shifts);

    // only allow one driver per shift
    public allowMultiple: Boolean = false;

    // array of colours used to display shifts
    private colours: string[] = ['#ea7a57', '#7fa900', '#5978ee', '#fec200', '#df5286', '#00bdae', '#865fcf', '#1aaa55'];

    public eventSettings: EventSettingsModel = {
        dataSource: <Object[]>extend([], this.shifts, null, true),
        fields: {
            id: 'Id',
            subject: { title: 'Vehicle', name: 'VehicleId' },
            location: { title: 'Location', name: 'Location' },
            description: { title: 'Description', name: 'Description' },
            startTime: { title: 'From', name: 'StartTime' },
            endTime: { title: 'To', name: 'EndTime' }
        }
    };

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
                    x.car.model + ' ' + x.car.id,
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

    // reloads the schedule by deleting all of its internal events and loading a new set of events from this.shifts
    refreshSchedule() {
        if (this.scheduleObj.getEvents.length > 0) {
            console.log('ASDF: deleting shifts');
            this.shifts.forEach(shift => {
                this.scheduleObj.deleteEvent(shift.id);
            });
        } else {
            console.log('ASDF: no shifts to delete');
        }
        this.scheduleObj.addEvent(this.shifts);
        console.log('ASDF: now have ' + this.scheduleObj.getEvents.length + ' events');
    }

    private onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }

    isReadOnly(endDate: Date): boolean {
        return endDate < new Date(Date.now());
    }

    // SYNCFUSION

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

    onActionBegin(args: ActionEventArgs): void {
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

    onRenderCell(args: RenderCellEventArgs): void {
        if (args.element.classList.contains('e-work-cells')) {
            if (args.date < new Date(2018, 6, 31, 0, 0)) {
                args.element.setAttribute('aria-readonly', 'true');
                args.element.classList.add('e-read-only-cells');
            }
        }
        if (args.elementType === 'emptyCells' && args.element.classList.contains('e-resource-left-td')) {
            const target: HTMLElement = args.element.querySelector('.e-resource-text') as HTMLElement;
            target.innerHTML = '<div class="lastName">Last Name</div><div class="firstName">First Name</div><div class="driverId">ID</div>';
        }
    }

    onEventRendered(args: EventRenderedArgs): void {
        const data: { [key: string]: Object } = args.data;
        if (this.isReadOnly(data.EndTime as Date)) {
            args.element.setAttribute('aria-readonly', 'true');
            args.element.classList.add('e-read-only');
        }
    }
}
