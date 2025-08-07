import { TestBed } from '@angular/core/testing';

import { DropboxServiceService } from './dropbox-service.service';

describe('DropboxServiceService', () => {
  let service: DropboxServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DropboxServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
