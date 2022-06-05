package com.answer.notinote.Search.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDate;
import java.util.List;

@Getter
@NoArgsConstructor
public class SearchListDto {
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd", timezone = "Asia/Seoul")
    private LocalDate date;
    private List<SearchSavedListDto> saved;

    @Builder
    public SearchListDto(LocalDate date, List<SearchSavedListDto> saved){
        this.date = date;;
        this.saved = saved;
    }




}
