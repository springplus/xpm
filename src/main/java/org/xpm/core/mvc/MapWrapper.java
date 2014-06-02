package org.xpm.core.mvc;

import java.util.Map;

/**
 * Created by hongxq on 2014/6/2.
 */
public class MapWrapper {

    private Map map;

    private MapWrapper(Map map){
        this.map = map;
    }

    public static MapWrapper wrap(Map map){
        return new MapWrapper(map);
    }

    public Long getLong(String key) {
        if (getString(key) != null)
            return Long.parseLong(getString(key));
        return null;
    }

    /**
     * @param key
     * @return 若无该参数返回空字符串而非null值
     */
    public String getString(String key) {
        if (!map.containsKey(key))
            return null;
        return map.get(key).toString();
    }

}
