import { ChangeDetectionStrategy, Component, inject, signal, OnInit } from '@angular/core';
import { MatCustomDialogComponent } from '@core/components/mat-custom-dialog/mat-custom-dialog.component';
import { MatCardModule } from '@angular/material/card';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-role-selection-modal',
  imports: [MatCustomDialogComponent, MatCardModule, NgClass],
  templateUrl: './role-selection-modal.component.html',
  styleUrl: './role-selection-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RoleSelectionModalComponent implements OnInit {
  public dialogRef = inject(MatDialogRef<RoleSelectionModalComponent>);
  readonly params = inject<any>(MAT_DIALOG_DATA);
  defaultIcon = 'assets/icons/default-user.png';
  roles = signal<any>([]);
  selectedRole: any | null = null;

  /**
   * Generates an acronym from a business or trade name string.
   * E.g., "El Buen Sabor" -> "EBS"
   * E.g., "Soluciones Tecnológicas S.A." -> "STSA"
   * @param {string} name - The name to process.
   * @returns {string} The uppercase acronym.
   */
  private generateAcronym(name: string) {
    if (!name) return '';

    // 1. Remove common separators (like commas, dashes) and replace multiple spaces with a single one.
    // 2. Split the string by space.
    // 3. Filter out common short connecting words (prepositions, articles) in Spanish (optional but improves quality).
    // 4. Map the remaining words to their first letter.
    // 5. Join the letters and convert to uppercase.

    const words = name
      .replace(/[,;()&.-]/g, '') // Remove punctuation
      .split(/\s+/); // Split by one or more spaces

    const stopWords = new Set([
      'de',
      'la',
      'el',
      'los',
      'las',
      'un',
      'una',
      'y',
      'e',
      'o',
      'sas',
      's.a.',
      'cia',
      'ltda',
    ]); // Common words to ignore

    const acronym = words
      .filter(word => word.length > 0 && !stopWords.has(word.toLowerCase()))
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase();

    // Limit to a reasonable length (e.g., 5 characters) for the logo circle
    return acronym.substring(0, 5);
  }

  ngOnInit(): void {
    console.log(this.params);
    this.roles.set(
      this.params.roles.map((role: any) => ({
        ...role,
        imageUrl: `https://placehold.co/100x100/f59e0b/ffffff?text=${this.generateAcronym(role.company.businessName)}`,
      })),
    );
    console.log(this.roles());
  }

  selectRole(role: any, shouldSave: boolean): void {
    this.selectedRole = role;
  }
}
