import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { CpdaimlerSharedModule } from 'app/shared';
import { ChatComponent, chatRoute } from './';

const ENTITY_STATES = [...chatRoute];

@NgModule({
    imports: [CpdaimlerSharedModule, RouterModule.forChild(ENTITY_STATES)],
    declarations: [ChatComponent],
    entryComponents: [ChatComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ChatModule {}
