package com.ssafy.alttab.executor.dto;

import com.ssafy.alttab.executor.enums.ExecutionStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CodeExecutionResponseDto {

    private Long studyGroupId;
    private Long problemId;
    private Long problemTab;
    private ExecutionStatus status;
    private String output;
    private String errorMessage;
}