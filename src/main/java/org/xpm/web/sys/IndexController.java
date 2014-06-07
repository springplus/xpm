package org.xpm.web.sys;

import org.apache.shiro.web.filter.authc.FormAuthenticationFilter;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.view.RedirectView;

import javax.servlet.http.HttpServletRequest;

/**
 * LoginController负责打开登录页面(GET请求)和登录出错页面(POST请求)，
 * 
 * 真正登录的POST请求由Filter完成,
 * 
 * @author calvin
 */
@Controller
public class IndexController {

    @RequestMapping(value = "/")
	public ModelAndView index(HttpServletRequest request) {

		return new ModelAndView(new RedirectView(request.getContextPath()+"/static/index.html"));
	}


//    @RequestMapping(value = "/favicon.ico")
//    public ModelAndView favicon(HttpServletRequest request) {
//
//        return new ModelAndView(new RedirectView(request.getContextPath()+"/static/index.html"));
//    }
}
