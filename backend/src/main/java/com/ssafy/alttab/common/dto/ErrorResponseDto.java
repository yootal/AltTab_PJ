package com.ssafy.alttab.common.dto;

import com.ssafy.alttab.common.exception.CodeNotFoundException;
import lombok.Getter;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

@Getter
public class ErrorResponseDto {
    private final String message;

    private ErrorResponseDto(Exception ex){
        this.message = ex.getMessage();
    }

    public static ResponseEntity<?> toResponse(CodeNotFoundException ex){
        ErrorResponseDto response = new ErrorResponseDto(ex);
        return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
    }

    public static ResponseEntity<?> toResponse(Exception ex){
        ErrorResponseDto response = new ErrorResponseDto(ex);
        return new ResponseEntity<>(response, HttpStatus.SEE_OTHER);
    }
}