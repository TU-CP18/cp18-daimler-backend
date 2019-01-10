import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { ISafetyDriver } from 'app/shared/model/safety-driver.model';

type EntityResponseType = HttpResponse<ISafetyDriver>;
type EntityArrayResponseType = HttpResponse<ISafetyDriver[]>;

@Injectable({ providedIn: 'root' })
export class ChatService {
    constructor(private http: HttpClient) {}
}
