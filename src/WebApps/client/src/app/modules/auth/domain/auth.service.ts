import { inject, Injectable, signal } from '@angular/core';
import { ToastrNotificationService } from '@core/services/toastr-notification.service';
import { AuthUseCase } from './use-cases/auth.use-case';
import { TokenUseCase } from '@modules/auth/domain/use-cases/token.use-case';
import { UAParser } from 'ua-parser-js';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private authUseCase = inject(AuthUseCase);
  private tokenUseCase = inject(TokenUseCase);
  private tS = inject(ToastrNotificationService);
  private readonly router = inject(Router);

  loginSuccess = signal(false);
  private parser = new UAParser(navigator.userAgent);
  parserResults = this.parser.getResult();
  customerIp = signal('');

  roles = signal<any[]>([]);
  userRolesOriginal = signal<any[]>([]);

  selectedRole = signal({} as any);

  getPublicIP() {
    fetch('https://api.ipify.org?format=json')
      .then(response => response.json())
      .then(response => {
        this.customerIp.set(response.ip);
      });
  }

  setUserRole(userRoles: any[], userRolesOriginal: any[]) {
    this.roles.set(
      userRoles.map((role: any) => ({
        ...role,
        imageUrl: `https://placehold.co/100x100/f59e0b/ffffff?text=${this.generateAcronym(role.company.businessName)}`,
      })),
    );
    this.userRolesOriginal.set(userRolesOriginal);
  }

  setSelectRole(role: any) {
    this.selectedRole.set(role);
  }

  createToken() {
    const item = this.userRolesOriginal().find(
      (x: any) => x.userRoleId === this.selectedRole().userRoleId,
    );
    if (item) {
      item.userAgent = JSON.stringify({
        userAgent: JSON.stringify(this.parserResults),
        ipAddress: this.customerIp(),
      });

      this.authUseCase.createToken(item).subscribe(response => {
        if (!response.success) {
          this.tS.show({
            type: 'warning',
            message: response.message,
          });
          return;
        }

        const userRoles = response.userRoles;
        const dataLogin = userRoles[0];

        this.tokenUseCase.saveSession(dataLogin);
        this.tS.show({
          type: 'success',
          message: response.message,
        });
        this.goToDashboard();
      });
    }
  }

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

  goToDashboard() {
    this.router.navigateByUrl('/').then();
  }
}
