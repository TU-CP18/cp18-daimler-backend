import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { ICarIssue } from 'app/shared/model/car-issue.model';
import { CarIssueService } from './car-issue.service';

@Component({
    selector: 'jhi-car-issue-delete-dialog',
    templateUrl: './car-issue-delete-dialog.component.html'
})
export class CarIssueDeleteDialogComponent {
    carIssue: ICarIssue;

    constructor(private carIssueService: CarIssueService, public activeModal: NgbActiveModal, private eventManager: JhiEventManager) {}

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.carIssueService.delete(id).subscribe(response => {
            this.eventManager.broadcast({
                name: 'carIssueListModification',
                content: 'Deleted an carIssue'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-car-issue-delete-popup',
    template: ''
})
export class CarIssueDeletePopupComponent implements OnInit, OnDestroy {
    private ngbModalRef: NgbModalRef;

    constructor(private activatedRoute: ActivatedRoute, private router: Router, private modalService: NgbModal) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ carIssue }) => {
            setTimeout(() => {
                this.ngbModalRef = this.modalService.open(CarIssueDeleteDialogComponent as Component, { size: 'lg', backdrop: 'static' });
                this.ngbModalRef.componentInstance.carIssue = carIssue;
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
