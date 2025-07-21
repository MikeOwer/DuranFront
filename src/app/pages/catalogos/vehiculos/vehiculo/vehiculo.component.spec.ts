import { NO_ERRORS_SCHEMA } from "@angular/core";
import { VehiculoComponent } from "./vehiculo.component";
import { ComponentFixture, TestBed } from "@angular/core/testing";

describe("VehiculoComponent", () => {

  let fixture: ComponentFixture<VehiculoComponent>;
  let component: VehiculoComponent;
  beforeEach(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
      ],
      declarations: [VehiculoComponent]
    });

    fixture = TestBed.createComponent(VehiculoComponent);
    component = fixture.componentInstance;

  });

  it("should be able to create component instance", () => {
    expect(component).toBeDefined();
  });
  
});
