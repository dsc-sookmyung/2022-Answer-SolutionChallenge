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

        // [이름] 제거
        if (this.title.charAt(0) == '[') {
            while(this.title.charAt(0) != ']' || this.title.length() <= 1)
                this.title = this.title.substring(1);
            this.title = this.title.substring(1);
        }

        this.description = event.getDescription();
        this.date = event.getDate();
    }
}
