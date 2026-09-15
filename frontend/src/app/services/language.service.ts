import { Injectable, signal } from '@angular/core';
import { Language } from '../models/chat.models';

const STORAGE_KEY = 'lubriexpert_language';

@Injectable({ providedIn: 'root' })
export class LanguageService {
  private _language = signal<Language>(this.loadLanguage());
  readonly language = this._language.asReadonly();

  constructor() {
    this.applyToDocument(this._language());
  }

  private loadLanguage(): Language {
    const stored = localStorage.getItem(STORAGE_KEY);
    return (stored === 'ar' || stored === 'en') ? stored : 'en';
  }

  setLanguage(lang: Language): void {
    this._language.set(lang);
    localStorage.setItem(STORAGE_KEY, lang);
    this.applyToDocument(lang);
  }

  applyToDocument(lang: Language): void {
    const dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
    document.documentElement.dir = dir;
    document.body.setAttribute('dir', dir);
  }

  isRtl(): boolean {
    return this._language() === 'ar';
  }

  t(ar: string, en: string): string {
    return this._language() === 'ar' ? ar : en;
  }
}
