import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared';
import { ISafetyDriver } from 'app/shared/model/safety-driver.model';

type EntityResponseType = HttpResponse<ISafetyDriver>;
type EntityArrayResponseType = HttpResponse<ISafetyDriver[]>;

@Injectable({ providedIn: 'root' })
export class SafetyDriverService {
    public resourceUrl = SERVER_API_URL + 'api/safety-drivers';
    public resourceSearchUrl = SERVER_API_URL + 'api/_search/safety-drivers';

    constructor(private http: HttpClient) {}

    create(safetyDriver: ISafetyDriver): Observable<EntityResponseType> {
        return this.http.post<ISafetyDriver>(this.resourceUrl, safetyDriver, { observe: 'response' });
    }

    update(safetyDriver: ISafetyDriver): Observable<EntityResponseType> {
        return this.http.put<ISafetyDriver>(this.resourceUrl, safetyDriver, { observe: 'response' });
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<ISafetyDriver>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    query(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http.get<ISafetyDriver[]>(this.resourceUrl, { params: options, observe: 'response' });
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    search(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http.get<ISafetyDriver[]>(this.resourceSearchUrl, { params: options, observe: 'response' });
    }

    getSafetyDriverStatistics(): Observable<HttpResponse<any>> {
        return this.http.get<any>(`${this.resourceUrl}/statistics`, { observe: 'response' });
    }
}
