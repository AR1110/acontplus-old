import { Injectable, inject } from "@angular/core";
import { PATHS_API } from "@core/constants/global.constants";
import { RESTAURANT_PATHS } from "../enums/restaurant.enum";
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs";
import { Floor } from "../models/floor.model";
import { Room } from "../models/room.model";
import { Table } from "../models/table.model";


@Injectable({
  providedIn: 'root'
})

export class TableService {
  private url = `${PATHS_API.RESTAURANT}${RESTAURANT_PATHS.TABLE}`;
  private http = inject(HttpClient);

  getAll(codEstab: string) {
    return this.http.get(`${this.url}GetAll/${codEstab}`)
      .pipe(
        map((response: any) => {
          let floors: Array<Floor> = [];
          let rooms: Array<Room> = [];
          let tables: Array<Table> = [];
          if (response) {
            let tempFloors = response.floors;
            let tempRooms = response.rooms;
            let tempTables = response.tables;
            console.log(tempTables)
            floors = tempFloors.map((item: any) => {
              return {
                codEstab: item.codEstab,
                code: item.code,
                description: item.description,
                capacity: item.capacity,
                id: item.id,
                createdAt: item.createdAt,
                updatedAt: item.updatedAt,
                enabled: item.enabled,
                deleted: item.deleted,
                userId: item.userId
              }
            })

            rooms = tempRooms.map((item: any) => {
              return {
                floorId: item.floorId,
                code: item.code,
                description: item.description,
                capacity: item.capacity,
                id: item.id,
                createdAt: item.createdAt,
                updatedAt: item.updatedAt,
                enabled: item.enabled,
                deleted: item.deleted,
                userId: item.userId
              }
            })

            tables = tempTables.map((item: any) => {
              return {
                roomId: item.roomId,
                numberTable: item.numberTable,
                description: item.description,
                capacity: item.capacity,
                assigned: item.assigned,
                id: item.id,
                createdAt: item.createdAt,
                updatedAt: item.updatedAt,
                enabled: item.enabled,
                deleted: item.deleted,
                userId: item.userId
              }

            })
          }
          return {
            floors,
            rooms,
            tables
          }
        })
      )
  }
}
