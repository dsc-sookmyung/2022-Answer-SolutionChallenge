package com.answer.notinote.Notice.dto;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class NoticeOCRDto {
    private String title;
    private String korean;
    private String trans_full;
    private List<NoticeSentenceDto> fullText;
    private Integer event_num;
    private List<NoticeEventListDto> events;
}
