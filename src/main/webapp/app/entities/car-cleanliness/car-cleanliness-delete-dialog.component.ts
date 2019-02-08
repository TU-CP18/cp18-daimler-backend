import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { ICarCleanliness } from 'app/shared/model/car-cleanliness.model';
import { CarCleanlinessService } from './car-cleanliness.service';

@Component({
    selector: 'jhi-car-cleanliness-delete-dialog',
    templateUrl: './car-cleanliness-delete-dialog.component.html'
})
export class CarCleanlinessDeleteDialogComponent {
    carCleanliness: ICarCleanliness;

    constructor(
        private carCleanlinessService: CarCleanlinessService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager
    ) {}

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.carCleanlinessService.delete(id).subscribe(response => {
            this.eventManager.broadcast({
                name: 'carCleanlinessListModification',
                content: 'Deleted an carCleanliness'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-car-cleanliness-delete-popup',
    template: ''
})
export class CarCleanlinessDeletePopupComponent implements OnInit, OnDestroy {
    private ngbModalRef: NgbModalRef;

    constructor(private activatedRoute: ActivatedRoute, private router: Router, private modalService: NgbModal) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ carCleanliness }) => {
            setTimeout(() => {
                this.ngbModalRef = this.modalService.open(CarCleanlinessDeleteDialogComponent as Component, {
                    size: 'lg',
                    backdrop: 'static'
                });
                this.ngbModalRef.componentInstance.carCleanliness = carCleanliness;
                this.ngbModalRef.result.then(
                    result => {
                        this.router.navigate([{ outlets: { popup: null } }], { replaceUrl: true, queryParamsHandling: 'merge' });
                        this.ngbModalRef = null;
                    },
                    reason => {
                        this.router.navigate([{ outlets: { popup: null } }], { replaceUrl: true, queryParamsHandling: 'merge' });
                        this.ngbModalRef = null;
                    }
                );
            }, 0);
        });
    }

    ngOnDestroy() {
        this.ngbModalRef = null;
    }
}
