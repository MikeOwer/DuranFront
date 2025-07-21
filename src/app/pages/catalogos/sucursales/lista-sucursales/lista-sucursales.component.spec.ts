import { NO_ERRORS_SCHEMA } from "@angular/core";
import { ListaSucursalesComponent } from "./lista-sucursales.component";
import { ComponentFixture, TestBed } from "@angular/core/testing";

describe("ListaSucursalesComponent", () => {

  let fixture: ComponentFixture<ListaSucursalesComponent>;
  let component: ListaSucursalesComponent;
  beforeEach(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
      ],
      declarations: [ListaSucursalesComponent]
    });

    fixture = TestBed.createComponent(ListaSucursalesComponent);
    component = fixture.componentInstance;

  });

  it("should be able to create component instance", () => {
    expect(component).toBeDefined();
  });
  
});
