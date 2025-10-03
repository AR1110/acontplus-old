import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';
import {MatMenuModule} from "@angular/material/menu";
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import {MatRadioButton} from "@angular/material/radio";
import {MatIcon} from "@angular/material/icon";

@Component({
  selector: 'app-settings-menu',
  imports: [MatMenuModule, MatSlideToggleModule, MatRadioButton, MatIcon],
  templateUrl: './settings-menu.component.html',
  styleUrl: './settings-menu.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SettingsMenuComponent {

  @Output() themeOnBlue: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() themeOnPink: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() themeOnGreen: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() darkMode: EventEmitter<boolean> = new EventEmitter<boolean>();
  public isDarkMode = false;

  public isBlueTheme = true;
  public isPinkTheme = false;
  public isGreenTheme = false;

  public changeThemeOnBlue(): void {
    this.isBlueTheme = true;
    this.isPinkTheme = false;
    this.isGreenTheme = false;

    this.themeOnBlue.emit(true);
  }
  public changeThemeOnPink(): void {
    this.isBlueTheme = false;
    this.isPinkTheme = true;
    this.isGreenTheme = false;

    this.themeOnPink.emit(true);
  }
  public changeThemeOnGreen(): void {
    this.isBlueTheme = false;
    this.isPinkTheme = false;
    this.isGreenTheme = true;

    this.themeOnGreen.emit(true);
  }

  public onDarkMode(): void {
    this.isDarkMode = !this.isDarkMode;
    this.darkMode.emit(this.isDarkMode);
  }
}
