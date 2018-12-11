export interface ScheduleBehavior {
  id: number;
  schedule_id: number;
  behavior_name: string;
  behavior_order: number;
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
