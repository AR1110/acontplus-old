import { Injectable, inject } from "@angular/core";
import { PATHS_API } from "@core/constants/global.constants";
import { TECH_SUPPORT_PATHS } from "../constants/tech-support.constants";
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs";
import { DeviceSpecs } from "../models/device.model";

@Injectable({
    providedIn: 'root',
})

export class DeviceSpecsService {
    url = `${PATHS_API.TECHSUPPORT}${TECH_SUPPORT_PATHS.DEVICE_SPEC}`;
    private http = inject(HttpClient);

    get(params: any) {
        return this.http
            .get(`${this.url}?json=${params}`)
            .pipe(map((response) => response));
    }

    post(data: DeviceSpecs) {
        return this.http
            .post(this.url, data)
            .pipe(map((response) => response));
    }

    put(id: number, data: DeviceSpecs) {
        return this.http
            .put(`${this.url}${id}`, data)
            .pipe(map((response) => response));
    }
}
