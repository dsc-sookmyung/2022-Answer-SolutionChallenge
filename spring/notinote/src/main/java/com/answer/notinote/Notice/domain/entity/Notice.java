package com.answer.notinote.Notice.domain.entity;

import io.swagger.annotations.ApiParam;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.time.LocalDate;

@Getter
@NoArgsConstructor
@Entity
public class Notice {
    /*
    @ApiParam(value="notice ID", required = true)
    private long nid;

    @ApiParam(value="notice Image", required = true)
    private String nimage;

    @ApiParam(value="origin full text", required = true)
    private String origin_full;

    @ApiParam(value="translated full text", required = true)
    private String trans_full;

    @ApiParam(value="translated text summary", required = true)
    private String trans_sum;

    @ApiParam(value="notice date", required = true)
    private LocalDate ndate;
    */

    @Id
    @Column(name="nid")
    @GeneratedValue(strategy = GenerationType.IDENTITY) //auto_increment 가능
    private Long nid;

    @Column(nullable = false)
    private String nimage;
    private String origin_full;
    private String trans_full;
    private String trans_sum;
    private LocalDate ndate;

    //Not Using Constructor
    @Builder
    public Notice (String nimage, String origin_full, String trans_full, String trans_sum, LocalDate ndate){
        this.nimage = nimage;
        this.origin_full = origin_full;
        this.trans_full = trans_full;
        this.trans_sum = trans_sum;
        this.ndate = ndate;
    }

}
