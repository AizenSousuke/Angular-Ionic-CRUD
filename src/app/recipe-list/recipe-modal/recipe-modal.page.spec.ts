import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecipeModalPage } from './recipe-modal.page';

describe('RecipeModalPage', () => {
  let component: RecipeModalPage;
  let fixture: ComponentFixture<RecipeModalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecipeModalPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecipeModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
