import { NO_ERRORS_SCHEMA } from "@angular/core";
import { SucursalComponent } from "./sucursal.component";
import { ComponentFixture, TestBed } from "@angular/core/testing";

describe("SucursalComponent", () => {

  let fixture: ComponentFixture<SucursalComponent>;
  let component: SucursalComponent;
  beforeEach(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
      ],
      declarations: [SucursalComponent]
    });

    fixture = TestBed.createComponent(SucursalComponent);
    component = fixture.componentInstance;

  });

  it("should be able to create component instance", () => {
    expect(component).toBeDefined();
  });
  
});
