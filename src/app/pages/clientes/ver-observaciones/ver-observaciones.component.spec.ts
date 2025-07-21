import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerObservacionesComponent } from './ver-observaciones.component';

describe('VerObservacionesComponent', () => {
  let component: VerObservacionesComponent;
  let fixture: ComponentFixture<VerObservacionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerObservacionesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerObservacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
