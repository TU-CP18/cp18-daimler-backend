import { Component, Inject, ViewChild, ViewEncapsulation } from '@angular/core';
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
import { shiftData } from './datasource';

@Component({
    selector: 'jhi-schedule',
    templateUrl: './schedule.component.html',
    styleUrls: ['./schedule.css', 'material.css'],
    encapsulation: ViewEncapsulation.None
})
export class CPScheduleComponent {
    public selectedDate: Date = new Date(2018, 7, 1);
    public timeScale: TimeScaleModel = { interval: 60, slotCount: 1 };
    public workHours: WorkHoursModel = { start: '08:00', end: '20:00' };
    public currentView: View = 'TimelineWeek';
    public group: GroupModel = {
        enableCompactView: false,
        resources: ['Driver']
    };
    public resourceDataSource: Object[] = [
        { lastName: 'Kent', firstName: 'Clark', driverId: 1, color: '#ea7a57' },
        { lastName: 'Wayne', firstName: 'Bruce', driverId: 2, color: '#7fa900' },
        { lastName: 'Stark', firstName: 'Tony', driverId: 3, color: '#5978ee' },
        { lastName: 'Parker', firstName: 'Peter', driverId: 4, color: '#fec200' },
        { lastName: 'Romanov', firstName: 'Natasha', driverId: 5, color: '#df5286' },
        { lastName: 'Banner', firstName: 'Bruce', driverId: 6, color: '#00bdae' },
        { lastName: 'Xavier', firstName: 'Charles', driverId: 7, color: '#865fcf' },
        { lastName: 'Queen', firstName: 'Oliver', driverId: 8, color: '#1aaa55' },
        { lastName: 'Rogers', firstName: 'Steve', driverId: 9, color: '#df5286' },
        { lastName: 'Strange', firstName: 'Stephen', driverId: 10, color: '#710193' }
    ];

    // only allow one driver per shift
    public allowMultiple: Boolean = false;

    public eventSettings: EventSettingsModel = {
        dataSource: <Object[]>extend([], shiftData, null, true),
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

    isReadOnly(endDate: Date): boolean {
        return endDate < new Date(2018, 6, 31, 0, 0);
    }

    onPopupOpen(args: PopupOpenEventArgs): void {
        let data: { [key: string]: Object } = <{ [key: string]: Object }>args.data;
        if (args.type === 'QuickInfo' || args.type === 'Editor' || args.type === 'RecurrenceAlert' || args.type === 'DeleteAlert') {
            let target: HTMLElement =
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
            let data: { [key: string]: Object } = args.data as { [key: string]: Object };
            let groupIndex: number = this.scheduleObj.eventBase.getGroupIndexFromEvent(data);
            if (!this.scheduleObj.isSlotAvailable(data.StartTime as Date, data.EndTime as Date, groupIndex as number)) {
                args.cancel = true;
            }
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
            let target: HTMLElement = args.element.querySelector('.e-resource-text') as HTMLElement;
            target.innerHTML = '<div class="lastName">Last Name</div><div class="firstName">First Name</div><div class="driverId">ID</div>';
        }
    }

    onEventRendered(args: EventRenderedArgs): void {
        let data: { [key: string]: Object } = args.data;
        if (this.isReadOnly(data.EndTime as Date)) {
            args.element.setAttribute('aria-readonly', 'true');
            args.element.classList.add('e-read-only');
        }
    }
}
