package com.answer.notinote.Notice.dto;

import lombok.Getter;

@Getter
public class NoticeOCRDto {
    private String korean;
    private String fullText;

    public NoticeOCRDto(String korean, String fullText){
        this.korean = korean;
        this.fullText = fullText;
    }
}
