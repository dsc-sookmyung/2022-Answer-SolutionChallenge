package com.answer.notinote.Event.service;

import com.answer.notinote.Child.domain.Child;
import com.answer.notinote.Event.domain.Event;
import com.answer.notinote.Event.domain.repository.EventRepository;
import com.answer.notinote.Event.dto.EventRequestDto;
import com.answer.notinote.Exception.CustomException;
import com.answer.notinote.Exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EventService {

    private final EventRepository eventRepository;

    public Event create(EventRequestDto eventDto, Child child) {
        Event event = new Event(eventDto);
        event.setChild(child);

        return eventRepository.save(event);
    }

    public void registerEvent(Long id) {
        Event event = findEventById(id);
        event.register();
    }

    public Event findEventById(Long id) {
        return eventRepository.findById(id).orElseThrow(
                () -> new CustomException(ErrorCode.NOT_FOUND)
        );
    }
}
