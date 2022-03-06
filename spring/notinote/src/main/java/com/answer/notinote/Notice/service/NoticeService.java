package com.answer.notinote.Notice.service;

import com.answer.notinote.Notice.domain.entity.Notice;
import com.answer.notinote.Notice.domain.repository.NoticeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;



@Service
public class NoticeService {

    @Autowired
    NoticeRepository noticeRepository;


}
