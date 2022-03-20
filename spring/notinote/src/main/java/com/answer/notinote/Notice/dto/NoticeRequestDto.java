package com.answer.notinote.Notice.dto;

import com.answer.notinote.Notice.domain.entity.Notice;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Getter
@NoArgsConstructor
public class NoticeRequestDto {
    private Long nid;
    private String title;
    private LocalDate ndate;

    @Builder
    public NoticeRequestDto (String title, LocalDate ndate){
        this.title = title;
        this.ndate = ndate;
    }
    /*
    public Notice toNoticeEntity(){
        return Notice.builder()
                .title(title)
                .ndate(ndate)
                .build();
    }*/
}
