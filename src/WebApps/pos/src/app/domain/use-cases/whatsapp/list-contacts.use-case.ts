
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import {WhatsappRepository} from "@domain/repositories/whatsapp.repository";
import {WhatsAppContact} from "@domain/models/whatsapp-contact.model";

@Injectable({
  providedIn: 'root'
})
export class ListContactsUseCase {
  constructor(private whatsAppRepository: WhatsappRepository) {}

  execute(): Observable<WhatsAppContact[]> {
    return this.whatsAppRepository.getContacts().pipe(
      map(contacts => this.sortContactsByName(contacts))
    );
  }

  private sortContactsByName(contacts: WhatsAppContact[]): WhatsAppContact[] {
    return [...contacts].sort((a, b) => {
      const nameA = a.name || a.phoneNumber;
      const nameB = b.name || b.phoneNumber;
      return nameA.localeCompare(nameB);
    });
  }
}
