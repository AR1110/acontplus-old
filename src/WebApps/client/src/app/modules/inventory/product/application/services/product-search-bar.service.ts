import { effect, Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ProductSearchBarService {
  overlayOpen = signal(false);
  recentSearches = signal<string[]>(JSON.parse(localStorage.getItem('recentSearches') ?? '[]'));

  searchTerm = signal('');

  search(searchTerm: string) {
    this.searchTerm.set(searchTerm);
    this.overlayOpen.set(false);
    this.addToRecentSearches(searchTerm);
  }

  clearSearch() {
    this.searchTerm.set('');
    this.overlayOpen.set(true);
  }

  addToRecentSearches(searchTerm: string) {
    const lowerCaseTerm = searchTerm.toLowerCase();
    this.recentSearches.set([
      lowerCaseTerm,
      ...this.recentSearches().filter((s) => s !== searchTerm),
    ]);
  }

  deleteRecentSearch(searchTerm: string) {
    this.recentSearches.set(this.recentSearches().filter((s) => s !== searchTerm));
  }

  saveLocalStorage = effect(() => {
    localStorage.setItem('recentSearches', JSON.stringify(this.recentSearches()));
  });
}
