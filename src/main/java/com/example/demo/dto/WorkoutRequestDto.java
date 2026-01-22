package com.example.demo.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class WorkoutRequestDto {
    @NotBlank
    private String title;

    List<ExerciseRequestDto> exercises;
}
