package com.answer.notinote.Event.dto;

import com.answer.notinote.Event.domain.Event;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class EventResponseDto {
    private String title;

    public EventResponseDto(Event event) {
        this.title = event.getTitle();

        // [이름] 제거
        if (this.title.charAt(0) == '[') {
            while(this.title.charAt(0) != ']' || this.title.length() <= 1)
                this.title = this.title.substring(1);
            this.title = this.title.substring(1);
        }
    }
}
