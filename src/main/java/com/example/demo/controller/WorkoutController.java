package com.example.demo.controller;

import com.example.demo.dto.*;
import com.example.demo.entity.Workout;
import com.example.demo.mapper.WorkoutMapper;
import com.example.demo.service.WorkoutService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/workouts")
public class WorkoutController {

    private final WorkoutService workoutService;

    public WorkoutController(WorkoutService workoutService) {
        this.workoutService = workoutService;
    }

    @PostMapping
    public ResponseEntity<WorkoutResponseDto> createWorkout(
            @Valid @RequestParam WorkoutRequestDto requestDto) {
        Workout workout = WorkoutMapper.addWorkout(requestDto);
        Workout saved = workoutService.createWorkout(workout);

        return ResponseEntity.ok(WorkoutMapper.toResponseDto(saved));
    }

    @GetMapping("/{id}")
    public ResponseEntity<WorkoutResponseDto>  getWorkout(@PathVariable Long id){
        Workout workout = workoutService.loadWorkoutById(id);
        return ResponseEntity.ok(WorkoutMapper.toResponseDto(workout));
    }
}
