import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse, HttpHeaders, HttpResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { JhiEventManager, JhiParseLinks, JhiAlertService } from 'ng-jhipster';

import { ICar } from 'app/shared/model/car.model';
import { Principal } from 'app/core';

import { ITEMS_PER_PAGE } from 'app/shared';
import { CarService } from './car.service';

import { Chart } from 'chart.js';

@Component({
    selector: 'jhi-car',
    templateUrl: './car.component.html'
})
export class CarComponent implements OnInit, OnDestroy {
    currentAccount: any;
    cars: ICar[];
    error: any;
    success: any;
    eventSubscriber: Subscription;
    currentSearch: string;
    routeData: any;
    links: any;
    totalItems: any;
    queryCount: any;
    itemsPerPage: any;
    page: any;
    predicate: any;
    previousPage: any;
    reverse: any;
    originalCarList: ICar[];

    chart = [];

    numberDrivingEmpty: Number;
    numberDrivingFull: Number;
    numberMaintenance: Number;
    numberAvailable: Number;
    numberInactive: Number;

    constructor(
        private carService: CarService,
        private parseLinks: JhiParseLinks,
        private jhiAlertService: JhiAlertService,
        private principal: Principal,
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private eventManager: JhiEventManager
    ) {
        this.itemsPerPage = ITEMS_PER_PAGE;
        this.routeData = this.activatedRoute.data.subscribe(data => {
            this.page = data.pagingParams.page;
            this.previousPage = data.pagingParams.page;
            this.reverse = data.pagingParams.ascending;
            this.predicate = data.pagingParams.predicate;
        });
        this.currentSearch =
            this.activatedRoute.snapshot && this.activatedRoute.snapshot.params['search']
                ? this.activatedRoute.snapshot.params['search']
                : '';
    }

    loadAll() {
        if (this.currentSearch) {
            this.carService
                .search({
                    page: this.page - 1,
                    query: this.currentSearch,
                    size: this.itemsPerPage,
                    sort: this.sort()
                })
                .subscribe(
                    (res: HttpResponse<ICar[]>) => {
                        this.paginateCars(res.body, res.headers);
                    },
                    (res: HttpErrorResponse) => this.onError(res.message)
                );
            return;
        }
        this.carService
            .query({
                page: this.page - 1,
                size: this.itemsPerPage,
                sort: this.sort()
            })
            .subscribe(
                (res: HttpResponse<ICar[]>) => this.paginateCars(res.body, res.headers),
                (res: HttpErrorResponse) => this.onError(res.message)
            );
    }

    loadPage(page: number) {
        if (page !== this.previousPage) {
            this.previousPage = page;
            this.transition();
        }
    }

    transition() {
        this.router.navigate(['/car'], {
            queryParams: {
                page: this.page,
                size: this.itemsPerPage,
                search: this.currentSearch,
                sort: this.predicate + ',' + (this.reverse ? 'asc' : 'desc')
            }
        });
        this.loadAll();
    }

    clear() {
        this.page = 0;
        this.currentSearch = '';
        this.router.navigate([
            '/car',
            {
                page: this.page,
                sort: this.predicate + ',' + (this.reverse ? 'asc' : 'desc')
            }
        ]);
        this.loadAll();
    }

    search(query) {
        if (!query) {
            return this.clear();
        }
        this.page = 0;
        this.currentSearch = query;
        this.router.navigate([
            '/car',
            {
                search: this.currentSearch,
                page: this.page,
                sort: this.predicate + ',' + (this.reverse ? 'asc' : 'desc')
            }
        ]);
        this.loadAll();
    }

    ngOnInit() {
        this.loadAll();
        this.principal.identity().then(account => {
            this.currentAccount = account;
        });
        this.registerChangeInCars();

        // we should rewrite this code section
        // how about promise hell :D
        this.carService.countAvailable().subscribe(
            (res1: HttpResponse<Number>) => {
                this.numberAvailable = res1.body;
                this.carService.countDrivingEmpty().subscribe(
                    (res2: HttpResponse<Number>) => {
                        this.numberDrivingEmpty = res2.body;
                        this.carService.countMaintenance().subscribe(
                            (res3: HttpResponse<Number>) => {
                                this.numberMaintenance = res3.body;
                                this.carService.countDrivingFull().subscribe(
                                    (res4: HttpResponse<Number>) => {
                                        this.numberDrivingFull = res4.body;
                                        this.carService.countInactive().subscribe(
                                            (innerRes: HttpResponse<Number>) => {
                                                this.numberInactive = innerRes.body;
                                                this.createChart(this.cars);
                                            },
                                            (innerRes: HttpErrorResponse) => this.onError(innerRes.message)
                                        );
                                    },
                                    (res4: HttpErrorResponse) => this.onError(res4.message)
                                );
                            },
                            (res3: HttpErrorResponse) => this.onError(res3.message)
                        );
                    },
                    (res2: HttpErrorResponse) => this.onError(res2.message)
                );
            },
            (res1: HttpErrorResponse) => this.onError(res1.message)
        );
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: ICar) {
        return item.id;
    }

    registerChangeInCars() {
        this.eventSubscriber = this.eventManager.subscribe('carListModification', response => this.loadAll());
    }

    sort() {
        const result = [this.predicate + ',' + (this.reverse ? 'asc' : 'desc')];
        if (this.predicate !== 'id') {
            result.push('id');
        }
        return result;
    }

    private paginateCars(data: ICar[], headers: HttpHeaders) {
        this.links = this.parseLinks.parse(headers.get('link'));
        this.totalItems = parseInt(headers.get('X-Total-Count'), 10);
        this.queryCount = this.totalItems;
        this.cars = data;
        console.log(this.cars);
    }

    private onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }

    private createChart(data) {
        console.log(this.cars);

        this.chart = new Chart('canvas', {
            type: 'pie',
            data: {
                datasets: [
                    {
                        data: [
                            this.numberAvailable,
                            this.numberInactive,
                            this.numberDrivingFull,
                            this.numberDrivingEmpty,
                            this.numberMaintenance
                        ],
                        backgroundColor: ['#3e95cd', '#8e5ea2', '#43a234', '#1936a2', '#a20a15']
                    }
                ],
                // These labels appear in the legend and in the tooltips when hovering different arcs
                labels: ['available', 'inactive', 'driving with passenger', 'driving without passenger', 'maintenance']
            },
            options: {
                onClick: function oClick(e) {
                    const element = this.getElementAtEvent(e);

                    if (element.length) {
                        console.log(e);
                        this.cars.filter(car => car.status.toUpperCase() == element[0]._model.label.toUpperCase());
                    }
                }
            }
        });
    }
}
