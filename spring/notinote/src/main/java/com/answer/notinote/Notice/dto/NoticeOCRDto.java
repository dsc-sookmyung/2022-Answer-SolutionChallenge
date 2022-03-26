package com.answer.notinote.Notice.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class NoticeOCRDto {
    private String korean;
    private String fullText;

    public NoticeOCRDto(String korean, String fullText){
        this.korean = korean;
        this.fullText = fullText;
    }
}
