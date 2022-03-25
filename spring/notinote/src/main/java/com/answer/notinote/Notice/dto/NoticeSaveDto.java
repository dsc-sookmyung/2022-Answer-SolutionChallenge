package com.answer.notinote.Notice.dto;

import com.answer.notinote.Notice.domain.entity.Notice;
import com.answer.notinote.User.domain.entity.User;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Getter
@NoArgsConstructor
public class NoticeSaveDto {
    private String title;
    private LocalDate ndate;
    private String nimagename;
    private String nimageoriginal;
    private String nimageurl;
    private String origin_full;
    private String trans_full;
    private User user;

    @Builder
    public NoticeSaveDto (String title, LocalDate ndate, String nimagename, String nimageoriginal, String nimageurl, User user, String origin_full, String trans_full){
        this.title = title;
        this.ndate = ndate;
        this.nimagename = nimagename;
        this.nimageoriginal = nimageoriginal;
        this.nimageurl = nimageurl;
        this.origin_full = origin_full;
        this.trans_full = trans_full;
        this.user = user;
    }


    public Notice toNoticeEntity(User user){
        return Notice.builder()
                .title(title)
                .ndate(ndate)
                .nimagename(nimagename)
                .nimageoriginal(nimageoriginal)
                .nimageurl(nimageurl)
                .origin_full(origin_full)
                .trans_full(trans_full)
                .user(user)
                .build();
    }
}
