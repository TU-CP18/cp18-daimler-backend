import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { JhiAlertService, JhiEventManager, JhiParseLinks } from 'ng-jhipster';
import { IUser, Principal, UserService } from 'app/core';
import { ChatService } from './';
import { ISafetyDriver } from 'app/shared/model/safety-driver.model';
import { SafetyDriverService } from '../safety-driver/safety-driver.service';
import { HttpErrorResponse, HttpHeaders, HttpResponse } from '@angular/common/http';
import { IChatMessage } from 'app/shared/model/chat-message.model';
import { ChatMessageService } from 'app/entities/chat-message';

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
    messages: Array<IChatMessage> = [];
    message = '';
    identity;
    IUser;
    selectedUser: IUser;

    constructor(
        private chatMessageService: ChatMessageService,
        private parseLinks: JhiParseLinks,
        private jhiAlertService: JhiAlertService,
        private principal: Principal,
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private eventManager: JhiEventManager,
        private chatService: ChatService,
        private safetyDriverService: SafetyDriverService,
        private userService: UserService
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
        // get user object of current user (FM)
        this.principal.identity().then(account => {
            this.userService.find(account.login).subscribe(
                backendUser => {
                    this.identity = backendUser.body;
                    console.log(this.identity);
                },
                () => {
                    console.log('Error retrieving backend user.');
                }
            );
        });
        // this.principal.identity().then((account) => {
        //     this.account = account;
        // });
        // this.registerAuthenticationSuccess();
        // this.registerLogoutSuccess();
    }

    private loadSafetyDrivers(data: ISafetyDriver[], headers: HttpHeaders) {
        // this.totalItems = parseInt(headers.get('X-Total-Count'), 10);
        this.safetyDrivers = data;
    }

    selectConversation(selectedUser) {
        this.chatService.connect(selectedUser);
        this.messages = [];
        this.selectedUser = selectedUser;
        this.chatMessageService
            .getHistory(selectedUser.id)
            .subscribe(this.loadChatHistory, (res: HttpErrorResponse) => this.onError(res.message));
        return;
    }

    loadChatHistory = response => {
        for (const msg in response.body) {
            this.messages.push(response.body[msg]);
        }
    };

    sendMessage(message) {
        if (message.length === 0) {
            return;
        }
        this.chatService.sendMessage(message);
        this.message = '';
    }

    onKeydown(event, message) {
        if (event.key === 'Enter') {
            this.sendMessage(message);
        }
    }

    ngOnDestroy() {}

    private onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }
}
