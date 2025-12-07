import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RfpDialog } from './rfp-dialog';

describe('RfpDialog', () => {
  let component: RfpDialog;
  let fixture: ComponentFixture<RfpDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RfpDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RfpDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
