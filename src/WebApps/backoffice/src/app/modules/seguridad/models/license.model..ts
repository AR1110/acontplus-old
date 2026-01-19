  interface License {
  id: number
  code: string
  licenseTypeId: number
  licenseTypeCode: string
  licenseType: string
}


export interface LicenseSelectHtmlOnly extends  Pick<License,"code"| "id" | "licenseTypeCode" | "licenseType"> {}
