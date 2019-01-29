import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { CpdaimlerSharedModule } from 'app/shared';
import { CpdaimlerAdminModule } from 'app/admin/admin.module';
import {
    ChatMessageComponent,
    ChatMessageDetailComponent,
    ChatMessageUpdateComponent,
    ChatMessageDeletePopupComponent,
    ChatMessageDeleteDialogComponent,
    chatMessageRoute,
    chatMessagePopupRoute
} from './';

const ENTITY_STATES = [...chatMessageRoute, ...chatMessagePopupRoute];

@NgModule({
    imports: [CpdaimlerSharedModule, CpdaimlerAdminModule, RouterModule.forChild(ENTITY_STATES)],
    declarations: [
        ChatMessageComponent,
        ChatMessageDetailComponent,
        ChatMessageUpdateComponent,
        ChatMessageDeleteDialogComponent,
        ChatMessageDeletePopupComponent
    ],
    entryComponents: [ChatMessageComponent, ChatMessageUpdateComponent, ChatMessageDeleteDialogComponent, ChatMessageDeletePopupComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CpdaimlerChatMessageModule {}
