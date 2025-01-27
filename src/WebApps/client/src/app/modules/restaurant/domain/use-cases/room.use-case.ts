
import {RoomRepository} from "@restaurant/domain/repositories/room.repository";

export class RoomUseCase {
  constructor( private repo : RoomRepository ) {}


  getByEstab(estabId: number){
    return this.repo.getByEstab(estabId)
  }


  remove(id: number){
    return this.repo.remove(id)
  }

  post<T>( data: T) {
    return this.repo.post(data)
  }

  put<T>(id: number, data: T) {
    return this.repo.put(id, data)
  }

}
