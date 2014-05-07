package org.xpm.web.common;

import org.apache.commons.io.FileUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;
import org.xpm.core.orm.mybatis.BaseDao;

import java.io.File;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.UUID;

/**
 * Created by hongxueqian on 14-4-16.
 */
@Controller
public class FileController {
    private final static String STATUES_UPLOAD_CLIEND_FAIL = "0";
    private final static String STATUES_UPLOAD_SERVER_FAIL = "-1";
    private Logger logger = LoggerFactory.getLogger(FileController.class);

    @Autowired
    private BaseDao<org.xpm.entity.common.File> baseDao;

    @RequestMapping(value = "/api/upload")
    @ResponseBody
    public String upload(@RequestParam(value = "file", required = false) MultipartFile file, @RequestParam(value = "description", required = false) String description) {

        //        byte[] getBytes() :获取文件数据
        //        String getContentType():获取文件MIME类型，如image/pjpeg、text/plain等
        //        InputStream getInputStream():获取文件流
        //        String getName():获取表单中文件组件的名字
        //        String getOriginalFilename():获取上传文件的原名
        //        long getSize():获取文件的字节大小，单位为byte
        //        boolean isEmpty():是否有上传的文件
        //        void transferTo(File dest):可以使用该文件将上传文件保存到一个目标文件中

        //是否有上传的文件
        if (file == null || file.isEmpty()) return STATUES_UPLOAD_CLIEND_FAIL;
        System.out.println("开始");
        String path = "D:\\java\\ws\\projects-opensource\\springside\\xpm\\issues\\src\\main\\webapp\\static\\files\\upload\\tmp";
        String fileName = rename(file.getOriginalFilename());
        File targetFile = new File(path, fileName);
        logger.debug(">>>将保存文件到：{}", targetFile.getPath());
        if (!targetFile.exists()) {
            targetFile.mkdirs();
        }

        //保存
        try {
            file.transferTo(targetFile);
            logger.debug(">>>成功将文件保存到：{}", targetFile.getPath());

        } catch (Exception e) {
            logger.error("已成功获取客户端的文件，但保存时出错！{}", e);
            return STATUES_UPLOAD_SERVER_FAIL;
        }

        org.xpm.entity.common.File f = new org.xpm.entity.common.File();
        f.setContentType(file.getContentType());
        f.setUuid(UUID.randomUUID().toString());
        f.setLocalPath(targetFile.getPath());
        f.setOriginalName(file.getOriginalFilename());
        f.setSize(file.getSize());
        f.setDescription(description);
        baseDao.save(f);
        return f.getUuid();
    }

    @RequestMapping(value = "/api/uploads")
    @ResponseBody
    public String uploads(@RequestParam(value = "files", required = false) MultipartFile[] files) {
//
//        //是否有上传的文件
//        if (file==null||file.isEmpty()) return STATUES_UPLOAD_CLIEND_FAIL;
//        System.out.println("开始");
//        String path = "D:\\java\\ws\\projects-opensource\\springside\\xpm\\issues\\src\\main\\webapp\\static\\files\\upload\\tmp";
//        String fileName = file.getOriginalFilename();
//        File targetFile = new File(path, fileName);
//        logger.debug(">>>将保存文件到：{} {}", targetFile.getPath(), targetFile.getName());
//        if (!targetFile.exists()) {
//            targetFile.mkdirs();
//        }
//
//        //保存
//        try {
//            file.transferTo(targetFile);
//        } catch (Exception e) {
//            logger.error("已成功获取客户端的文件，但保存时出错！{}", e);
//            return STATUES_UPLOAD_SERVER_FAIL;
//        }
//
//        //TODO 取得文档保存到数据表中的ID，并返回。
        Long fileId = 1L;
        return fileId + "";
    }

    @RequestMapping("/api/download/{uuid}")
    public ResponseEntity<byte[]> download(@PathVariable("uuid") String uuid) {
        //TODO 下载出错
        org.xpm.entity.common.File file = baseDao.findOne(org.xpm.entity.common.File.class, "uuid", uuid);
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
        headers.setContentDispositionFormData("attachment", file.getOriginalName());
        ResponseEntity<byte[]> re = null;
        try {
            re = new ResponseEntity<byte[]>(FileUtils.readFileToByteArray(new File(file.getLocalPath())),
                    headers, HttpStatus.CREATED);
        } catch (IOException e) {
            logger.error("读本地文件{}，创建ResponseEntity时出错！", file.getLocalPath());
        }
        return re;
    }

    public static HttpHeaders httpHeaderExcelFileAttachment(final String fileName,
                                                            final int fileSize) {
        String encodedFileName = fileName.replace('"', ' ').replace(' ', '_');

        HttpHeaders responseHeaders = new HttpHeaders();
        responseHeaders.setContentType(MediaType.parseMediaType("application/vnd.ms-excel"));
        responseHeaders.setContentLength(fileSize);
        responseHeaders.set("Content-Disposition", "attachment");
        responseHeaders.add("Content-Disposition", "filename=\"" + encodedFileName + '\"');
        return responseHeaders;
    }

    private static String rename(String name) {
        Long now = Long.parseLong(new SimpleDateFormat("yyyyMMddHHmmss")
                .format(new Date()));
        Long random = (long) (Math.random() * now);
        String fileName = now + "" + random;

        if (name.indexOf(".") != -1) {
            fileName += name.substring(name.lastIndexOf("."));
        }
        return fileName;
    }

    private static String zipName(String name) {
        String prefix = "";
        if (name.indexOf(".") != -1) {
            prefix = name.substring(0, name.lastIndexOf("."));
        } else {
            prefix = name;
        }
        return prefix + ".zip";
    }

}
