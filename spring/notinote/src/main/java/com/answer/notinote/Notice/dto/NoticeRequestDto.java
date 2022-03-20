package com.answer.notinote.Notice.dto;

import com.answer.notinote.Notice.domain.entity.Notice;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;

@Getter
public class NoticeRequestDto {
    private Long nid;
    private String nimagename;
    private String nimageoriginal;
    private String nimageurl;
    private String origin_full;
    private String trans_full;
    private LocalDate ndate;

    @Builder
    public NoticeRequestDto (String nimagename, String nimageoriginal, String nimageurl, String origin_full, String trans_full, LocalDate ndate){
        this.nimagename = nimagename;
        this.nimageoriginal = nimageoriginal;
        this.nimageurl = nimageurl;
        this.origin_full = origin_full;
        this.trans_full = trans_full;
        this.ndate = ndate;
    }

    public Notice toNoticeEntity(){
        return Notice.builder()
                .nimagename(nimagename)
                .nimageoriginal(nimageoriginal)
                .nimageurl(nimageurl)
                .origin_full(origin_full)
                .trans_full(trans_full)
                .ndate(ndate)
                .build();

    }

    public NoticeRequestDto(Notice notice){
        this.nid = notice.getNid();
        this.nimagename = notice.getNimagename();
        this.nimageoriginal = notice.getNimageoriginal();
        this.nimageurl = notice.getNimageurl();
        this.origin_full = notice.getOrigin_full();
        this.trans_full = notice.getTrans_full();
        this.ndate = notice.getNdate();
    }


}
