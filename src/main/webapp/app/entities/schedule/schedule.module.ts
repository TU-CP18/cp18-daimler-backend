import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { HttpModule, JsonpModule } from '@angular/http';

import { CpdaimlerSharedModule } from 'app/shared';
import { CPScheduleComponent, scheduleRoute } from './';

import { ScheduleAllModule, RecurrenceEditorAllModule } from '@syncfusion/ej2-angular-schedule';
import { NumericTextBoxAllModule } from '@syncfusion/ej2-angular-inputs';
import { DatePickerAllModule, TimePickerAllModule, DateTimePickerAllModule } from '@syncfusion/ej2-angular-calendars';
import { CheckBoxAllModule } from '@syncfusion/ej2-angular-buttons';
import { ToolbarAllModule, ContextMenuAllModule } from '@syncfusion/ej2-angular-navigations';
import { MaskedTextBoxModule } from '@syncfusion/ej2-angular-inputs';
import { DropDownListAllModule, MultiSelectAllModule } from '@syncfusion/ej2-angular-dropdowns';

const ENTITY_STATES = [...scheduleRoute];

@NgModule({
    imports: [
        CpdaimlerSharedModule,
        RouterModule.forChild(ENTITY_STATES),
        ScheduleAllModule,
        RecurrenceEditorAllModule,
        NumericTextBoxAllModule,
        DatePickerAllModule,
        TimePickerAllModule,
        DateTimePickerAllModule,
        CheckBoxAllModule,
        ToolbarAllModule,
        DropDownListAllModule,
        ContextMenuAllModule,
        MaskedTextBoxModule,
        MultiSelectAllModule,
        HttpModule,
        JsonpModule
    ],
    declarations: [CPScheduleComponent],
    entryComponents: [CPScheduleComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CpdaimlerScheduleModule {}
