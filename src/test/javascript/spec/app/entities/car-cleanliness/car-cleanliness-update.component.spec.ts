/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { CpdaimlerTestModule } from '../../../test.module';
import { CarCleanlinessUpdateComponent } from 'app/entities/car-cleanliness/car-cleanliness-update.component';
import { CarCleanlinessService } from 'app/entities/car-cleanliness/car-cleanliness.service';
import { CarCleanliness } from 'app/shared/model/car-cleanliness.model';

describe('Component Tests', () => {
    describe('CarCleanliness Management Update Component', () => {
        let comp: CarCleanlinessUpdateComponent;
        let fixture: ComponentFixture<CarCleanlinessUpdateComponent>;
        let service: CarCleanlinessService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [CpdaimlerTestModule],
                declarations: [CarCleanlinessUpdateComponent]
            })
                .overrideTemplate(CarCleanlinessUpdateComponent, '')
                .compileComponents();

            fixture = TestBed.createComponent(CarCleanlinessUpdateComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(CarCleanlinessService);
        });

        describe('save', () => {
            it(
                'Should call update service on save for existing entity',
                fakeAsync(() => {
                    // GIVEN
                    const entity = new CarCleanliness(123);
                    spyOn(service, 'update').and.returnValue(of(new HttpResponse({ body: entity })));
                    comp.carCleanliness = entity;
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
                    const entity = new CarCleanliness();
                    spyOn(service, 'create').and.returnValue(of(new HttpResponse({ body: entity })));
                    comp.carCleanliness = entity;
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
