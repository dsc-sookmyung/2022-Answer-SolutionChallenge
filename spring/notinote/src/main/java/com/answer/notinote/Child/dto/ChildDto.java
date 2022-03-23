package com.answer.notinote.Child.dto;


import com.answer.notinote.Child.domain.Child;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
public class ChildDto {
    Long cid;
    String cname;
    Long color;

    public ChildDto(Child child) {
        this.cid = child.getCid();
        this.cname = child.getCname();
        this.color = child.getColor();
    }
}
