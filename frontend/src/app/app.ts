import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LanguageService } from './services/language.service';
import { ThemeService } from './services/theme.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `<router-outlet />`,
})
export class App implements OnInit {
  private langService = inject(LanguageService);
  // ThemeService applies theme in its constructor — inject to ensure it runs
  private _themeService = inject(ThemeService);

  ngOnInit(): void {
    // Apply persisted language to document on startup
    this.langService.applyToDocument(this.langService.language());
  }
}
