package com.answer.notinote.Event.controller;

import com.answer.notinote.Event.domain.Event;
import com.answer.notinote.Event.dto.EventRegisterDto;
import com.answer.notinote.Event.dto.EventRequestDto;
import com.answer.notinote.Event.dto.EventResponseDto;
import com.answer.notinote.Event.service.EventService;
import com.answer.notinote.Notice.domain.entity.Notice;
import com.answer.notinote.Notice.service.NoticeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.security.GeneralSecurityException;
import java.util.ArrayList;
import java.util.List;


@RestController
@RequiredArgsConstructor
public class EventController {

    private final EventService eventService;
    private final NoticeService noticeService;

    @PostMapping("/event")
    public ResponseEntity<?> createEvent(@RequestParam(value = "id") Long id, @RequestBody EventRequestDto requestDto) {
        Notice notice = noticeService.findNoticeById(id);

        Event event = eventService.create(requestDto, notice);

        return ResponseEntity.ok(new EventResponseDto(event));
    }

    @GetMapping("/event")
    public ResponseEntity<?> getEventList() {
        List<Event> eventList = eventService.findAll();
        List<EventResponseDto> response = new ArrayList<>();
        for (Event event : eventList)
            response.add(new EventResponseDto(event));

        return ResponseEntity.ok(response);
    }

    @PutMapping("/event/register")
    public ResponseEntity<?> registerEvent(@RequestParam(value = "eid") Long eid, @RequestBody EventRegisterDto registerDto) throws GeneralSecurityException, IOException {
        return ResponseEntity.ok(eventService.registerEvent(eid, registerDto));
    }
}
