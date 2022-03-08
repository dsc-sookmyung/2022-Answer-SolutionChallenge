package com.answer.notinote.Notice.dto;

import com.answer.notinote.Notice.domain.entity.Notice;
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

    @Builder
    public ImageRequestDto(Long nid, String nimagename, String nimageoriginal, String nimageurl){
        this.nid = nid;
        this.nimagename = nimagename;
        this.nimageoriginal = nimageoriginal;
        this.nimageurl = nimageurl;
    }

    public Notice toNoticeEntity(){
        return Notice.builder()
                .nimagename(nimagename)
                .nimageoriginal(nimageoriginal)
                .nimageurl(nimageurl)
                .build();

    }
}
