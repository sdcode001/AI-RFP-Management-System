import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RfpTable } from './rfp-table';

describe('RfpTable', () => {
  let component: RfpTable;
  let fixture: ComponentFixture<RfpTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RfpTable]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RfpTable);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
