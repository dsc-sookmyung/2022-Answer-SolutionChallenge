package com.answer.notinote.Search.controller;

import com.answer.notinote.Search.dto.SearchDetailDto;
import com.answer.notinote.Search.dto.SearchListDto;
import com.answer.notinote.Search.service.SearchService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import java.time.LocalDate;
import java.util.List;

@RestController
public class SearchController {

    @Autowired
    SearchService searchService;

    public SearchController(SearchService searchService){
        this.searchService = searchService;
    }

    @RequestMapping(value="/search", method = RequestMethod.GET)
    public List<SearchListDto> searchList(HttpServletRequest request){
        return searchService.searchList(request);
    }

    @RequestMapping(value="/search/detail", method = RequestMethod.GET)
    public SearchDetailDto searchDetail(@RequestParam("date") String date, HttpServletRequest request){
        return searchService.searchDetailList(date, request);
    }

    //@RequestMapping(value="/search/child", method = RequestMethod.GET)
    //public List<SearchListDto> searchChildList(@RequestParam("cid") Long cid, HttpServletRequest request){
    //    return searchService.searchChildList(cid, request);
    //}


}
