package com.answer.notinote.Notice.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Getter
@NoArgsConstructor
public class NoticeRequestDto {
    private String title;
    private LocalDate date;
    private String korean;
    private String fullText;


    @Builder
    public NoticeRequestDto (String title, LocalDate date, String korean, String fullText){
        this.title = title;
        this.date = date;
        this.korean = korean;
        this.fullText= fullText;
    }

}
