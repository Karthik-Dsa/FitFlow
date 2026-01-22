package com.example.demo.service;

import com.example.demo.entity.Workout;

public interface WorkoutService {
   Workout createWorkout(Workout workout);
   Workout loadWorkoutById(Long id);
}
