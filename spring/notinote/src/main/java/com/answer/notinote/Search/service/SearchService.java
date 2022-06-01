package com.answer.notinote.Search.service;

import com.answer.notinote.Auth.token.provider.JwtTokenProvider;
import com.answer.notinote.Event.domain.Event;
import com.answer.notinote.Event.service.EventService;
import com.answer.notinote.Notice.domain.entity.Notice;
import com.answer.notinote.Notice.domain.repository.NoticeRepository;
import com.answer.notinote.Notice.dto.NoticeSentenceDto;
import com.answer.notinote.Notice.service.NoticeService;
import com.answer.notinote.Search.dto.SearchDetailDto;
import com.answer.notinote.Search.dto.SearchListDto;
import com.answer.notinote.Search.dto.SearchResultDetailDto;
import com.answer.notinote.User.domain.entity.User;
import com.answer.notinote.User.domain.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.servlet.http.HttpServletRequest;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;


@Service
public class SearchService {
    @Autowired
    NoticeRepository noticeRepository;
    @Autowired
    EventService eventService;
    @Autowired
    NoticeService noticeService;
    @Autowired
    UserRepository userRepository;
    @Autowired
    JwtTokenProvider jwtTokenProvider;

    public List<SearchListDto> searchList(HttpServletRequest request){

        String token = jwtTokenProvider.resolveAccessToken(request);
        String useremail = jwtTokenProvider.getUserEmail(token);
        User user = userRepository.findByUemail(useremail).orElseThrow(IllegalArgumentException::new);

        List<Notice> notices = noticeRepository.findByUser(user);

        List<LocalDate> dateList = new ArrayList<>();
        List<List<String>> titleLists = new ArrayList<>();
        List<SearchListDto> searchListDtos = new ArrayList<>();

        //유니크한 날짜값만 리스트에 저장하는 jpa 쿼리 메소드
        for(int i = 0; i < noticeRepository.findUniqueNdate(user).size(); i++){
            dateList.add(noticeRepository.findUniqueNdate(user).get(i).getNdate());
        }

        dateList.sort(Comparator.reverseOrder()); //최신순 정렬

        for(int i = 0; i < dateList.size(); i++){
            List<String> titleList = new ArrayList<>();
            for(int j = 0; j < notices.size(); j++){
                if((notices.get(j).getNdate()).equals(dateList.get(i))) {
                    titleList.add(notices.get(j).getTitle());
                }
            }
            titleLists.add(titleList);
            SearchListDto searchListDto = SearchListDto.builder()
                    .date(dateList.get(i))
                    .saved_titles(titleLists.get(i))
                    .build();
            searchListDtos.add(searchListDto);
        }
        return searchListDtos;
    }

    public SearchDetailDto searchDetailList(String date, HttpServletRequest request) {

        String token = jwtTokenProvider.resolveAccessToken(request);
        String useremail = jwtTokenProvider.getUserEmail(token);
        User user = userRepository.findByUemail(useremail).orElseThrow(IllegalArgumentException::new);
        LocalDate trans_date = LocalDate.parse(date, DateTimeFormatter.ISO_DATE);
        List<Notice> notices = noticeRepository.findByNdate(trans_date);

        System.out.println(notices);
        List<List<Object>> resultLists = new ArrayList<>();
        List<Object> test = new ArrayList<>();

        for (int i = 0; i<notices.size(); i++){
            Notice notice = notices.get(i);

            List<Event> events = eventService.findAllByNotice(notice);
            List<NoticeSentenceDto> fullText = noticeService.extractSentenceFromEvent(notice.getTrans_full(), events);

            SearchResultDetailDto searchResultDetailDto = SearchResultDetailDto.builder()
                    .imageUri(notice.getNimageurl()+"/"+notice.getNimagename())
                    .id(notice.getNid())
                    .korean(notice.getOrigin_full())
                    .fullText(fullText)
                    .build();

            test.add(searchResultDetailDto);
        }
        System.out.println(test);

        return SearchDetailDto.builder()
                .date(trans_date)
                .results(test)
                .build();

    }
}
