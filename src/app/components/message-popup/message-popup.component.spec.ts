import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessagePopupComponent } from './message-popup.component';

describe('MessagePopupComponent', () => {
  let component: MessagePopupComponent;
  let fixture: ComponentFixture<MessagePopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MessagePopupComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MessagePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
