package com.answer.notinote.Notice.domain.repository;

import com.answer.notinote.Child.domain.Child;
import com.answer.notinote.Notice.domain.entity.Notice;
import com.answer.notinote.Search.domain.repository.SearchDateInf;
import com.answer.notinote.User.domain.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;


import java.time.LocalDate;
import java.util.List;


@Repository
public interface NoticeRepository extends JpaRepository<Notice, Long> {

    Notice findByNid(Long nid);

    @Query("SELECT distinct n.ndate as ndate FROM Notice n, User u WHERE n.user.uid = u.uid")
    List<SearchDateInf> findUniqueNdate(User user);

    List<Notice> findByUser(User user);

    List<Notice> findByNdate(LocalDate date);

    List<Notice> findByUserAndChild(User user, Child child);
}