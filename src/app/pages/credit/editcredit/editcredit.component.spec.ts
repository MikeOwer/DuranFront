import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditcreditComponent } from './editcredit.component';

describe('EditcreditComponent', () => {
  let component: EditcreditComponent;
  let fixture: ComponentFixture<EditcreditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditcreditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditcreditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
