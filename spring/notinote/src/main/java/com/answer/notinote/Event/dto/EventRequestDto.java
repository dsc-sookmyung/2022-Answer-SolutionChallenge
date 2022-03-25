package com.answer.notinote.Event.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class EventRequestDto {
    String title;
    Long index_start;
    Long index_end;
    LocalDate date;
}
