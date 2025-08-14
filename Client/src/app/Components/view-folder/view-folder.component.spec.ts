import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewFolderComponent } from './view-folder.component';

describe('ViewFolderComponent', () => {
  let component: ViewFolderComponent;
  let fixture: ComponentFixture<ViewFolderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewFolderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewFolderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
