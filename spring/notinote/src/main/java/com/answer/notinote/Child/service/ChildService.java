package com.answer.notinote.Child.service;


import com.answer.notinote.Child.domain.Child;
import com.answer.notinote.Child.domain.repository.ChildRepository;
import com.answer.notinote.Child.dto.ChildDto;
import com.answer.notinote.Util.exception.CustomException;
import com.answer.notinote.Util.exception.ErrorCode;
import com.answer.notinote.User.domain.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ChildService {

    private final ChildRepository childRepository;

    public Child create(ChildDto childDto, User user) {
        Child child = new Child(childDto);
        child.setUser(user);

        return childRepository.save(child);
    }

    public Child findChildById(Long id) {
        return childRepository.findById(id).orElseThrow(
                () -> new CustomException(ErrorCode.NOT_FOUND)
        );
    }
}
