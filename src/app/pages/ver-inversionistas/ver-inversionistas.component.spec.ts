import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerInversionistasComponent } from './ver-inversionistas.component';

describe('VerInversionistasComponent', () => {
  let component: VerInversionistasComponent;
  let fixture: ComponentFixture<VerInversionistasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerInversionistasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerInversionistasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
