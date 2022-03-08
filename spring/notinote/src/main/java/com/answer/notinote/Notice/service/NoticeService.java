package com.answer.notinote.Notice.service;


import com.answer.notinote.Notice.domain.repository.NoticeRepository;
import com.google.cloud.vision.v1.*;
import com.google.protobuf.ByteString;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;


@Service
public class NoticeService {

    @Autowired
    NoticeRepository noticeRepository;

    public String saveImage(MultipartFile uploadfile){
        String nimagename = uploadfile.getOriginalFilename();
        String uuid = UUID.randomUUID().toString();
        nimagename = uuid + nimagename;
        String uploadPath = System.getProperty("user.dir")+"/src/main/resources/static";
        try {
            File saveFile = new File(uploadPath, nimagename);
            uploadfile.transferTo(saveFile);

        } catch (Exception e){
            e.printStackTrace();
        }

        return uploadPath+'/'+nimagename;
    }

    public String detectText(String filePath) throws IOException{
        List<AnnotateImageRequest> requests = new ArrayList<>();

        ByteString imgBytes = ByteString.readFrom(new FileInputStream(filePath));

        Image img = Image.newBuilder().setContent(imgBytes).build();
        Feature feat = Feature.newBuilder().setType(Feature.Type.TEXT_DETECTION).build();
        AnnotateImageRequest request =
                AnnotateImageRequest.newBuilder().addFeatures(feat).setImage(img).build();
        requests.add(request);
        ArrayList <String> text = new ArrayList<String>();


        try (ImageAnnotatorClient client = ImageAnnotatorClient.create()) {
            BatchAnnotateImagesResponse response = client.batchAnnotateImages(requests);
            List<AnnotateImageResponse> responses = response.getResponsesList();


            for (AnnotateImageResponse res : responses) {
                if (res.hasError()) {
                    System.out.format("Error: %s%n", res.getError().getMessage());
                    return "error";
                }

                for (EntityAnnotation annotation : res.getTextAnnotationsList()) {
                    text.add(String.format("%s", annotation.getDescription()));


                }
            }
            System.out.println("Text : "+text.get(0));
        }
        return text.get(0);
    }




}
