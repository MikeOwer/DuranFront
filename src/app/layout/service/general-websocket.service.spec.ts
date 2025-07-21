import { TestBed } from '@angular/core/testing';

import { GeneralWebsocketService } from './general-websocket.service';

describe('GeneralWebsocketService', () => {
  let service: GeneralWebsocketService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GeneralWebsocketService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
