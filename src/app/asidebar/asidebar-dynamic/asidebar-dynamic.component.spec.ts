import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsidebarDynamicComponent } from './asidebar-dynamic.component';

describe('AsidebarDynamicComponent', () => {
  let component: AsidebarDynamicComponent;
  let fixture: ComponentFixture<AsidebarDynamicComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AsidebarDynamicComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AsidebarDynamicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
