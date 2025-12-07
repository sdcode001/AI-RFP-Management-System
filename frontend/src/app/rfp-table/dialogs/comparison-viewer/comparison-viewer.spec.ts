import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComparisonViewer } from './comparison-viewer';

describe('ComparisonViewer', () => {
  let component: ComparisonViewer;
  let fixture: ComponentFixture<ComparisonViewer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComparisonViewer]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComparisonViewer);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
