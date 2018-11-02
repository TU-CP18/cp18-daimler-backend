/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, of } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';

import { CpdaimlerTestModule } from '../../../test.module';
import { SafetyDriverDeleteDialogComponent } from 'app/entities/safety-driver/safety-driver-delete-dialog.component';
import { SafetyDriverService } from 'app/entities/safety-driver/safety-driver.service';

describe('Component Tests', () => {
    describe('SafetyDriver Management Delete Component', () => {
        let comp: SafetyDriverDeleteDialogComponent;
        let fixture: ComponentFixture<SafetyDriverDeleteDialogComponent>;
        let service: SafetyDriverService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [CpdaimlerTestModule],
                declarations: [SafetyDriverDeleteDialogComponent]
            })
                .overrideTemplate(SafetyDriverDeleteDialogComponent, '')
                .compileComponents();
            fixture = TestBed.createComponent(SafetyDriverDeleteDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(SafetyDriverService);
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
