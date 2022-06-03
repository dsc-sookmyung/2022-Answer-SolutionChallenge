package com.answer.notinote.Search.dto;

import com.answer.notinote.Notice.dto.NoticeSentenceDto;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@NoArgsConstructor
public class SearchResultDetailDto {
    private String imageUri;
    private List<NoticeSentenceDto> fullText;
    private String korean;

    @Builder
    public SearchResultDetailDto(String imageUri, List<NoticeSentenceDto> fullText, String korean){
        this.imageUri = imageUri;
        this.fullText = fullText;
        this.korean = korean;
    }
}
