import { DatarealtimeService } from "./datarealtime.service";
import { TestBed } from "@angular/core/testing";

describe("DatarealtimeService", () => {

  let service: DatarealtimeService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        DatarealtimeService
      ]
    });
    service = TestBed.get(DatarealtimeService);

  });

  it("should be able to create service instance", () => {
    expect(service).toBeDefined();
  });

});
