package com.answer.notinote.Search.dto;

import com.answer.notinote.Child.domain.Child;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;


import java.util.List;

@Getter
@NoArgsConstructor
public class SearchSavedListDto {
    private Long nid;
    private Long cid;
    private String title;

    @Builder
    public SearchSavedListDto(Long nid, Long cid, String title){
        this.nid = nid;
        this.cid = cid;
        this.title = title;
    }



}
