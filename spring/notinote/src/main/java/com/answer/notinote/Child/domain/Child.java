package com.answer.notinote.Child.domain;

import com.answer.notinote.Child.dto.ChildDto;
import com.answer.notinote.Event.domain.Event;
import com.answer.notinote.Notice.domain.entity.Notice;
import com.answer.notinote.User.domain.entity.Timestamped;
import com.answer.notinote.User.domain.entity.User;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

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

    @OneToMany(mappedBy = "child", cascade = CascadeType.ALL)
    private List<Event> events = new ArrayList<>();

    public Child (ChildDto requestDto) {
        this.cname = requestDto.getCname();
        this.color = requestDto.getColor();
    }

    public void setUser(User user) {
        this.user = user;
        user.setUchildren(this);
    }

    public void setEvent(Event event) {
        this.events.add(event);
    }
}
