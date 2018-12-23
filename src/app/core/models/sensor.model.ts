export interface Sensor {
  id: string;
  type: string;
  protocol: string;
  address: string;
  topic: string;
  validity: number;
}

export interface SensorReading {
  sensor_id: string;
  type: string;
  timestamp: string;
  unit: string;
  value: number;
}
