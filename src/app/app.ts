import { Component, computed, signal } from '@angular/core';

const LINES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

@Component({
  imports: [],
  selector: 'app-root',
  styleUrl: './app.scss',
  templateUrl: './app.html',
})
export class App {
  protected readonly board = signal<( 'X' | 'O' | null)[]>(Array(9).fill(null));
  protected readonly currentPlayer = signal<'X' | 'O'>('X');
  protected readonly scores = signal<Record<'X' | 'O' | 'draw', number>>({
    X: 0,
    O: 0,
    draw: 0,
  });

  protected readonly winningLine = signal<number[]>([]);

  protected readonly winner = computed< 'X' | 'O' | 'draw' | null>(() => {
    const line = this.checkWinner(this.board());
    if (line) {
      return this.board()[line[0]];
    }
    if (this.board().every((cell) => cell !== null)) {
      return 'draw';
    }
    return null;
  });

  protected readonly isFinished = computed(() => this.winner() !== null);

  protected readonly status = computed(() => {
    const result = this.winner();
    if (result === 'draw') {
      return '¡Empate!';
    }
    if (result) {
      return `Gana ${result}`;
    }
    return `Turno de ${this.currentPlayer()}`;
  });

  protected makeMove(index: number): void {
    if (this.isFinished() || this.board()[index] !== null) {
      return;
    }

    const player = this.currentPlayer();
    this.board.update((cells) => {
      const next = [...cells];
      next[index] = player;
      return next;
    });

    const line = this.checkWinner(this.board());
    if (line) {
      this.winningLine.set(line);
      this.scores.update((s) => ({ ...s, [player]: s[player] + 1 }));
    } else if (this.board().every((cell) => cell !== null)) {
      this.scores.update((s) => ({ ...s, draw: s.draw + 1 }));
    } else {
      this.currentPlayer.update((p) => (p === 'X' ? 'O' : 'X'));
    }
  }

  protected reset(): void {
    this.board.set(Array(9).fill(null));
    this.currentPlayer.set('X');
    this.winningLine.set([]);
  }

  protected resetScores(): void {
    this.reset();
    this.scores.set({ X: 0, O: 0, draw: 0 });
  }

  protected isWinningCell(index: number): boolean {
    return this.winningLine().includes(index);
  }

  private checkWinner(cells: ('X' | 'O' | null)[]): number[] | null {
    for (const line of LINES) {
      const [a, b, c] = line;
      if (cells[a] && cells[a] === cells[b] && cells[a] === cells[c]) {
        return line;
      }
    }
    return null;
  }
}