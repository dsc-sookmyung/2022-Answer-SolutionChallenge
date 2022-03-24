package com.answer.notinote.Event.dto;

import com.answer.notinote.Event.domain.Event;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class EventResponseDto {
    private Long eid;
    private String title;
    private String description;
    private LocalDate date;

    public EventResponseDto(Event event) {
        this.eid = event.getEid();
        this.title = event.getTitle();
        this.description = event.getDescription();
        this.date = event.getDate();
    }
}
