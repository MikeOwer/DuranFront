import { NO_ERRORS_SCHEMA } from "@angular/core";
import { InversionistaComponent } from "./inversionista.component";
import { ComponentFixture, TestBed } from "@angular/core/testing";

describe("InversionistaComponent", () => {

  let fixture: ComponentFixture<InversionistaComponent>;
  let component: InversionistaComponent;
  beforeEach(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
      ],
      declarations: [InversionistaComponent]
    });

    fixture = TestBed.createComponent(InversionistaComponent);
    component = fixture.componentInstance;

  });

  it("should be able to create component instance", () => {
    expect(component).toBeDefined();
  });
  
});
