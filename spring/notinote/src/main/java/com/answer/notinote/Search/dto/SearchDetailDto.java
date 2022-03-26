package com.answer.notinote.Search.dto;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;
import java.util.List;

@Getter
public class SearchDetailDto {
    private LocalDate date;
    private List<Object> results;

    @Builder
    public SearchDetailDto(LocalDate date, List<Object> results){
        this.date = date;
        this.results = results;
    }
}
