import { Routes } from '@angular/router';
import { JhiResolvePagingParams } from 'ng-jhipster';
import { UserRouteAccessService } from 'app/core';
import { ChatComponent } from 'app/entities/chat/chat.component';

export const chatRoute: Routes = [
    {
        path: 'chat',
        component: ChatComponent,
        data: {
            authorities: ['ROLE_ADMIN'],
            pageTitle: 'Chat'
        },
        canActivate: [UserRouteAccessService]
    }
];
