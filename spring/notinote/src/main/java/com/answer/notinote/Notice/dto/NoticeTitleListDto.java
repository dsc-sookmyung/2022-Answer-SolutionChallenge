package com.answer.notinote.Notice.dto;

import com.answer.notinote.Notice.domain.entity.Notice;
import lombok.Getter;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Getter
public class NoticeTitleListDto {
    private String uploadfile;
    private String title;
    private LocalDate date;
    private List<NoticeSentenceDto> fullText = new ArrayList<>();
    private String korean;
    private String trans_full;

    public NoticeTitleListDto(Notice entity, List<NoticeSentenceDto> sentences){
        this.uploadfile = entity.getNimageurl() + "/" + entity.getNimagename();
        this.title = entity.getTitle();
        this.date = entity.getNdate();
        this.korean = entity.getOrigin_full();
        this.trans_full = entity.getTrans_full();

        this.fullText.addAll(sentences);
    }
}
