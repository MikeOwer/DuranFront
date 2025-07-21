import { NO_ERRORS_SCHEMA } from "@angular/core";
import { ListaClientesComponent } from "./lista-clientes.component";
import { ComponentFixture, TestBed } from "@angular/core/testing";

describe("ListaClientesComponent", () => {

  let fixture: ComponentFixture<ListaClientesComponent>;
  let component: ListaClientesComponent;
  beforeEach(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
      ],
      declarations: [ListaClientesComponent]
    });

    fixture = TestBed.createComponent(ListaClientesComponent);
    component = fixture.componentInstance;

  });

  it("should be able to create component instance", () => {
    expect(component).toBeDefined();
  });
  
});
