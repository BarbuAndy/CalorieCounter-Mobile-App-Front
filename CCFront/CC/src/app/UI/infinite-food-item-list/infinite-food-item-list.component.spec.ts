import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { InfiniteFoodItemListComponent } from './infinite-food-item-list.component';

describe('InfiniteFoodItemListComponent', () => {
  let component: InfiniteFoodItemListComponent;
  let fixture: ComponentFixture<InfiniteFoodItemListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ InfiniteFoodItemListComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(InfiniteFoodItemListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
