package com.example.demo.dto;

import com.example.demo.entity.ExerciseType;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ExerciseRequestDto {
    @NotBlank
    private String name;

    @Min(1)
    private int sets;
    private ExerciseType type;
}
