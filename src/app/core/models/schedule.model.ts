export interface ScheduleBehavior {
  id: number;
  schedule_id: number;
  name: string;
  order: number;
  start_time: number;
  end_time: number;
  config: {};
  sensors: string[];
  devices: string[];
}

export interface Schedule {
  id: number;
  name: string;
  description: string;
  enabled: boolean;
  behaviors: ScheduleBehavior[];
}

export interface VolatileScheduleBehavior {
  name: string;
  order: number;
  start_time: number;
  end_time: number;
  config: {};
  sensors: string[];
  devices: string[];
}

export interface ScheduleSaved {
  id: number;
}
