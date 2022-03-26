package com.answer.notinote.Event.service;

import com.answer.notinote.Child.domain.Child;
import com.answer.notinote.Child.service.ChildService;
import com.answer.notinote.Event.domain.Event;
import com.answer.notinote.Event.domain.repository.EventRepository;
import com.answer.notinote.Event.dto.EventRegisterDto;
import com.answer.notinote.Event.dto.EventRequestDto;
import com.answer.notinote.Event.dto.urlResponseDto;
import com.answer.notinote.Exception.CustomException;
import com.answer.notinote.Exception.ErrorCode;
import com.answer.notinote.Notice.domain.entity.Notice;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.security.GeneralSecurityException;
import java.util.List;

@Service
@RequiredArgsConstructor
public class EventService {

    private final EventRepository eventRepository;
    private final ChildService childService;
    private final GoogleCalendarService calendarService;

    public Event create(EventRequestDto requestDto, Notice notice) {
        Event event = new Event(requestDto);
        event.setNotice(notice);
        eventRepository.save(event);

        return event;
    }

    @Transactional
    public urlResponseDto registerEvent(Long id, EventRegisterDto requestDto) throws GeneralSecurityException, IOException {
        Event event = findEventById(id);
        Child child = childService.findChildById(requestDto.getCid());

        event.register(requestDto);
        event.setChild(child);
        eventRepository.save(event);

        String url = calendarService.createEvent(event);
        return new urlResponseDto(url);
    }

    public Event findEventById(Long id) {
        return eventRepository.findById(id).orElseThrow(
                () -> new CustomException(ErrorCode.NOT_FOUND)
        );
    }

    public List<Event> findAll() {
        return eventRepository.findAll();
    }

    public List<Event> findAllByNotice(Notice notice) {
        return eventRepository.findAllByNotice(notice);
    }
}
