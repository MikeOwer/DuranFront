import { NO_ERRORS_SCHEMA } from "@angular/core";
import { ListaUsuariosComponent } from "./lista-usuarios.component";
import { ComponentFixture, TestBed } from "@angular/core/testing";

describe("ListaUsuariosComponent", () => {

  let fixture: ComponentFixture<ListaUsuariosComponent>;
  let component: ListaUsuariosComponent;
  beforeEach(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
      ],
      declarations: [ListaUsuariosComponent]
    });

    fixture = TestBed.createComponent(ListaUsuariosComponent);
    component = fixture.componentInstance;

  });

  it("should be able to create component instance", () => {
    expect(component).toBeDefined();
  });
  
});
