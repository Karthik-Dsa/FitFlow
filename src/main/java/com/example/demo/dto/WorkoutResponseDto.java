package com.example.demo.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
public class WorkoutResponseDto {
    private Long id;
    private String title;
    private LocalDateTime createdAt;
    private List<ExerciseResponseDto> exercises;
}
