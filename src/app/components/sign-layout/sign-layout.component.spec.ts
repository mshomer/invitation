import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SignLayoutComponent } from './sign-layout.component';

describe('SignLayoutComponent', () => {
  let component: SignLayoutComponent;
  let fixture: ComponentFixture<SignLayoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SignLayoutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SignLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
