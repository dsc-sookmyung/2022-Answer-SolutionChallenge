package com.answer.notinote.Notice.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Getter
@NoArgsConstructor
public class NoticeRequestDto {
    private String title;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd", timezone = "Asia/Seoul")
    private LocalDate date;
    private String imageUrl;
    private String korean;
    private String fullText;
    private Long cid;


    @Builder
    public NoticeRequestDto (String title, LocalDate date, String imageUrl, String korean, String fullText, Long cid){
        this.title = title;
        this.date = date;
        this.imageUrl = imageUrl;
        this.korean = korean;
        this.fullText= fullText;
        this.cid = cid;
    }

}
