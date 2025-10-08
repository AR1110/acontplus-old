import { GroupedEstab } from '@core/models/estab.model';
import { TipoDoc } from '@core/models/tipo-doc.model';
import { Id } from '@shared/value-objects/id.vo';
import { Transportista } from '@customer/domain/models/transportista.model';
import { Direccion } from '@billing/domain/models/guia-remision/direccion.value-object';
import { ItemGuia } from '@billing/domain/models/guia-remision/item-guia.model';
import { TipoTraslado } from '@billing/domain/models/guia-remision/tipo-traslado.enum';
import { EstadoGuia } from '@billing/domain/models/guia-remision/estado-guia.enum';

export class GuiaRemision {
  constructor(
    private readonly id: Id<number>,
    private fechaInicioTraslado: Date,
    private tipoTraslado: TipoTraslado,
    private estado: EstadoGuia,
    private remitenteId: Id<number>,
    private remitenteRuc: string,
    private remitenteRazonSocial: string,
    private destinatarioId: Id<number>,
    private destinatarioRuc: string,
    private destinatarioRazonSocial: string,
    private direccionPartida: Direccion,
    private direccionLlegada: Direccion,
    private transportista: Transportista,
    private items: ItemGuia[],
    private motivoTraslado: string,
    private readonly creadoPor: string,
    private readonly creadoFecha: Date,
    private observaciones?: string,
    private documentosReferencia?: string[],
    private numeroGuia?: string,
    private fechaEmision?: Date,
    private modificadoPor?: string,
    private modificadoFecha?: Date,
  ) {
    this.validarGuiaRemision();
  }

  private validarGuiaRemision(): void {
    if (!this.fechaInicioTraslado) {
      throw new Error('La fecha de inicio de traslado es requerida');
    }
    if (!this.tipoTraslado) {
      throw new Error('El tipo de traslado es requerido');
    }
    if (!this.estado) {
      throw new Error('El estado de la guía es requerido');
    }
    if (!this.motivoTraslado || this.motivoTraslado.trim() === '') {
      throw new Error('El motivo de traslado es requerido');
    }
    if (!this.items || this.items.length === 0) {
      throw new Error('La guía debe tener al menos un ítem');
    }
  }

  // Métodos de negocio
  public emitir(numeroGuia: string, emisor: string): void {
    if (this.estado !== EstadoGuia.BORRADOR) {
      throw new Error('Solo se pueden emitir guías en estado BORRADOR');
    }

    this.numeroGuia = numeroGuia;
    this.fechaEmision = new Date();
    this.estado = EstadoGuia.EMITIDA;
    this.modificadoPor = emisor;
    this.modificadoFecha = new Date();
  }

  public anular(motivo: string, autorizador: string): void {
    if (![EstadoGuia.BORRADOR, EstadoGuia.EMITIDA].includes(this.estado)) {
      throw new Error('Solo se pueden anular guías en estado BORRADOR o EMITIDA');
    }

    this.estado = EstadoGuia.ANULADA;
    this.observaciones = this.observaciones
      ? `${this.observaciones}\nAnulada: ${motivo}`
      : `Anulada: ${motivo}`;
    this.modificadoPor = autorizador;
    this.modificadoFecha = new Date();
  }

  public marcarEnTransito(responsable: string): void {
    if (this.estado !== EstadoGuia.EMITIDA) {
      throw new Error('Solo se pueden marcar en tránsito guías en estado EMITIDA');
    }

    this.estado = EstadoGuia.EN_TRANSITO;
    this.modificadoPor = responsable;
    this.modificadoFecha = new Date();
  }

  public marcarEntregada(responsable: string): void {
    if (this.estado !== EstadoGuia.EN_TRANSITO) {
      throw new Error('Solo se pueden marcar como entregadas guías en estado EN_TRANSITO');
    }

    this.estado = EstadoGuia.ENTREGADA;
    this.modificadoPor = responsable;
    this.modificadoFecha = new Date();
  }

  public actualizarObservacion(observacion: string, usuario: string): void {
    if (this.estado !== EstadoGuia.BORRADOR) {
      throw new Error('Solo se pueden modificar guías en estado BORRADOR');
    }

    this.observaciones = observacion;
    this.modificadoPor = usuario;
    this.modificadoFecha = new Date();
  }

  public agregarItem(item: ItemGuia, usuario: string): void {
    if (this.estado !== EstadoGuia.BORRADOR) {
      throw new Error('Solo se pueden agregar ítems a guías en estado BORRADOR');
    }

    this.items.push(item);
    this.modificadoPor = usuario;
    this.modificadoFecha = new Date();
  }

  public quitarItem(itemId: Id<number>, usuario: string): void {
    if (this.estado !== EstadoGuia.BORRADOR) {
      throw new Error('Solo se pueden quitar ítems de guías en estado BORRADOR');
    }

    const indice = this.items.findIndex(item => item.getId()?.equals(itemId));
    if (indice === -1) {
      throw new Error('El ítem no existe en la guía');
    }

    this.items.splice(indice, 1);
    this.modificadoPor = usuario;
    this.modificadoFecha = new Date();
  }

