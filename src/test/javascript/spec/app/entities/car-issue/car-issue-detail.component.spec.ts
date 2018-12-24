/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { CpdaimlerTestModule } from '../../../test.module';
import { CarIssueDetailComponent } from 'app/entities/car-issue/car-issue-detail.component';
import { CarIssue } from 'app/shared/model/car-issue.model';

describe('Component Tests', () => {
    describe('CarIssue Management Detail Component', () => {
        let comp: CarIssueDetailComponent;
        let fixture: ComponentFixture<CarIssueDetailComponent>;
        const route = ({ data: of({ carIssue: new CarIssue(123) }) } as any) as ActivatedRoute;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [CpdaimlerTestModule],
                declarations: [CarIssueDetailComponent],
                providers: [{ provide: ActivatedRoute, useValue: route }]
            })
                .overrideTemplate(CarIssueDetailComponent, '')
                .compileComponents();
            fixture = TestBed.createComponent(CarIssueDetailComponent);
            comp = fixture.componentInstance;
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(comp.carIssue).toEqual(jasmine.objectContaining({ id: 123 }));
            });
        });
    });
});
