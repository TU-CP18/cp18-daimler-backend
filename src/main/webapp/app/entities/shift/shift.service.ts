import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared';
import { IShift } from 'app/shared/model/shift.model';

type EntityResponseType = HttpResponse<IShift>;
type EntityArrayResponseType = HttpResponse<IShift[]>;

@Injectable({ providedIn: 'root' })
export class ShiftService {
    public resourceUrl = SERVER_API_URL + 'api/shifts';
    public resourceSearchUrl = SERVER_API_URL + 'api/_search/shifts';

    constructor(private http: HttpClient) {}

    create(shift: IShift): Observable<EntityResponseType> {
        return this.http.post<IShift>(this.resourceUrl, shift, { observe: 'response' });
    }

    update(shift: IShift): Observable<EntityResponseType> {
        return this.http.put<IShift>(this.resourceUrl, shift, { observe: 'response' });
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<IShift>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    query(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http.get<IShift[]>(this.resourceUrl, { params: options, observe: 'response' });
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    search(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http.get<IShift[]>(this.resourceSearchUrl, { params: options, observe: 'response' });
    }
}
