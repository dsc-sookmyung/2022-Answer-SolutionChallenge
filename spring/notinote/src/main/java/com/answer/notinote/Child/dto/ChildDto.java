package com.answer.notinote.Child.dto;


import com.answer.notinote.Child.domain.Child;
import com.answer.notinote.Event.domain.Event;
import com.answer.notinote.Event.dto.EventResponseDto;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
public class ChildDto {
    Long cid;
    String cname;
    Long color;
    List<EventResponseDto> events = new ArrayList<>();

    public ChildDto(Child child) {
        this.cid = child.getCid();
        this.cname = child.getCname();
        this.color = child.getColor();

        for(Event event : child.getEvents()) {
                if (event.isRegistered()) this.events.add(new EventResponseDto(event));
        }
    }
}
