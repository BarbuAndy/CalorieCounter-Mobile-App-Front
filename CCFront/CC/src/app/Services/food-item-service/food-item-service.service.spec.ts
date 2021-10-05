import { TestBed } from '@angular/core/testing';

import { FoodItemService } from './food-item-service.service';

describe('FoodItemServiceService', () => {
  let service: FoodItemService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FoodItemService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
