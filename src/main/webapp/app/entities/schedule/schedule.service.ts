import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { IShift } from 'app/shared/model/shift.model';

type EntityResponseType = HttpResponse<IShift>;
type EntityArrayResponseType = HttpResponse<IShift[]>;

@Injectable({ providedIn: 'root' })
export class ScheduleService {
    constructor(private http: HttpClient) {}
}
