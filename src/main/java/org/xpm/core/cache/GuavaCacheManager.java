package org.xpm.core.cache;

import com.google.common.cache.LoadingCache;
import org.springframework.stereotype.Component;

import java.util.HashMap;

/**
 * Created by hongxq on 2014/6/28
 */
public class GuavaCacheManager {

    private static GuavaCacheManager guavaCacheManager;
    private HashMap<String, LoadingCache> cacheMap = new HashMap<String, LoadingCache>();

    private GuavaCacheManager() {

    }

    public static GuavaCacheManager Instance() {
        if (guavaCacheManager == null) guavaCacheManager = new GuavaCacheManager();
        return guavaCacheManager;
    }

    public LoadingCache<Object, Object> getCache(String cacheName) {
        return cacheMap.get(cacheName);
    }

    /**
     * @param cacheName
     * @param cache
     * @return 如果caches已存在该cacheName则不更换，且返回false
     */
    public boolean putCache(String cacheName, LoadingCache cache) {
        if (cacheMap.containsKey(cacheName)) return false;
        cacheMap.put(cacheName, cache);
        return true;
    }

    /**
     * 不管caches是否已存在该cacheName，强行进行更换
     *
     * @param cacheName
     * @param cache
     * @return 若原已存在cacheName返回true；若不存在cacheName返回false
     */
    public boolean putCacheForce(String cacheName, LoadingCache cache) {
        boolean isExist = false;
        if (cacheMap.containsKey(cacheName)) {
            cacheMap.remove(cacheName);
            isExist = true;
        }
        cacheMap.put(cacheName, cache);
        return isExist;
    }
}
