package com.answer.notinote.Event.domain.repository;

import com.answer.notinote.Event.domain.Event;
import com.answer.notinote.Notice.domain.entity.Notice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {
    List<Event> findAllByNotice(Notice notice);
}
