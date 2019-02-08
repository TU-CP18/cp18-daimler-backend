/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { CpdaimlerTestModule } from '../../../test.module';
import { CarCleanlinessDetailComponent } from 'app/entities/car-cleanliness/car-cleanliness-detail.component';
import { CarCleanliness } from 'app/shared/model/car-cleanliness.model';

describe('Component Tests', () => {
    describe('CarCleanliness Management Detail Component', () => {
        let comp: CarCleanlinessDetailComponent;
        let fixture: ComponentFixture<CarCleanlinessDetailComponent>;
        const route = ({ data: of({ carCleanliness: new CarCleanliness(123) }) } as any) as ActivatedRoute;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [CpdaimlerTestModule],
                declarations: [CarCleanlinessDetailComponent],
                providers: [{ provide: ActivatedRoute, useValue: route }]
            })
                .overrideTemplate(CarCleanlinessDetailComponent, '')
                .compileComponents();
            fixture = TestBed.createComponent(CarCleanlinessDetailComponent);
            comp = fixture.componentInstance;
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(comp.carCleanliness).toEqual(jasmine.objectContaining({ id: 123 }));
            });
        });
    });
});
