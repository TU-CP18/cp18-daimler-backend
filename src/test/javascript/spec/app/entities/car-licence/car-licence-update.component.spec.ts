/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { CpdaimlerTestModule } from '../../../test.module';
import { CarLicenceUpdateComponent } from 'app/entities/car-licence/car-licence-update.component';
import { CarLicenceService } from 'app/entities/car-licence/car-licence.service';
import { CarLicence } from 'app/shared/model/car-licence.model';

describe('Component Tests', () => {
    describe('CarLicence Management Update Component', () => {
        let comp: CarLicenceUpdateComponent;
        let fixture: ComponentFixture<CarLicenceUpdateComponent>;
        let service: CarLicenceService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [CpdaimlerTestModule],
                declarations: [CarLicenceUpdateComponent]
            })
                .overrideTemplate(CarLicenceUpdateComponent, '')
                .compileComponents();

            fixture = TestBed.createComponent(CarLicenceUpdateComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(CarLicenceService);
        });

        describe('save', () => {
            it(
                'Should call update service on save for existing entity',
                fakeAsync(() => {
                    // GIVEN
                    const entity = new CarLicence(123);
                    spyOn(service, 'update').and.returnValue(of(new HttpResponse({ body: entity })));
                    comp.carLicence = entity;
                    // WHEN
                    comp.save();
                    tick(); // simulate async

                    // THEN
                    expect(service.update).toHaveBeenCalledWith(entity);
                    expect(comp.isSaving).toEqual(false);
                })
            );

            it(
                'Should call create service on save for new entity',
                fakeAsync(() => {
                    // GIVEN
                    const entity = new CarLicence();
                    spyOn(service, 'create').and.returnValue(of(new HttpResponse({ body: entity })));
                    comp.carLicence = entity;
                    // WHEN
                    comp.save();
                    tick(); // simulate async

                    // THEN
                    expect(service.create).toHaveBeenCalledWith(entity);
                    expect(comp.isSaving).toEqual(false);
                })
            );
        });
    });
});
