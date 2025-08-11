import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TotalCarteraComponent } from './total-cartera.component';

describe('TotalCarteraComponent', () => {
  let component: TotalCarteraComponent;
  let fixture: ComponentFixture<TotalCarteraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TotalCarteraComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TotalCarteraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
