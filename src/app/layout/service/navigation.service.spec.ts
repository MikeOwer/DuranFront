import { NavigationService } from "./navigation.service";
import { TestBed } from "@angular/core/testing";

describe("NavigationService", () => {

  let service: NavigationService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        NavigationService
      ]
    });
    service = TestBed.get(NavigationService);

  });

  it("should be able to create service instance", () => {
    expect(service).toBeDefined();
  });

});
