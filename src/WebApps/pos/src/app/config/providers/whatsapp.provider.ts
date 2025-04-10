
import {WhatsappRepository} from "@domain/repositories/whatsapp.repository";
import {WhatsappRepositoryImpl} from "@data/repositories/whatsapp.repository.impl";

export const whatsappProvider = {
  provide: WhatsappRepository,
  useClass: WhatsappRepositoryImpl
}
