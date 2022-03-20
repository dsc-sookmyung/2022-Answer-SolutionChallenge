package com.answer.notinote.Notice.domain.entity;

import com.answer.notinote.User.domain.entity.User;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;


import javax.persistence.*;
import java.time.LocalDate;

@Getter
@NoArgsConstructor
@Entity
public class Notice {
    @Id
    @Column(name="nid")
    @GeneratedValue(strategy = GenerationType.IDENTITY) //auto_increment 가능
    private Long nid;

    @Column
    private String nimagename;
    private String nimageoriginal;
    private String nimageurl;

    @Column(length=5000)
    private String origin_full;
    @Column(length=5000)
    private String trans_full;

    @ManyToOne
    @JoinColumn
    private User user;

    private LocalDate ndate;

    //Not Using Constructor
    @Builder
    public Notice (String nimagename, String nimageoriginal, String nimageurl, String origin_full, String trans_full, LocalDate ndate, User user){
        this.nimagename = nimagename;
        this.nimageoriginal = nimageoriginal;
        this.nimageurl = nimageurl;
        this.origin_full = origin_full;
        this.trans_full = trans_full;
        this.ndate = ndate;
        this.user = user;
    }


    public void update_origin_full(String origin_full){
        this.origin_full = origin_full;
    }

    public void update_trans_full(String trans_full){
        this.trans_full = trans_full;
    }

    }
