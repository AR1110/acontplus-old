

import { AuthEntity} from "../entities/auth.entity";
import { AuthModel} from "../../domain/models/auth.model";
import { Mapper } from "@app/core/utils/mapper";


export class AuthMapper extends Mapper<AuthEntity, AuthModel>{
  mapFrom(param: AuthEntity): AuthModel {
    return {
      access_token: param.jwtToken,
      expiresIn: param.expiresIn
    }
  }

  mapTo(param: AuthModel): AuthEntity {
    return {
      Username: param.username,
      Password: param.password,
    }
  }

}
