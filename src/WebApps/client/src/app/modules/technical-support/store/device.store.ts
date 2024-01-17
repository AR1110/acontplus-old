import { signal } from "@angular/core";
import { Device } from "../models/device.model";
export const devices = signal<Device[]>([]);
