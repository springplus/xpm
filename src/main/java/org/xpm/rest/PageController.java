package org.xpm.rest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springside.modules.web.MediaTypes;
import org.xpm.entity.Page;
import org.xpm.repository.PageDao;

import java.util.List;

/**
 * Created by hongxueqian on 14-3-16.
 */
@Controller
@RequestMapping(value="/api/pages")
public class PageController {
    private static Logger logger = LoggerFactory.getLogger(PageController.class);
    private PageDao pageDao;

    @Autowired
    private void setPageDao(PageDao pageDao){
        this.pageDao = pageDao;
    }

    @RequestMapping(method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
    @ResponseBody
    public List<Page> list(){
        return (List<Page>)pageDao.findAll();
    }

    @RequestMapping(value = "/query/{id}",method = RequestMethod.GET,produces = MediaTypes.JSON_UTF_8)
    @ResponseBody
    public Page get(@PathVariable("id") Long id){
        return pageDao.findOne(id);
    }


//    private Page fillDataItemValue(Page page){
//        page.getConfig()
//
//    }

//    @RequestMapping(value = "/{id}",method = RequestMethod.GET,produces = MediaTypes.JSON_UTF_8)
//    @ResponseBody
//    public Page get(@PathVariable("id") Long id){
//        return pageDao.findOne(id);
//    }

}
