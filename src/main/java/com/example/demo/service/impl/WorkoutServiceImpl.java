package com.example.demo.service.impl;

import com.example.demo.entity.Workout;
import com.example.demo.repository.WorkoutRepo;
import com.example.demo.service.WorkoutService;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.stereotype.Service;

@Service
@Transactional
public class WorkoutServiceImpl implements WorkoutService {

    private final WorkoutRepo workoutRepo;

    public WorkoutServiceImpl(WorkoutRepo workoutRepo) {
        this.workoutRepo = workoutRepo;
    }

    @Override
    public Workout createWorkout(Workout workout) {
        return workoutRepo.save(workout);
    }

    @Override
    public Workout loadWorkoutById(Long id) {
        return workoutRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Workout not found"));
    }
}
