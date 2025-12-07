import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttachmentsViewer } from './attachments-viewer';

describe('AttachmentsViewer', () => {
  let component: AttachmentsViewer;
  let fixture: ComponentFixture<AttachmentsViewer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AttachmentsViewer]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AttachmentsViewer);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
