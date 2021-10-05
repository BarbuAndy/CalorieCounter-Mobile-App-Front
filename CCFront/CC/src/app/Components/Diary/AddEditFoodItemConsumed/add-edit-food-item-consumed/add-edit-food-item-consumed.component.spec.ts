import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AddEditFoodItemConsumedComponent } from './add-edit-food-item-consumed.component';

describe('AddEditFoodItemConsumedComponent', () => {
  let component: AddEditFoodItemConsumedComponent;
  let fixture: ComponentFixture<AddEditFoodItemConsumedComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AddEditFoodItemConsumedComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AddEditFoodItemConsumedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
