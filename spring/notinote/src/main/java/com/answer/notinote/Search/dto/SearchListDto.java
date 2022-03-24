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
    private List<String> save_titles;

    @Builder
    public SearchListDto(LocalDate date, List<String> save_titles){
        this.date = date;
        this.save_titles = save_titles;
    }




}
