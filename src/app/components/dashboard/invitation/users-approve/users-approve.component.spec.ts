import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersApproveComponent } from './users-approve.component';

describe('UsersApproveComponent', () => {
  let component: UsersApproveComponent;
  let fixture: ComponentFixture<UsersApproveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UsersApproveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersApproveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
