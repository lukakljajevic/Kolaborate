/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { YourWorkComponent } from './your-work.component';

describe('YourWorkComponent', () => {
  let component: YourWorkComponent;
  let fixture: ComponentFixture<YourWorkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ YourWorkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(YourWorkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
