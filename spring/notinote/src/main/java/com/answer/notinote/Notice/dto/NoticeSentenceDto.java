package com.answer.notinote.Notice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;

@Getter
@AllArgsConstructor
@Builder
public class NoticeSentenceDto {
    int id;
    long eid;
    String content;
    LocalDate date;
    boolean highlight;
    boolean registered;
}
