import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared';
import { ICarLicence } from 'app/shared/model/car-licence.model';

type EntityResponseType = HttpResponse<ICarLicence>;
type EntityArrayResponseType = HttpResponse<ICarLicence[]>;

@Injectable({ providedIn: 'root' })
export class CarLicenceService {
    public resourceUrl = SERVER_API_URL + 'api/car-licences';
    public resourceSearchUrl = SERVER_API_URL + 'api/_search/car-licences';

    constructor(private http: HttpClient) {}

    create(carLicence: ICarLicence): Observable<EntityResponseType> {
        return this.http.post<ICarLicence>(this.resourceUrl, carLicence, { observe: 'response' });
    }

    update(carLicence: ICarLicence): Observable<EntityResponseType> {
        return this.http.put<ICarLicence>(this.resourceUrl, carLicence, { observe: 'response' });
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<ICarLicence>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    query(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http.get<ICarLicence[]>(this.resourceUrl, { params: options, observe: 'response' });
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    search(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http.get<ICarLicence[]>(this.resourceSearchUrl, { params: options, observe: 'response' });
    }
}
