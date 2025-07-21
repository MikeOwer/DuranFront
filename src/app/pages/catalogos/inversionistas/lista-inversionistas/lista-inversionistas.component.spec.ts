import { NO_ERRORS_SCHEMA } from "@angular/core";
import { ListaInversionistasComponent } from "./lista-inversionistas.component";
import { ComponentFixture, TestBed } from "@angular/core/testing";

describe("ListaInversionistasComponent", () => {

  let fixture: ComponentFixture<ListaInversionistasComponent>;
  let component: ListaInversionistasComponent;
  beforeEach(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
      ],
      declarations: [ListaInversionistasComponent]
    });

    fixture = TestBed.createComponent(ListaInversionistasComponent);
    component = fixture.componentInstance;

  });

  it("should be able to create component instance", () => {
    expect(component).toBeDefined();
  });
  
});
