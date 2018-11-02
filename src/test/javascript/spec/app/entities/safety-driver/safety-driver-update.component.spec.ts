/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { CpdaimlerTestModule } from '../../../test.module';
import { SafetyDriverUpdateComponent } from 'app/entities/safety-driver/safety-driver-update.component';
import { SafetyDriverService } from 'app/entities/safety-driver/safety-driver.service';
import { SafetyDriver } from 'app/shared/model/safety-driver.model';

describe('Component Tests', () => {
    describe('SafetyDriver Management Update Component', () => {
        let comp: SafetyDriverUpdateComponent;
        let fixture: ComponentFixture<SafetyDriverUpdateComponent>;
        let service: SafetyDriverService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [CpdaimlerTestModule],
                declarations: [SafetyDriverUpdateComponent]
            })
                .overrideTemplate(SafetyDriverUpdateComponent, '')
                .compileComponents();

            fixture = TestBed.createComponent(SafetyDriverUpdateComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(SafetyDriverService);
        });

        describe('save', () => {
            it(
                'Should call update service on save for existing entity',
                fakeAsync(() => {
                    // GIVEN
                    const entity = new SafetyDriver(123);
                    spyOn(service, 'update').and.returnValue(of(new HttpResponse({ body: entity })));
                    comp.safetyDriver = entity;
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
                    const entity = new SafetyDriver();
                    spyOn(service, 'create').and.returnValue(of(new HttpResponse({ body: entity })));
                    comp.safetyDriver = entity;
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
