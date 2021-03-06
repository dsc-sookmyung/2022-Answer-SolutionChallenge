package com.answer.notinote.Notice.dto;

import com.answer.notinote.Notice.domain.entity.Notice;
import com.answer.notinote.User.domain.entity.User;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Getter
@NoArgsConstructor
public class NoticeSaveDto {
    private String title;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd", timezone = "Asia/Seoul")
    private LocalDate ndate;
    private String nimageurl;
    private String origin_full;
    private String trans_full;
    private User user;

    @Builder
    public NoticeSaveDto (String title, LocalDate ndate, String nimageurl, User user, String origin_full, String trans_full){
        this.title = title;
        this.ndate = ndate;
        this.nimageurl = nimageurl;
        this.origin_full = origin_full;
        this.trans_full = trans_full;
        this.user = user;
    }


    public Notice toNoticeEntity(User user){
        return Notice.builder()
                .title(title)
                .ndate(ndate)
                .nimageurl(nimageurl)
                .origin_full(origin_full)
                .trans_full(trans_full)
                .user(user)
                .build();
    }
}
