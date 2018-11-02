import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { ICarLicence } from 'app/shared/model/car-licence.model';
import { CarLicenceService } from './car-licence.service';

@Component({
    selector: 'jhi-car-licence-delete-dialog',
    templateUrl: './car-licence-delete-dialog.component.html'
})
export class CarLicenceDeleteDialogComponent {
    carLicence: ICarLicence;

    constructor(private carLicenceService: CarLicenceService, public activeModal: NgbActiveModal, private eventManager: JhiEventManager) {}

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.carLicenceService.delete(id).subscribe(response => {
            this.eventManager.broadcast({
                name: 'carLicenceListModification',
                content: 'Deleted an carLicence'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-car-licence-delete-popup',
    template: ''
})
export class CarLicenceDeletePopupComponent implements OnInit, OnDestroy {
    private ngbModalRef: NgbModalRef;

    constructor(private activatedRoute: ActivatedRoute, private router: Router, private modalService: NgbModal) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ carLicence }) => {
            setTimeout(() => {
                this.ngbModalRef = this.modalService.open(CarLicenceDeleteDialogComponent as Component, { size: 'lg', backdrop: 'static' });
                this.ngbModalRef.componentInstance.carLicence = carLicence;
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
