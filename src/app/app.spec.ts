import { TestBed } from '@angular/core/testing';
import { App } from './app';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render title', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Tres en Raya');
  });

  it('should declare X as winner after a complete match', async () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    const buttons = (fixture.nativeElement as HTMLElement).querySelectorAll<HTMLButtonElement>(
      '.cell'
    );

    // Movidas ganadoras de X: 0, 1, 2 ; O contesta en 3 y 4.
    const moves = [0, 3, 1, 4, 2];
    for (const index of moves) {
      buttons[index].click();
      await fixture.whenStable();
      fixture.detectChanges();
    }

    const status = (fixture.nativeElement as HTMLElement).querySelector<HTMLElement>('.status');
    expect(status?.textContent).toContain('Gana X');
  });
});