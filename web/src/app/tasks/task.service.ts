import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

export interface Task {
  _id: string;
  title: string;
  description: string;
  status: 'todo' | 'in_progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  dueAt: string | null;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface TaskPage {
  items: Task[];
  total: number;
  page: number;
  limit: number;
}

@Injectable({ providedIn: 'root' })
export class TaskService {
  private readonly http = inject(HttpClient);
  private readonly base = '/api/tasks';

  list(): Observable<TaskPage> {
    return this.http.get<TaskPage>(this.base);
  }

  create(task: Partial<Task>): Observable<{ task: Task }> {
    return this.http.post<{ task: Task }>(this.base, task);
  }

  update(id: string, patch: Partial<Task>): Observable<{ task: Task }> {
    return this.http.patch<{ task: Task }>(`${this.base}/${id}`, patch);
  }

  remove(id: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}
