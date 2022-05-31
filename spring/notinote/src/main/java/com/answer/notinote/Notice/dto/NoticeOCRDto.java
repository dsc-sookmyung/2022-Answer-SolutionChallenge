package com.answer.notinote.Notice.dto;


import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@NoArgsConstructor
public class NoticeOCRDto {
    private String korean;
    private String trans_full;
    private List<NoticeSentenceDto> fullText;
    private Integer event_num;
    private List<NoticeEventListDto> events;

    public NoticeOCRDto(String korean, String trans_full, List<NoticeSentenceDto> fullText, Integer event_num, List<NoticeEventListDto> events){
        this.korean = korean;
        this.trans_full = trans_full;
        this.fullText = fullText;
        this.event_num = event_num;
        this.events = events;
    }
}
