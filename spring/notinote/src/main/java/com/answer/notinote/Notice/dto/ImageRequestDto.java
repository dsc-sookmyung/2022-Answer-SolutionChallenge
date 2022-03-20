package com.answer.notinote.Notice.dto;

import com.answer.notinote.Notice.domain.entity.Notice;
import com.answer.notinote.User.domain.entity.User;
import lombok.Builder;
import lombok.Getter;
import lombok.RequiredArgsConstructor;


@Getter
@RequiredArgsConstructor
public class ImageRequestDto {
    private Long nid;
    private String nimagename;
    private String nimageoriginal;
    private String nimageurl;
    private User user;

    @Builder
    public ImageRequestDto(Long nid, String nimagename, String nimageoriginal, String nimageurl, User user){
        this.nid = nid;
        this.nimagename = nimagename;
        this.nimageoriginal = nimageoriginal;
        this.nimageurl = nimageurl;
        this.user = user;
    }

    public Notice toNoticeEntity(User user){
        return Notice.builder()
                .nimagename(nimagename)
                .nimageoriginal(nimageoriginal)
                .nimageurl(nimageurl)
                .user(user)
                .build();

    }
}
