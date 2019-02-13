import { CarService } from './car.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ICar } from 'app/shared/model/car.model';
import { ICarIssue } from 'app/shared/model/car-issue.model';
import { ICarCleanliness } from 'app/shared/model/car-cleanliness.model';
import { HttpErrorResponse, HttpHeaders, HttpResponse } from '@angular/common/http';
import { JhiEventManager, JhiParseLinks, JhiAlertService } from 'ng-jhipster';
import { NgbRatingConfig } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'jhi-car-detail',
    templateUrl: './car-detail.component.html'
})
export class CarDetailComponent implements OnInit {
    car: ICar;
    carIssues: ICarIssue[];
    carCleanLiness: ICarCleanliness[];

    constructor(
        private activatedRoute: ActivatedRoute,
        private carService: CarService,
        private jhiAlertService: JhiAlertService,
        private config: NgbRatingConfig
    ) {
        this.config.max = 5;
    }
    private onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ car }) => {
            this.car = car;
        });
        this.carService.getIssueForCar(this.car.id).subscribe(
            (res: HttpResponse<ICarIssue[]>) => {
                this.carIssues = res.body;
                console.log(res);
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
        this.carService.getCleanlinessForCar().subscribe(
            (res: HttpResponse<ICarCleanliness[]>) => {
                this.carCleanLiness = res.body.filter(data => data.car.id === this.car.id);
                console.log(res);
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
    }
    previousState() {
        window.history.back();
    }
    trackId(index: number, item: ICarIssue) {
        return item.id;
    }
    trackIdc(index: number, item: ICarCleanliness) {
        return item.id;
    }
}
