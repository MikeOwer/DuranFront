import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearBancoComponent } from './crear-banco.component';

describe('CrearBancoComponent', () => {
  let component: CrearBancoComponent;
  let fixture: ComponentFixture<CrearBancoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrearBancoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrearBancoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