  // Getters
  getId(): Id<number> {
    return this.id;
  }
  getFechaInicioTraslado(): Date {
    return this.fechaInicioTraslado;
  }
  getTipoTraslado(): TipoTraslado {
    return this.tipoTraslado;
  }
  getEstado(): EstadoGuia {
    return this.estado;
  }
  getNumeroGuia(): string | undefined {
    return this.numeroGuia;
  }
  getFechaEmision(): Date | undefined {
    return this.fechaEmision;
  }
  getRemitenteId(): Id<number> {
    return this.remitenteId;
  }
  getRemitenteRuc(): string {
    return this.remitenteRuc;
  }
  getRemitenteRazonSocial(): string {
    return this.remitenteRazonSocial;
  }
  getDestinatarioId(): Id<number> {
    return this.destinatarioId;
  }
  getDestinatarioRuc(): string {
    return this.destinatarioRuc;
  }
  getDestinatarioRazonSocial(): string {
    return this.destinatarioRazonSocial;
  }
  getDireccionPartida(): Direccion {
    return this.direccionPartida;
  }
  getDireccionLlegada(): Direccion {
    return this.direccionLlegada;
  }
  getTransportista(): Transportista {
    return this.transportista;
  }
  getItems(): ItemGuia[] {
    return [...this.items];
  } // Retorna copia para evitar modificación directa
  getMotivoTraslado(): string {
    return this.motivoTraslado;
  }
  getObservaciones(): string | undefined {
    return this.observaciones;
  }
  getDocumentosReferencia(): string[] | undefined {
    return this.documentosReferencia ? [...this.documentosReferencia] : undefined;
  }
  getCreadoPor(): string {
    return this.creadoPor;
  }
  getCreadoFecha(): Date {
    return this.creadoFecha;
  }
  getModificadoPor(): string | undefined {
    return this.modificadoPor;
  }
  getModificadoFecha(): Date | undefined {
    return this.modificadoFecha;
  }

  // Método para serializar a un objeto plano
  toPlainObject(): any {
    return {
      id: this.id.getValue(),
      numeroGuia: this.numeroGuia,
      fechaEmision: this.fechaEmision,
      fechaInicioTraslado: this.fechaInicioTraslado,
      tipoTraslado: this.tipoTraslado,
      estado: this.estado,
      remitenteId: this.remitenteId.getValue(),
      remitenteRuc: this.remitenteRuc,
      remitenteRazonSocial: this.remitenteRazonSocial,
      destinatarioId: this.destinatarioId.getValue(),
      destinatarioRuc: this.destinatarioRuc,
      destinatarioRazonSocial: this.destinatarioRazonSocial,
      direccionPartida: this.direccionPartida.toPlainObject(),
      direccionLlegada: this.direccionLlegada.toPlainObject(),
      transportista: this.transportista.toPlainObject(),
      items: this.items.map(item => item.toPlainObject()),
      motivoTraslado: this.motivoTraslado,
      observaciones: this.observaciones,
      documentosReferencia: this.documentosReferencia,
      creadoPor: this.creadoPor,
      creadoFecha: this.creadoFecha,
      modificadoPor: this.modificadoPor,
      modificadoFecha: this.modificadoFecha,
    };
  }

  // Método de fábrica para crear desde un objeto plano
  static fromPlainObject(object: any): GuiaRemision {
    return new GuiaRemision(
      new Id(object.id),
      new Date(object.fechaInicioTraslado),
      object.tipoTraslado,
      object.estado,
      new Id(object.remitenteId),
      object.remitenteRuc,
      object.remitenteRazonSocial,
      new Id(object.destinatarioId),
      object.destinatarioRuc,
      object.destinatarioRazonSocial,
      Direccion.fromPlainObject(object.direccionPartida),
      Direccion.fromPlainObject(object.direccionLlegada),
      Transportista.fromPlainObject(object.transportista),
      (object.items || []).map((item: any) => ItemGuia.fromPlainObject(item)),
      object.motivoTraslado,
      object.creadoPor,
      new Date(object.creadoFecha),
      object.observaciones,
      object.documentosReferencia,
      object.numeroGuia,
      object.fechaEmision ? new Date(object.fechaEmision) : undefined,
      object.modificadoPor,
      object.modificadoFecha ? new Date(object.modificadoFecha) : undefined,
    );
  }
}

export class GuiasRemisionResponse {
  totalRecords = 0;
  data: GuiaRemisionList[] = [];
}

export interface GuiaRemisionList {
  idGuiaRemision: number;
  codEstab: string;
  fechaEmision: string;
  fechaInicio: string;
  fechaFin: string;
  claveAcceso: string;
  serieComprobante: string;
  razonSocialDestinatario: string;
  identificacionDestinatario: string;
  serieComprobanteInvoice: string;
  razonSocialTransportista: string;
  nomEstado: string;
  nomUsuario: string;
  statusStyle: string;
  totalRecords: string;
}

export interface GuiaRemisionDataForm {
  estabs: GroupedEstab[];
  tiposDoc: TipoDoc[];
  informacionesAdicionales: any[];
}

export interface GuiaRemisionFilterData {
  estabs: GroupedEstab[];
  estadosDoc: any[];
  users: any[];
}
