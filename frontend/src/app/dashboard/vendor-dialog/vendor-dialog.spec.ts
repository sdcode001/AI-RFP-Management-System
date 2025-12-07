import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorDialog } from './vendor-dialog';

describe('VendorDialog', () => {
  let component: VendorDialog;
  let fixture: ComponentFixture<VendorDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VendorDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VendorDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
