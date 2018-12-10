export interface Device {
  id: string;
  name: string;
  protocol: string;
  address: string;
  type: string;
}

export class DeviceForm implements Device {
  id: string;
  name: string;
  protocol: string;
  address: string;
  type: string;
}
