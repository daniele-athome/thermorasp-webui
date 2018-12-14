export interface Device {
  id: string;
  name: string;
  protocol: string;
  address: string;
  type: string;
  topic: string;
}

export class DeviceForm {
  id: string;
  name: string;
  protocol: string;
  address: string;
  type: string;
}

export class DeviceState {
  id: string;
  enabled: boolean;
}
