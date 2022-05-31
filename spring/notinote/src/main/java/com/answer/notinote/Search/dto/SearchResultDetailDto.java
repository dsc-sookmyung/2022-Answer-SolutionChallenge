package com.answer.notinote.Search.dto;

import com.answer.notinote.Notice.dto.NoticeEventDto;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@NoArgsConstructor
public class SearchResultDetailDto {
    private Long id;
    private String imageUri;
    private List<NoticeEventDto> fullText;
    private String korean;

    @Builder
    public SearchResultDetailDto(Long id, String imageUri, List<NoticeEventDto> fullText, String korean){
        this.id = id;
        this.imageUri = imageUri;
        this.fullText = fullText;
        this.korean = korean;
    }
}
