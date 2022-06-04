package com.answer.notinote.Event.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class EventRequestDto implements Comparable<EventRequestDto>{
    String event;
    String date;
    int s_index;
    int e_index;

    @Override
    public int compareTo(EventRequestDto e) {
        if (this.s_index < e.e_index) {
            return -1;
        } else if (this.s_index > e.e_index) {
            return 1;
        }
        return 0;
    }

}
