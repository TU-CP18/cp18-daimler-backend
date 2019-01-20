import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { JhiAlertService, JhiEventManager, JhiParseLinks } from 'ng-jhipster';
import { Principal } from 'app/core';
import { ChatService } from './';
import { ISafetyDriver } from 'app/shared/model/safety-driver.model';
import { SafetyDriverService } from '../safety-driver/safety-driver.service';
import { HttpErrorResponse, HttpHeaders, HttpResponse } from '@angular/common/http';

@Component({
    selector: 'jhi-chat',
    templateUrl: './chat.component.html',
    styleUrls: ['./chat.css']
})
export class ChatComponent implements OnInit, OnDestroy {
    error: any;
    success: any;

    // chart = [];
    safetyDrivers: ISafetyDriver[];
    messages: Array<Object> = [];
    message = '';
    identity = 'backenduser';
    selectedUser = null;

    constructor(
        private parseLinks: JhiParseLinks,
        private jhiAlertService: JhiAlertService,
        private principal: Principal,
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private eventManager: JhiEventManager,
        private chatService: ChatService,
        private safetyDriverService: SafetyDriverService
    ) {}

    ngOnInit() {
        // this.chatService.connect();

        this.chatService.receive().subscribe(message => {
            this.messages.push(message);
        });

        this.safetyDriverService
            .query({
                // sort: this.sort()
            })
            .subscribe(
                (res: HttpResponse<ISafetyDriver[]>) => this.loadSafetyDrivers(res.body, res.headers),
                (res: HttpErrorResponse) => this.onError(res.message)
            );

        // this.principal.identity().then((account) => {
        //     this.account = account;
        // });
        // this.registerAuthenticationSuccess();
        // this.registerLogoutSuccess();
    }

    private loadSafetyDrivers(data: ISafetyDriver[], headers: HttpHeaders) {
        // this.totalItems = parseInt(headers.get('X-Total-Count'), 10);
        this.safetyDrivers = data;
        // console.log('storeSafetyDrivers:');
        // console.log(this.safetyDrivers);
    }

    selectConversation(selectedUser) {
        this.chatService.connect(selectedUser.id);
        this.messages = [];
        this.selectedUser = selectedUser;
    }

    sendMessage(message) {
        if (message.length === 0) {
            return;
        }
        // console.log('COMP SEND MESSAGE:', message);
        this.chatService.sendMessage(message);
        this.message = '';
        // console.log(this.messages);
    }

    onKeydown(event, message) {
        if (event.key === 'Enter') {
            // console.log(event);
            this.sendMessage(message);
        }
    }

    ngOnDestroy() {}

    private onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }
}
