/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { CpdaimlerTestModule } from '../../../test.module';
import { CarIssueUpdateComponent } from 'app/entities/car-issue/car-issue-update.component';
import { CarIssueService } from 'app/entities/car-issue/car-issue.service';
import { CarIssue } from 'app/shared/model/car-issue.model';

describe('Component Tests', () => {
    describe('CarIssue Management Update Component', () => {
        let comp: CarIssueUpdateComponent;
        let fixture: ComponentFixture<CarIssueUpdateComponent>;
        let service: CarIssueService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [CpdaimlerTestModule],
                declarations: [CarIssueUpdateComponent]
            })
                .overrideTemplate(CarIssueUpdateComponent, '')
                .compileComponents();

            fixture = TestBed.createComponent(CarIssueUpdateComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(CarIssueService);
        });

        describe('save', () => {
            it(
                'Should call update service on save for existing entity',
                fakeAsync(() => {
                    // GIVEN
                    const entity = new CarIssue(123);
                    spyOn(service, 'update').and.returnValue(of(new HttpResponse({ body: entity })));
                    comp.carIssue = entity;
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
                    const entity = new CarIssue();
                    spyOn(service, 'create').and.returnValue(of(new HttpResponse({ body: entity })));
                    comp.carIssue = entity;
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
