import { TestBed } from '@angular/core/testing';

import { ImgurService } from './imgur.service';

describe('ImgurService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ImgurService = TestBed.get(ImgurService);
    expect(service).toBeTruthy();
  });
});
