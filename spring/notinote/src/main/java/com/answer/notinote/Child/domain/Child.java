package com.answer.notinote.Child.domain;

import com.answer.notinote.Child.dto.ChildDto;
import com.answer.notinote.User.domain.entity.Timestamped;
import com.answer.notinote.User.domain.entity.User;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Entity
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class Child extends Timestamped {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column
    Long cid;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "uid")
    User user;

    @Column(length = 20)
    String cname;

    @Column()
    Long color;

    public Child (User user, ChildDto requestDto) {
        this.user = user;
        this.cname = requestDto.getCname();
        this.color = requestDto.getColor();
    }
}
