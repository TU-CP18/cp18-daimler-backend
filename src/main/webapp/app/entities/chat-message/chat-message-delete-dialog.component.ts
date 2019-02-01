import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IChatMessage } from 'app/shared/model/chat-message.model';
import { ChatMessageService } from './chat-message.service';

@Component({
    selector: 'jhi-chat-message-delete-dialog',
    templateUrl: './chat-message-delete-dialog.component.html'
})
export class ChatMessageDeleteDialogComponent {
    chatMessage: IChatMessage;

    constructor(
        private chatMessageService: ChatMessageService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager
    ) {}

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.chatMessageService.delete(id).subscribe(response => {
            this.eventManager.broadcast({
                name: 'chatMessageListModification',
                content: 'Deleted an chatMessage'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-chat-message-delete-popup',
    template: ''
})
export class ChatMessageDeletePopupComponent implements OnInit, OnDestroy {
    private ngbModalRef: NgbModalRef;

    constructor(private activatedRoute: ActivatedRoute, private router: Router, private modalService: NgbModal) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ chatMessage }) => {
            setTimeout(() => {
                this.ngbModalRef = this.modalService.open(ChatMessageDeleteDialogComponent as Component, {
                    size: 'lg',
                    backdrop: 'static'
                });
                this.ngbModalRef.componentInstance.chatMessage = chatMessage;
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
