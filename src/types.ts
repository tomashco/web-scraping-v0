export interface WorkoutActivity {
  description: string;
}

export interface Workout {
  name: string;
  duration: string;
  activities: WorkoutActivity[];
}