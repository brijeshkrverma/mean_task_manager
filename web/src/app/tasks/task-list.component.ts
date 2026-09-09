import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Task, TaskService } from './task.service';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [FormsModule],
  template: `
    <form class="row" (ngSubmit)="add()">
      <input name="title" placeholder="New task" [(ngModel)]="title" required />
      <button type="submit" [disabled]="!title.trim()">Add</button>
    </form>

    @if (error()) {
      <p role="alert">{{ error() }}</p>
    }

    @if (loading()) {
      <p>Loading…</p>
    } @else {
      <ul>
        @for (task of tasks(); track task._id) {
          <li>
            <input
              type="checkbox"
              [checked]="task.status === 'done'"
              (change)="toggle(task)"
            />
            <span>{{ task.title }}</span>
            <small>{{ task.status }} · {{ task.priority }}</small>
            <button type="button" (click)="remove(task)">Delete</button>
          </li>
        } @empty {
          <li>No tasks yet.</li>
        }
      </ul>
    }
  `,
})
export class TaskListComponent implements OnInit {
  private readonly service = inject(TaskService);

  readonly tasks = signal<Task[]>([]);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);

  title = '';

  ngOnInit(): void {
    this.reload();
  }

  add(): void {
    const title = this.title.trim();
    if (!title) return;

    this.service.create({ title }).subscribe({
      next: ({ task }) => {
        this.tasks.update((list) => [task, ...list]);
        this.title = '';
      },
      error: () => this.error.set('Could not create the task.'),
    });
  }

  toggle(task: Task): void {
    const status = task.status === 'done' ? 'todo' : 'done';

    this.service.update(task._id, { status }).subscribe({
      next: ({ task: updated }) =>
        this.tasks.update((list) => list.map((t) => (t._id === updated._id ? updated : t))),
      error: () => this.error.set('Could not update the task.'),
    });
  }

  remove(task: Task): void {
    this.service.remove(task._id).subscribe({
      next: () => this.tasks.update((list) => list.filter((t) => t._id !== task._id)),
      error: () => this.error.set('Could not delete the task.'),
    });
  }

  private reload(): void {
    this.loading.set(true);
    this.service.list().subscribe({
      next: (page) => {
        this.tasks.set(page.items);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Could not load tasks.');
        this.loading.set(false);
      },
    });
  }
}
