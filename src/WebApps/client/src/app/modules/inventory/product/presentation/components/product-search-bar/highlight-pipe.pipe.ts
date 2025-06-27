import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'highlight'
})
export class HighlightPipe implements PipeTransform {
  transform(text: any, search: string | null, searchKey?: string): string {
    if (!text || !search) {
      return text;
    }

    // Si es un objeto, obtener el valor de la propiedad especificada
    let textToHighlight = text;
    if (typeof text === 'object' && searchKey) {
      textToHighlight = text[searchKey] || text.name || text.value || '';
    }

    if (typeof textToHighlight !== 'string') {
      textToHighlight = String(textToHighlight);
    }

    const regex = new RegExp(`(${this.escapeRegExp(search)})`, 'gi');
    return textToHighlight.replace(regex, '<mark class="highlight">$1</mark>');
  }

  private escapeRegExp(string: string): string {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
}
