package com.answer.notinote.Search.controller;

import com.answer.notinote.Search.dto.SearchListDto;
import com.answer.notinote.Search.service.SearchService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
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

    @RequestMapping(value="/search/{nid}", method = RequestMethod.GET)
    public String searchDetail(){
        return "SearchDetail";
    }

}
