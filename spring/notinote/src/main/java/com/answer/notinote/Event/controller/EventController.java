package com.answer.notinote.Event.controller;

import com.answer.notinote.Child.domain.Child;
import com.answer.notinote.Child.service.ChildService;
import com.answer.notinote.Event.domain.Event;
import com.answer.notinote.Event.dto.EventRequestDto;
import com.answer.notinote.Event.dto.EventResponseDto;
import com.answer.notinote.Event.service.EventService;
import com.answer.notinote.Event.service.GoogleCalendarService;
import io.swagger.models.Response;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.security.GeneralSecurityException;

@RestController
@RequiredArgsConstructor
public class EventController {

    private final EventService eventService;
    private final ChildService childService;
    private final GoogleCalendarService calendarService;

    @PostMapping("/event")
    public ResponseEntity<?> createEvent(@RequestParam(value = "id") Long id, @RequestBody EventRequestDto requestDto) {
        Child child = childService.findById(id);

        Event event = eventService.create(requestDto, child);

        return ResponseEntity.ok(new EventResponseDto(event));
    }

    @PostMapping("/event/calendar")
    public ResponseEntity<?> createEventInCalendar(@RequestParam(value = "id") Long id) throws GeneralSecurityException, IOException {
        Event event = eventService.findEventById(id);
        calendarService.createEvent(event);

        return ResponseEntity.ok(new EventResponseDto(event));
    }
}
