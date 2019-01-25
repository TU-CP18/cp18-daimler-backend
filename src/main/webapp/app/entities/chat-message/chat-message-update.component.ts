import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { DATE_TIME_FORMAT } from 'app/shared/constants/input.constants';
import { JhiAlertService } from 'ng-jhipster';

import { IChatMessage } from 'app/shared/model/chat-message.model';
import { ChatMessageService } from './chat-message.service';
import { IUser, UserService } from 'app/core';

@Component({
    selector: 'jhi-chat-message-update',
    templateUrl: './chat-message-update.component.html'
})
export class ChatMessageUpdateComponent implements OnInit {
    chatMessage: IChatMessage;
    isSaving: boolean;

    users: IUser[];
    createdAt: string;

    constructor(
        private jhiAlertService: JhiAlertService,
        private chatMessageService: ChatMessageService,
        private userService: UserService,
        private activatedRoute: ActivatedRoute
    ) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ chatMessage }) => {
            this.chatMessage = chatMessage;
            this.createdAt = this.chatMessage.createdAt != null ? this.chatMessage.createdAt.format(DATE_TIME_FORMAT) : null;
        });
        this.userService.query().subscribe(
            (res: HttpResponse<IUser[]>) => {
                this.users = res.body;
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
    }

    previousState() {
        window.history.back();
    }

    save() {
        this.isSaving = true;
        this.chatMessage.createdAt = this.createdAt != null ? moment(this.createdAt, DATE_TIME_FORMAT) : null;
        if (this.chatMessage.id !== undefined) {
            this.subscribeToSaveResponse(this.chatMessageService.update(this.chatMessage));
        } else {
            this.subscribeToSaveResponse(this.chatMessageService.create(this.chatMessage));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<IChatMessage>>) {
        result.subscribe((res: HttpResponse<IChatMessage>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
    }

    private onSaveSuccess() {
        this.isSaving = false;
        this.previousState();
    }

    private onSaveError() {
        this.isSaving = false;
    }

    private onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }

    trackUserById(index: number, item: IUser) {
        return item.id;
    }
}
