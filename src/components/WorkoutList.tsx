import React from 'react';
import { Workout } from '../types';

interface WorkoutListProps {
  workouts: Workout[];
}

const WorkoutList: React.FC<WorkoutListProps> = ({ workouts }) => {
  return (
    <div className="space-y-6">
      {workouts.map((workout, index) => (
        <div key={index} className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-2">{workout.week} - {workout.workout}</h2>
          <h3 className="text-xl font-semibold mb-2">Activities:</h3>
          <ul className="list-disc pl-6">
            {workout.workoutlist.map((activity, actIndex) => (
              <li key={actIndex} className="text-gray-700">{activity} %</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default WorkoutList;