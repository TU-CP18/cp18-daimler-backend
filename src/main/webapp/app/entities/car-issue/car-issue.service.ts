import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared';
import { ICarIssue } from 'app/shared/model/car-issue.model';

type EntityResponseType = HttpResponse<ICarIssue>;
type EntityArrayResponseType = HttpResponse<ICarIssue[]>;

@Injectable({ providedIn: 'root' })
export class CarIssueService {
    public resourceUrl = SERVER_API_URL + 'api/car-issues';
    public resourceSearchUrl = SERVER_API_URL + 'api/_search/car-issues';

    constructor(private http: HttpClient) {}

    create(carIssue: ICarIssue): Observable<EntityResponseType> {
        return this.http.post<ICarIssue>(this.resourceUrl, carIssue, { observe: 'response' });
    }

    update(carIssue: ICarIssue): Observable<EntityResponseType> {
        return this.http.put<ICarIssue>(this.resourceUrl, carIssue, { observe: 'response' });
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<ICarIssue>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    query(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http.get<ICarIssue[]>(this.resourceUrl, { params: options, observe: 'response' });
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    search(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http.get<ICarIssue[]>(this.resourceSearchUrl, { params: options, observe: 'response' });
    }
}
