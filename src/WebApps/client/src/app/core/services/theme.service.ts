import { Injectable, signal, computed, effect } from '@angular/core';

export type ThemeColor = 'blue' | 'pink' | 'green';
export type ThemeMode = 'light' | 'dark';

@Injectable({
  providedIn: 'root',
})
export class ThemeTempService {
  // Signals para el estado del tema
  private readonly currentThemeSignal = signal<ThemeColor>('blue');
  private readonly currentModeSignal = signal<ThemeMode>('light');

  // Signals públicos de solo lectura
  public readonly currentTheme = this.currentThemeSignal.asReadonly();
  public readonly currentMode = this.currentModeSignal.asReadonly();

  // Computed signal para el tema completo (opcional)
  public readonly fullTheme = computed(() => {
    const theme = this.currentTheme();
    const mode = this.currentMode();
    return mode === 'dark' ? 'darkMode' : `${theme}Theme`;
  });

  // Computed signal para saber si está en modo oscuro
  public readonly isDarkMode = computed(() => this.currentMode() === 'dark');

  constructor() {
    // Effect para guardar el tema en localStorage (opcional)
    effect(() => {
      const theme = this.currentTheme();
      const mode = this.currentMode();

      localStorage.setItem('app-theme', theme);
      localStorage.setItem('app-mode', mode);

      console.log(`Theme changed to: ${theme}, Mode: ${mode}`);
    });

    // Cargar tema guardado al iniciar (opcional)
    this.loadSavedTheme();
  }

  private loadSavedTheme(): void {
    const savedTheme = localStorage.getItem('app-theme') as ThemeColor;
    const savedMode = localStorage.getItem('app-mode') as ThemeMode;

    if (savedTheme && ['blue', 'pink', 'green'].includes(savedTheme)) {
      this.currentThemeSignal.set(savedTheme);
    }

    if (savedMode && ['light', 'dark'].includes(savedMode)) {
      this.currentModeSignal.set(savedMode);
    }
  }

  public setBlueTheme(): void {
    this.currentThemeSignal.set('blue');
  }

  public setPinkTheme(): void {
    this.currentThemeSignal.set('pink');
  }

  public setGreenTheme(): void {
    this.currentThemeSignal.set('green');
  }

  public setTheme(theme: ThemeColor): void {
    this.currentThemeSignal.set(theme);
  }

  public setDarkMode(value: boolean): void {
    this.currentModeSignal.set(value ? 'dark' : 'light');
  }

  public toggleDarkMode(): void {
    this.currentModeSignal.update(mode => mode === 'dark' ? 'light' : 'dark');
  }

  public setMode(mode: ThemeMode): void {
    this.currentModeSignal.set(mode);
  }

  // Método para obtener el valor actual sin reactividad
  public getCurrentTheme(): ThemeColor {
    return this.currentThemeSignal();
  }

  public getCurrentMode(): ThemeMode {
    return this.currentModeSignal();
  }
}
