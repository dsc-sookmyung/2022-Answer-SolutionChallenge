package com.answer.notinote.Notice.service;


import com.answer.notinote.Notice.domain.entity.Notice;
import com.answer.notinote.Notice.domain.repository.NoticeRepository;
import com.answer.notinote.Notice.dto.ImageRequestDto;
import com.google.cloud.translate.v3.*;
import com.google.cloud.translate.v3.LocationName;
import com.google.cloud.translate.v3.Translation;
import com.google.cloud.vision.v1.*;
import com.google.protobuf.ByteString;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;


@Service
public class NoticeService {

    @Autowired
    NoticeRepository noticeRepository;

    public Long saveImage(MultipartFile uploadfile){
        String nimageoriginal = uploadfile.getOriginalFilename();
        String uuid = UUID.randomUUID().toString();
        String nimagename = uuid + nimageoriginal;
        Long nid = null;
        String nimageurl = System.getProperty("user.dir")+"/src/main/resources/static";
        try {
            File saveFile = new File(nimageurl, nimagename);
            uploadfile.transferTo(saveFile);

            ImageRequestDto imageRequestDto = ImageRequestDto.builder()
                    .nimagename(nimagename)
                    .nimageoriginal(nimageoriginal)
                    .nimageurl(nimageurl)
                    .build();
            nid = noticeRepository.save(imageRequestDto.toNoticeEntity()).getNid();

        } catch (Exception e){
            e.printStackTrace();
        }

        return nid;
    }



    public String detectText(Long nid) throws IOException{
        List<AnnotateImageRequest> requests = new ArrayList<>();

        Notice notice = noticeRepository.findByNid(nid);
        String nimageurl = notice.getNimageurl();
        String nimagename = notice.getNimagename();
        String filePath = nimageurl + '/' + nimagename;

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
            //System.out.println("Text : "+text.get(0));
        }

        notice.update_origin_full(text.get(0));
        noticeRepository.save(notice);
        //리턴을 string이 아닌 entity로 하면 조회하는 횟수를 1회 줄일 수 있어서 추후 수정 필요

        return text.get(0);
    }

    public String transText(Long nid) throws IOException {
        Notice notice = noticeRepository.findByNid(nid);
        String text = notice.getOrigin_full();
        String projectId = "notinote-341918";
        String targetLanguage = "en"; // 추후 입력받아야함
        ArrayList <String> textlist = new ArrayList<String>();

        try (TranslationServiceClient client = TranslationServiceClient.create()) {
            LocationName parent = LocationName.of(projectId, "global");

            // Supported Mime Types: https://cloud.google.com/translate/docs/supported-formats
            TranslateTextRequest request =
                    TranslateTextRequest.newBuilder()
                            .setParent(parent.toString())
                            .setMimeType("text/plain")
                            .setTargetLanguageCode(targetLanguage)
                            .addContents(text)
                            .build();

            TranslateTextResponse response = client.translateText(request);

            for (Translation translation : response.getTranslationsList()) {
                textlist.add(String.format("%s", translation.getTranslatedText()));
            }
            //System.out.println("Text : "+textlist.get(0));
        }
        notice.update_trans_full(textlist.get(0));
        noticeRepository.save(notice);
        return textlist.get(0);
    }

    public String transSumText(Long nid) throws IOException {

        Notice notice = noticeRepository.findByNid(nid);
        //추후 nid값 이외에도 인공지능에 넘어온 요약 스트링까지 인자값으로 받아야함
        //List<String> summarizedKoreanlist = Arrays.asList(text.split(","));
        //System.out.println("Text : "+summarizedKoreanlist.size());
        List <String> summarizedKoreanlist = new ArrayList<String>();
        summarizedKoreanlist.add("졸업식은 2월 17일 3시입니다.");
        summarizedKoreanlist.add("학부모님 모두 참석이 가능합니다.");

        String projectId = "notinote-341918";
        String targetLanguage = "en"; // 추후 입력받아야함
        ArrayList <String> textlist = new ArrayList<String>();

        try (TranslationServiceClient client = TranslationServiceClient.create()) {
            LocationName parent = LocationName.of(projectId, "global");

            // Supported Mime Types: https://cloud.google.com/translate/docs/supported-formats
            for (String text : summarizedKoreanlist) {
                TranslateTextRequest request =
                        TranslateTextRequest.newBuilder()
                                .setParent(parent.toString())
                                .setMimeType("text/plain")
                                .setTargetLanguageCode(targetLanguage)
                                .addContents(text)
                                .build();

                TranslateTextResponse response = client.translateText(request);

                for (Translation translation : response.getTranslationsList()) {
                    textlist.add(String.format("%s", translation.getTranslatedText()));
                }
            }
        }
        notice.update_trans_sum(textlist.toString());
        noticeRepository.save(notice);
        return textlist.toString();
    }

}
