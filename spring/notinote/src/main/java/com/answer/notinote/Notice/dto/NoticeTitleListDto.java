package com.answer.notinote.Notice.dto;

import com.answer.notinote.Notice.domain.entity.Notice;
import lombok.Getter;

@Getter
public class NoticeTitleListDto {
    private String title;

    public NoticeTitleListDto(Notice entity){
        this.title = entity.getTitle();
    }
}
