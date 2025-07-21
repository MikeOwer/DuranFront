import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PagosExtraordinariosComponent } from './pagos-extraordinarios.component';

describe('PagosExtraordinariosComponent', () => {
  let component: PagosExtraordinariosComponent;
  let fixture: ComponentFixture<PagosExtraordinariosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PagosExtraordinariosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PagosExtraordinariosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
