/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { CpdaimlerTestModule } from '../../../test.module';
import { CarLicenceDetailComponent } from 'app/entities/car-licence/car-licence-detail.component';
import { CarLicence } from 'app/shared/model/car-licence.model';

describe('Component Tests', () => {
    describe('CarLicence Management Detail Component', () => {
        let comp: CarLicenceDetailComponent;
        let fixture: ComponentFixture<CarLicenceDetailComponent>;
        const route = ({ data: of({ carLicence: new CarLicence(123) }) } as any) as ActivatedRoute;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [CpdaimlerTestModule],
                declarations: [CarLicenceDetailComponent],
                providers: [{ provide: ActivatedRoute, useValue: route }]
            })
                .overrideTemplate(CarLicenceDetailComponent, '')
                .compileComponents();
            fixture = TestBed.createComponent(CarLicenceDetailComponent);
            comp = fixture.componentInstance;
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(comp.carLicence).toEqual(jasmine.objectContaining({ id: 123 }));
            });
        });
    });
});
