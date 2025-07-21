import { ClienteService } from "./cliente.service";
import { TestBed } from "@angular/core/testing";

describe("ClienteService", () => {

  let service: ClienteService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ClienteService
      ]
    });
    service = TestBed.get(ClienteService);

  });

  it("should be able to create service instance", () => {
    expect(service).toBeDefined();
  });

});
