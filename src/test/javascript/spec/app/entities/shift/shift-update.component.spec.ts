/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { CpdaimlerTestModule } from '../../../test.module';
import { ShiftUpdateComponent } from 'app/entities/shift/shift-update.component';
import { ShiftService } from 'app/entities/shift/shift.service';
import { Shift } from 'app/shared/model/shift.model';

describe('Component Tests', () => {
    describe('Shift Management Update Component', () => {
        let comp: ShiftUpdateComponent;
        let fixture: ComponentFixture<ShiftUpdateComponent>;
        let service: ShiftService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [CpdaimlerTestModule],
                declarations: [ShiftUpdateComponent]
            })
                .overrideTemplate(ShiftUpdateComponent, '')
                .compileComponents();

            fixture = TestBed.createComponent(ShiftUpdateComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(ShiftService);
        });

        describe('save', () => {
            it(
                'Should call update service on save for existing entity',
                fakeAsync(() => {
                    // GIVEN
                    const entity = new Shift(123);
                    spyOn(service, 'update').and.returnValue(of(new HttpResponse({ body: entity })));
                    comp.shift = entity;
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
                    const entity = new Shift();
                    spyOn(service, 'create').and.returnValue(of(new HttpResponse({ body: entity })));
                    comp.shift = entity;
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
