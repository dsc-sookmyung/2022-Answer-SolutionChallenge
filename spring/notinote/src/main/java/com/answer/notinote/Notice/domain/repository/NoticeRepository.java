package com.answer.notinote.Notice.domain.repository;

import com.answer.notinote.Notice.domain.entity.Notice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NoticeRepository extends JpaRepository<Notice, Integer> {
    Notice save(Notice notice);
}
