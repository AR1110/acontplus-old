export interface Ec2Instance {
  id: number,
  region: string,
  instanceId: string,
  instanceName?: string,
  instanceType?: string,
  ipAddress?: string,
  urlStart?: string,
  urlStop?: string,
  isActive?: boolean
}
