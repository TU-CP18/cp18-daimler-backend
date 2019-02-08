import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { DATE_FORMAT } from 'app/shared/constants/input.constants';
import { map } from 'rxjs/operators';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared';
import { ICarCleanliness } from 'app/shared/model/car-cleanliness.model';

type EntityResponseType = HttpResponse<ICarCleanliness>;
type EntityArrayResponseType = HttpResponse<ICarCleanliness[]>;

@Injectable({ providedIn: 'root' })
export class CarCleanlinessService {
    public resourceUrl = SERVER_API_URL + 'api/car-cleanlinesses';
    public resourceSearchUrl = SERVER_API_URL + 'api/_search/car-cleanlinesses';

    constructor(private http: HttpClient) {}

    create(carCleanliness: ICarCleanliness): Observable<EntityResponseType> {
        const copy = this.convertDateFromClient(carCleanliness);
        return this.http
            .post<ICarCleanliness>(this.resourceUrl, copy, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    update(carCleanliness: ICarCleanliness): Observable<EntityResponseType> {
        const copy = this.convertDateFromClient(carCleanliness);
        return this.http
            .put<ICarCleanliness>(this.resourceUrl, copy, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http
            .get<ICarCleanliness>(`${this.resourceUrl}/${id}`, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    query(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http
            .get<ICarCleanliness[]>(this.resourceUrl, { params: options, observe: 'response' })
            .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    search(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http
            .get<ICarCleanliness[]>(this.resourceSearchUrl, { params: options, observe: 'response' })
            .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
    }

    private convertDateFromClient(carCleanliness: ICarCleanliness): ICarCleanliness {
        const copy: ICarCleanliness = Object.assign({}, carCleanliness, {
            createdAt: carCleanliness.createdAt != null && carCleanliness.createdAt.isValid() ? carCleanliness.createdAt.toJSON() : null
        });
        return copy;
    }

    private convertDateFromServer(res: EntityResponseType): EntityResponseType {
        res.body.createdAt = res.body.createdAt != null ? moment(res.body.createdAt) : null;
        return res;
    }

    private convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
        res.body.forEach((carCleanliness: ICarCleanliness) => {
            carCleanliness.createdAt = carCleanliness.createdAt != null ? moment(carCleanliness.createdAt) : null;
        });
        return res;
    }
}
