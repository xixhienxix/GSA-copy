import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountInfoComponent } from './account-info.component';

describe('CatalogComponent', () => {
  let component: AccountInfoComponent;
  let fixture: ComponentFixture<AccountInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
