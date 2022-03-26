package com.answer.notinote.Search.dto;

import com.answer.notinote.Notice.domain.entity.Notice;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Getter
@NoArgsConstructor
public class SearchListDto {
    private LocalDate date;
    private List<String> saved_titles;

    @Builder
    public SearchListDto(LocalDate date, List<String> saved_titles){
        this.date = date;
        this.saved_titles = saved_titles;
    }




}
