/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { CpdaimlerTestModule } from '../../../test.module';
import { SafetyDriverDetailComponent } from 'app/entities/safety-driver/safety-driver-detail.component';
import { SafetyDriver } from 'app/shared/model/safety-driver.model';

describe('Component Tests', () => {
    describe('SafetyDriver Management Detail Component', () => {
        let comp: SafetyDriverDetailComponent;
        let fixture: ComponentFixture<SafetyDriverDetailComponent>;
        const route = ({ data: of({ safetyDriver: new SafetyDriver(123) }) } as any) as ActivatedRoute;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [CpdaimlerTestModule],
                declarations: [SafetyDriverDetailComponent],
                providers: [{ provide: ActivatedRoute, useValue: route }]
            })
                .overrideTemplate(SafetyDriverDetailComponent, '')
                .compileComponents();
            fixture = TestBed.createComponent(SafetyDriverDetailComponent);
            comp = fixture.componentInstance;
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(comp.safetyDriver).toEqual(jasmine.objectContaining({ id: 123 }));
            });
        });
    });
});
