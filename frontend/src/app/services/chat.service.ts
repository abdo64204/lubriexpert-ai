import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, timeout } from 'rxjs/operators';
import { ChatRequest, ChatResponse } from '../models/chat.models';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ChatService {
  private readonly apiUrl = (environment.apiUrl || '/api').replace(/\/+$/, '');

  constructor(private http: HttpClient) {}

  /**
   * Send a chat message to the backend API.
   * The backend handles AI communication — no API keys in the frontend.
   */
  sendMessage(request: ChatRequest): Observable<ChatResponse> {
    return this.http
      .post<ChatResponse>(`${this.apiUrl}/chat`, request)
      .pipe(
        timeout(60000), // 60s timeout for AI responses
        catchError(this.handleError)
      );
  }

  deleteConversation(conversationId: string): Observable<{ success: boolean }> {
    return this.http
      .delete<{ success: boolean }>(`${this.apiUrl}/conversations/${conversationId}`)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse | Error): Observable<never> {
    let message = 'An unexpected error occurred.';

    if (error instanceof HttpErrorResponse) {
      if (error.status === 0) {
        message = 'Cannot connect to the server. Please check your internet connection or try again later.';
      } else if (error.status === 503) {
        message = error.error?.error ?? 'AI service is not available.';
      } else if (error.status === 429) {
        message = 'Too many requests. Please wait a moment and try again.';
      } else if (error.error?.error) {
        message = error.error.error;
      } else {
        message = error.message || message;
      }
    } else if (error instanceof Error) {
      if (error.name === 'TimeoutError') {
        message = 'The AI is taking too long to respond. Please try again.';
      } else {
        message = error.message;
      }
    }

    return throwError(() => new Error(message));
  }
}
