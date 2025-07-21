import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadCarsComponent } from './upload-cars.component';

describe('UploadCarsComponent', () => {
  let component: UploadCarsComponent;
  let fixture: ComponentFixture<UploadCarsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UploadCarsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UploadCarsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
