package com.answer.notinote.Event.domain;

import com.answer.notinote.Child.domain.Child;
import com.answer.notinote.Event.dto.EventRegisterDto;
import com.answer.notinote.Event.dto.EventRequestDto;
import com.answer.notinote.Event.util.BooleanToYNConverter;
import com.answer.notinote.Notice.domain.entity.Notice;
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
public class Event extends Timestamped implements Comparable<Event>  {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column
    private Long eid;

    @Column
    private int index_start;

    @Column
    private int index_end;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cid")
    private Child child;

    @ManyToOne(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JoinColumn(name = "nid")
    private Notice notice;

    @Column(length = 50)
    private String title;

    @Column(length = 100)
    private String description;

    @Column
    private LocalDate date;

    @Convert(converter = BooleanToYNConverter.class)
    @Column(length = 1)
    private boolean registered = false;

    public Event(EventRequestDto requestDto) {
        this.index_start = requestDto.getS_index();
        this.index_end = requestDto.getE_index();
        this.title = requestDto.getEvent();
        this.date = LocalDate.parse(requestDto.getDate());
    }

    public void setNotice(Notice notice) {
        this.notice = notice;
        notice.setEvent(this);
    }

    public void setChild(Child child) {
        this.child = child;
        child.setEvent(this);
    }

    public void register(EventRegisterDto requestDto) {
        this.title = requestDto.getTitle();
        this.date = requestDto.getDate();
        this.description = requestDto.getDescription();
        this.registered = true;
    }

    @Override
    public int compareTo(Event e) {
        if (this.index_start < e.index_start) return -1;
        if (this.index_start > e.index_start) return 1;
        return 0;
    }
}
