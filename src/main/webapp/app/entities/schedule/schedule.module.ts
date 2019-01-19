import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { CpdaimlerSharedModule } from 'app/shared';
import { CPScheduleComponent, scheduleRoute } from './';

import { HttpModule, JsonpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';

import { ButtonModule } from '@syncfusion/ej2-angular-buttons';
import { ListViewModule } from '@syncfusion/ej2-angular-lists';
import { DropDownListModule } from '@syncfusion/ej2-angular-dropdowns';
import { TreeViewModule, TabModule } from '@syncfusion/ej2-angular-navigations';
import { RichTextEditorAllModule } from '@syncfusion/ej2-angular-richtexteditor';

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
        CommonModule,
        CpdaimlerSharedModule,
        RouterModule.forChild(ENTITY_STATES),
        HttpModule,
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
        JsonpModule,
        BrowserModule,
        ButtonModule,
        ListViewModule,
        DropDownListModule,
        TreeViewModule,
        TabModule,
        RichTextEditorAllModule
    ],
    declarations: [CPScheduleComponent],
    entryComponents: [CPScheduleComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CpdaimlerScheduleModule {}
