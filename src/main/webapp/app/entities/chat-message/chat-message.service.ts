import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { DATE_FORMAT } from 'app/shared/constants/input.constants';
import { map } from 'rxjs/operators';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared';
import { IChatMessage } from 'app/shared/model/chat-message.model';

type EntityResponseType = HttpResponse<IChatMessage>;
type EntityArrayResponseType = HttpResponse<IChatMessage[]>;

@Injectable({ providedIn: 'root' })
export class ChatMessageService {
    public resourceUrl = SERVER_API_URL + 'api/chat-messages';
    public resourceSearchUrl = SERVER_API_URL + 'api/_search/chat-messages';

    constructor(private http: HttpClient) {}

    create(chatMessage: IChatMessage): Observable<EntityResponseType> {
        const copy = this.convertDateFromClient(chatMessage);
        return this.http
            .post<IChatMessage>(this.resourceUrl, copy, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    update(chatMessage: IChatMessage): Observable<EntityResponseType> {
        const copy = this.convertDateFromClient(chatMessage);
        return this.http
            .put<IChatMessage>(this.resourceUrl, copy, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http
            .get<IChatMessage>(`${this.resourceUrl}/${id}`, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    getHistory(id: number): Observable<EntityResponseType> {
        return this.http
            .get<IChatMessage>(`${this.resourceUrl}/history/${id}`, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    query(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http
            .get<IChatMessage[]>(this.resourceUrl, { params: options, observe: 'response' })
            .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    search(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http
            .get<IChatMessage[]>(this.resourceSearchUrl, { params: options, observe: 'response' })
            .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
    }

    private convertDateFromClient(chatMessage: IChatMessage): IChatMessage {
        const copy: IChatMessage = Object.assign({}, chatMessage, {
            createdAt: chatMessage.createdAt != null && chatMessage.createdAt.isValid() ? chatMessage.createdAt.toJSON() : null
        });
        return copy;
    }

    private convertDateFromServer(res: EntityResponseType): EntityResponseType {
        res.body.createdAt = res.body.createdAt != null ? moment(res.body.createdAt) : null;
        return res;
    }

    private convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
        res.body.forEach((chatMessage: IChatMessage) => {
            chatMessage.createdAt = chatMessage.createdAt != null ? moment(chatMessage.createdAt) : null;
        });
        return res;
    }
}
