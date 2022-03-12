package com.answer.notinote.Child.domain;

import com.answer.notinote.User.domain.entity.Timestamped;
import lombok.Getter;

import javax.persistence.*;

@Entity
@Getter
public class Child extends Timestamped {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column
    Long cid;

    @Column(length = 20)
    String cname;

    @Column(length = 20)
    String ccolor;
}
