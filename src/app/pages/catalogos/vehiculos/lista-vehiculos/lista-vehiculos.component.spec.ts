import { NO_ERRORS_SCHEMA } from "@angular/core";
import { ListaVehiculosComponent } from "./lista-vehiculos.component";
import { ComponentFixture, TestBed } from "@angular/core/testing";

describe("ListaVehiculosComponent", () => {

  let fixture: ComponentFixture<ListaVehiculosComponent>;
  let component: ListaVehiculosComponent;
  beforeEach(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
      ],
      declarations: [ListaVehiculosComponent]
    });

    fixture = TestBed.createComponent(ListaVehiculosComponent);
    component = fixture.componentInstance;

  });

  it("should be able to create component instance", () => {
    expect(component).toBeDefined();
  });
  
});
