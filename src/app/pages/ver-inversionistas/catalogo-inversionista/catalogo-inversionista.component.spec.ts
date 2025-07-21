import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CatalogoInversionistaComponent } from './catalogo-inversionista.component';

describe('CatalogoInversionistaComponent', () => {
  let component: CatalogoInversionistaComponent;
  let fixture: ComponentFixture<CatalogoInversionistaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CatalogoInversionistaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CatalogoInversionistaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
