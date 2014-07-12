package org.xpm.core.orm.mybatis.sqlParser;

import com.google.common.reflect.Parameter;
import org.apache.shiro.crypto.hash.Hash;

import java.util.*;

/**
 * Created by hongxq on 2014/6/30.
 */
public class ParameterParser {

    //TODO
    public static List<HashMap<String,String>> parse(String sql){
        ArrayList<HashMap<String,String>> al = new ArrayList<HashMap<String, String>>();

        HashMap<String,String> map = new HashMap();
        map.put("name", "project.code");
        al.add(map);

        HashMap<String,String> map2 = new HashMap();
        map2.put("name", "project.name");
        al.add(map2);

        return al;
    }


}
