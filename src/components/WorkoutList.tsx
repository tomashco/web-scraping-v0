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
          <h2 className="text-2xl font-bold mb-2">{workout.name}</h2>
          <p className="text-gray-600 mb-4">Duration: {workout.duration}</p>
          <h3 className="text-xl font-semibold mb-2">Activities:</h3>
          <ul className="list-disc pl-6">
            {workout.activities.map((activity, actIndex) => (
              <li key={actIndex} className="text-gray-700">{activity.description}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default WorkoutList;