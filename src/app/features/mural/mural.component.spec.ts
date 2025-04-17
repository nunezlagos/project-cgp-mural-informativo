import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MuralComponent } from './mural.component';

describe('MuralComponent', () => {
  let component: MuralComponent;
  let fixture: ComponentFixture<MuralComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MuralComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MuralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
