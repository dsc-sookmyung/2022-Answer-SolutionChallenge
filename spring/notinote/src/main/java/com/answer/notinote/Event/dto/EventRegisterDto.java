package com.answer.notinote.Event.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Getter @Setter
@AllArgsConstructor
@NoArgsConstructor
public class EventRegisterDto {
    Long cid;
    String title;
    String description;
    LocalDate date;
}
