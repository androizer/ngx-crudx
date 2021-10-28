import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserOpsComponent } from './user-ops.component';

describe('UserOpsComponent', () => {
  let component: UserOpsComponent;
  let fixture: ComponentFixture<UserOpsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserOpsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserOpsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
