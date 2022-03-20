package com.answer.notinote.Notice.service;


import com.answer.notinote.Auth.token.provider.JwtTokenProvider;
import com.answer.notinote.Notice.domain.entity.Notice;
import com.answer.notinote.Notice.domain.repository.NoticeRepository;
import com.answer.notinote.Notice.dto.ImageRequestDto;
import com.answer.notinote.Notice.dto.NoticeRequestDto;
import com.answer.notinote.User.domain.entity.User;
import com.answer.notinote.User.domain.repository.UserRepository;
import com.google.cloud.language.v1.*;
import com.google.cloud.translate.v3.*;
import com.google.cloud.translate.v3.LocationName;
import com.google.cloud.translate.v3.Translation;
import com.google.cloud.vision.v1.*;
import com.google.protobuf.ByteString;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletRequest;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.util.*;


@Service
public class NoticeService {

    @Autowired
    NoticeRepository noticeRepository;
    @Autowired
    UserRepository userRepository;
    @Autowired
    JwtTokenProvider jwtTokenProvider;

    public Long saveImage(MultipartFile uploadfile, HttpServletRequest request){
        String nimageoriginal = uploadfile.getOriginalFilename();
        String uuid = UUID.randomUUID().toString();
        String nimagename = uuid + nimageoriginal;
        Long nid = null;

        String token = jwtTokenProvider.resolveToken(request);
        String useremail = jwtTokenProvider.getUserEmail(token);
        User user = userRepository.findByUemail(useremail).orElseThrow(IllegalArgumentException::new);

        System.out.println(user);
        String nimageurl = System.getProperty("user.dir")+"/src/main/resources/static";
        try {
            File saveFile = new File(nimageurl, nimagename);
            uploadfile.transferTo(saveFile);

            ImageRequestDto imageRequestDto = ImageRequestDto.builder()
                    .nimagename(nimagename)
                    .nimageoriginal(nimageoriginal)
                    .nimageurl(nimageurl)
                    .user(user)
                    .build();
            nid = noticeRepository.save(imageRequestDto.toNoticeEntity(user)).getNid();

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

    public String saveNotice(Long nid, NoticeRequestDto noticeRequestDto, HttpServletRequest request){

        Notice notice = noticeRepository.findByNid(nid);
        String token = jwtTokenProvider.resolveToken(request);
        String useremail = jwtTokenProvider.getUserEmail(token);
        User user = userRepository.findByUemail(useremail).orElseThrow(IllegalArgumentException::new);

        if ((notice.getUser()).getUid().equals(user.getUid())){
            notice.update_title_ndate(noticeRequestDto.getTitle(), noticeRequestDto.getNdate());
            noticeRepository.save(notice);
            return "successs";
        }
        else {
            return "fail";
        }
    }

    /*public String dateDetect(Long nid) throws IOException {
        Notice notice = noticeRepository.findByNid(nid);
        String text = notice.getTrans_sum();
        List<String> summarizedKoreanlist = Arrays.asList(text.split(","));
        //System.out.println("Text : "+summarizedKoreanlist.size());
        //List <String> summarizedKoreanlist = new ArrayList<String>();
        //summarizedKoreanlist.add("졸업식은 2월 17일 3시입니다.");
        //summarizedKoreanlist.add("학부모님 모두 참석이 가능합니다.");

        try (LanguageServiceClient language = LanguageServiceClient.create()) {
            for (String texttest : summarizedKoreanlist){
                System.out.println(texttest);
                Document doc = Document.newBuilder().setContent(texttest).setType(Document.Type.PLAIN_TEXT).build();
                AnalyzeEntitiesRequest request =
                        AnalyzeEntitiesRequest.newBuilder()
                                .setDocument(doc)
                                .setEncodingType(EncodingType.UTF16)
                                .build();

                AnalyzeEntitiesResponse response = language.analyzeEntities(request);

                // Print the response
                for (Entity entity : response.getEntitiesList()) {
                    System.out.println(entity);
                    if (entity.getType().equals("EVENT")){
                        System.out.printf("이벤트 %s %s\n", entity.getName(),entity.getType());
                    }
                    //System.out.printf("Entity: %s ", entity.getName());
                    //System.out.printf("Type: %s ", entity.getType());
                    //System.out.printf("Salience: %.3f\n", entity.getSalience());
                    //System.out.println("Metadata: ");
                    for (Map.Entry<String, String> entry : entity.getMetadataMap().entrySet()) {
                        if (entry.getKey().equals("month") || entry.getKey().equals("day")){
                            System.out.printf("날짜 %s : %s\n", entry.getKey(), entry.getValue());
                            //System.out.println("Date Detect");
                            notice.update_highlight(true);
                            noticeRepository.save(notice);
                        }
                    }
                    for (EntityMention mention : entity.getMentionsList()) {
                        //System.out.printf("Begin offset: %d ", mention.getText().getBeginOffset());
                        //System.out.printf("Content: %s ", mention.getText().getContent());
                        //System.out.printf("Type: %s \n\n", mention.getType());
                    }
                }

            }
        }
        return "Date detect";

    }
    */
}
