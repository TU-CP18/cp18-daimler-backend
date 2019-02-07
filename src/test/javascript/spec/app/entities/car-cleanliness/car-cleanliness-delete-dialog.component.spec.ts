/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, of } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';

import { CpdaimlerTestModule } from '../../../test.module';
import { CarCleanlinessDeleteDialogComponent } from 'app/entities/car-cleanliness/car-cleanliness-delete-dialog.component';
import { CarCleanlinessService } from 'app/entities/car-cleanliness/car-cleanliness.service';

describe('Component Tests', () => {
    describe('CarCleanliness Management Delete Component', () => {
        let comp: CarCleanlinessDeleteDialogComponent;
        let fixture: ComponentFixture<CarCleanlinessDeleteDialogComponent>;
        let service: CarCleanlinessService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [CpdaimlerTestModule],
                declarations: [CarCleanlinessDeleteDialogComponent]
            })
                .overrideTemplate(CarCleanlinessDeleteDialogComponent, '')
                .compileComponents();
            fixture = TestBed.createComponent(CarCleanlinessDeleteDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(CarCleanlinessService);
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
