export interface Sensor {
  id: string;
  type: string;
  protocol: string;
  address: string;
  icon: string;
  topic: string;
}

export interface SensorForm {
  id: string;
  type: string;
  protocol: string;
  address: string;
  icon: string;
}

export interface SensorReading {
  sensor_id: string;
  type: string;
  timestamp: string;
  unit: string;
  value: number;
  validity: number;
}
