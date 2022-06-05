package com.answer.notinote.Child.dto;


import com.answer.notinote.Child.domain.Child;
import com.answer.notinote.Event.domain.Event;
import com.answer.notinote.Event.dto.EventResponseDto;
import com.answer.notinote.Notice.domain.entity.Notice;
import com.google.api.client.util.DateTime;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
public class ChildDto {
    Long cid;
    String cname;
    Long color;
    Long cprofileImg;
    List<String> events = new ArrayList<>();

    public ChildDto(Child child) {
        this.cid = child.getCid();
        this.cname = child.getCname();
        this.color = child.getColor();
        this.cprofileImg = child.getCprofileImg();

        for(Event event : child.getEvents()) {
                if (event.isRegistered() && event.getDate().isEqual(LocalDate.now()))
                    this.events.add(event.getTitle());
        }
    }
}
