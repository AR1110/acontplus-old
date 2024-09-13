

export  interface  StateInstanceGreenApiResponse {
  stateInstance: "authorized"
}


export  interface  QrCodeGreenApiResponse {
  type: "qrCode",
  message: string
}

export interface  SettingGreenApiResponse {
  wid: string
}

export  interface  LogoutGreenApiResponse {
  isLogout: false
}
