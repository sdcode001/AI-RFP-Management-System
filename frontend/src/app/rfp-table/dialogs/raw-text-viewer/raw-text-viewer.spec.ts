import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RawTextViewer } from './raw-text-viewer';

describe('RawTextViewer', () => {
  let component: RawTextViewer;
  let fixture: ComponentFixture<RawTextViewer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RawTextViewer]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RawTextViewer);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
