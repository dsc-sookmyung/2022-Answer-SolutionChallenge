package com.answer.notinote.Event.domain;

import com.answer.notinote.Child.domain.Child;
import com.answer.notinote.Event.dto.EventRequestDto;
import com.answer.notinote.Event.util.BooleanToYNConverter;
import com.answer.notinote.User.domain.entity.Timestamped;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.time.LocalDate;

@Entity
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class Event extends Timestamped {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column
    private Long eid;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cid")
    private Child child;

    @Column(length = 1000)
    private String content;

    @Column
    private LocalDate date;

    @Convert(converter = BooleanToYNConverter.class)
    @Column(length = 1)
    private boolean registered;

    @Convert(converter = BooleanToYNConverter.class)
    @Column(length = 1)
    private boolean highlight;

    public Event(EventRequestDto eventDto) {
        this.content = eventDto.getContent();
        this.date = eventDto.getDate();
        this.registered = eventDto.getRegistered();
        this.highlight = eventDto.getHighlight();
    }

    public void setChild(Child child) {
        this.child = child;
        child.setEvents(this);
    }

    public void register() {
        this.registered = true;
    }
}
