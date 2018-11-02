/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, of } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';

import { CpdaimlerTestModule } from '../../../test.module';
import { CarLicenceDeleteDialogComponent } from 'app/entities/car-licence/car-licence-delete-dialog.component';
import { CarLicenceService } from 'app/entities/car-licence/car-licence.service';

describe('Component Tests', () => {
    describe('CarLicence Management Delete Component', () => {
        let comp: CarLicenceDeleteDialogComponent;
        let fixture: ComponentFixture<CarLicenceDeleteDialogComponent>;
        let service: CarLicenceService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [CpdaimlerTestModule],
                declarations: [CarLicenceDeleteDialogComponent]
            })
                .overrideTemplate(CarLicenceDeleteDialogComponent, '')
                .compileComponents();
            fixture = TestBed.createComponent(CarLicenceDeleteDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(CarLicenceService);
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
