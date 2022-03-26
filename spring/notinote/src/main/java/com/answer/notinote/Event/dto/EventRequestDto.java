package com.answer.notinote.Event.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class EventRequestDto {
    String content;
    String date;
    int s_index;
    int e_index;
}
