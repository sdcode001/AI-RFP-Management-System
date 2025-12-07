import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecViewer } from './spec-viewer';

describe('SpecViewer', () => {
  let component: SpecViewer;
  let fixture: ComponentFixture<SpecViewer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpecViewer]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpecViewer);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
