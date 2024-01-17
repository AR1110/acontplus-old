import { BaseEntity } from '@core/models/base-entity';
import { Order } from './order.model';
import { Device } from './device.model';

export interface OrderDetail extends BaseEntity {
  uuid: string;
  order: Order;
  orderId: number;
  device: Device;
  deviceId: number;
  obs: string;
}
