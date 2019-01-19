import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { JhiAlertService, JhiEventManager, JhiParseLinks } from 'ng-jhipster';
import { Principal } from 'app/core';
import { ChatService } from './';

@Component({
    selector: 'jhi-chat',
    templateUrl: './chat.component.html',
    styleUrls: ['./chat.css']
})
export class ChatComponent implements OnInit, OnDestroy {
    error: any;
    success: any;

    chart = [];
    messages: Array<Object> = [];
    message = '';
    identity = 'backenduser';

    constructor(
        private parseLinks: JhiParseLinks,
        private jhiAlertService: JhiAlertService,
        private principal: Principal,
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private eventManager: JhiEventManager,
        private chatService: ChatService
    ) {}

    ngOnInit() {
        this.chatService.connect();

        this.chatService.receive().subscribe(message => {
            this.messages.push(message);
        });

        // this.principal.identity().then((account) => {
        //     this.account = account;
        // });
        // this.registerAuthenticationSuccess();
        // this.registerLogoutSuccess();
    }

    sendMessage(message) {
        if (message.length === 0) {
            return;
        }
        console.log('COMP SEND MESSAGE:', message);
        this.chatService.sendMessage(message);
        this.message = '';
        console.log(this.messages);
    }

    onKeydown(event, message) {
        if (event.key === 'Enter') {
            console.log(event);
            this.sendMessage(message);
        }
    }

    ngOnDestroy() {}

    private onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }
}
