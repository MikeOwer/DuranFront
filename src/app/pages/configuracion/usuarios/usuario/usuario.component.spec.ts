import { NO_ERRORS_SCHEMA } from "@angular/core";
import { UsuarioComponent } from "./usuario.component";
import { ComponentFixture, TestBed } from "@angular/core/testing";

describe("UsuarioComponent", () => {

  let fixture: ComponentFixture<UsuarioComponent>;
  let component: UsuarioComponent;
  beforeEach(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
      ],
      declarations: [UsuarioComponent]
    });

    fixture = TestBed.createComponent(UsuarioComponent);
    component = fixture.componentInstance;

  });

  it("should be able to create component instance", () => {
    expect(component).toBeDefined();
  });
  
});
