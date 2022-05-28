package com.answer.notinote.Notice.dto;

import com.answer.notinote.Event.dto.EventRequestDto;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter @Setter
public class NoticeResponseBody {
    int status;
    List<EventRequestDto> body;
}
