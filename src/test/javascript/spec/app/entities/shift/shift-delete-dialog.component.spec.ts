/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, of } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';

import { CpdaimlerTestModule } from '../../../test.module';
import { ShiftDeleteDialogComponent } from 'app/entities/shift/shift-delete-dialog.component';
import { ShiftService } from 'app/entities/shift/shift.service';

describe('Component Tests', () => {
    describe('Shift Management Delete Component', () => {
        let comp: ShiftDeleteDialogComponent;
        let fixture: ComponentFixture<ShiftDeleteDialogComponent>;
        let service: ShiftService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [CpdaimlerTestModule],
                declarations: [ShiftDeleteDialogComponent]
            })
                .overrideTemplate(ShiftDeleteDialogComponent, '')
                .compileComponents();
            fixture = TestBed.createComponent(ShiftDeleteDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(ShiftService);
            mockEventManager = fixture.debugElement.injector.get(JhiEventManager);
            mockActiveModal = fixture.debugElement.injector.get(NgbActiveModal);
        });

        describe('confirmDelete', () => {
            it(
                'Should call delete service on confirmDelete',
                inject(
                    [],
                    fakeAsync(() => {
                        // GIVEN
                        spyOn(service, 'delete').and.returnValue(of({}));

                        // WHEN
                        comp.confirmDelete(123);
                        tick();

                        // THEN
                        expect(service.delete).toHaveBeenCalledWith(123);
                        expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
                        expect(mockEventManager.broadcastSpy).toHaveBeenCalled();
                    })
                )
            );
        });
    });
});
