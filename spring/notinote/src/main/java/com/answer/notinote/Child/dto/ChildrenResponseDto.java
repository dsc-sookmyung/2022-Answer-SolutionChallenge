package com.answer.notinote.Child.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
public class ChildrenResponseDto {
    int event_num = 0;
    List<ChildDto> children = new ArrayList<>();

    public void addChild(ChildDto childDto) {
        children.add(childDto);
        event_num += childDto.getEvents().size();
    }
}
