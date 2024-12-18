import { UserData } from "../../domain/models/user-data.model";

export class AuthMapper {
  static toUserData(response: any): UserData {
    return {
      userId: response.userId,
      email: response.email,
      name: response.name,
      username: response.username
    };
  }

  static fromLoginResponse(response: any) {
    return {
      token: response.token,
      userData: this.toUserData(response.userData)
    };
  }
}
