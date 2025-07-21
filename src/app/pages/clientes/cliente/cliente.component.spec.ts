import { NO_ERRORS_SCHEMA } from "@angular/core";
import { ClienteComponent } from "./cliente.component";
import { ComponentFixture, TestBed } from "@angular/core/testing";

describe("ClienteComponent", () => {

  let fixture: ComponentFixture<ClienteComponent>;
  let component: ClienteComponent;
  beforeEach(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
      ],
      declarations: [ClienteComponent]
    });

    fixture = TestBed.createComponent(ClienteComponent);
    component = fixture.componentInstance;

  });

  it("should be able to create component instance", () => {
    expect(component).toBeDefined();
  });
  
});
