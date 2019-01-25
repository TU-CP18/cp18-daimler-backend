import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CpdaimlerSharedModule } from 'app/shared';
import { ChatComponent, chatRoute } from './';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import {
    MatAutocompleteModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatDatepickerModule,
    MatDialogModule,
    MatExpansionModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatSortModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    MatStepperModule
} from '@angular/material';

const ENTITY_STATES = [...chatRoute];

@NgModule({
    imports: [
        CpdaimlerSharedModule,
        RouterModule.forChild(ENTITY_STATES),
        BrowserAnimationsModule,
        FormsModule,
        HttpClientModule,
        MatTabsModule,
        MatCardModule,
        MatGridListModule,
        MatButtonModule,
        MatInputModule,
        MatListModule,
        MatIconModule,
        MatSidenavModule,
        MatProgressSpinnerModule,
        MatTooltipModule,
        MatDialogModule
    ],
    declarations: [ChatComponent],
    entryComponents: [ChatComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ChatModule {}
