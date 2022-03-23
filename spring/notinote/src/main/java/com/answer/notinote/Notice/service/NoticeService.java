package com.answer.notinote.Notice.service;


import com.answer.notinote.Auth.token.provider.JwtTokenProvider;
import com.answer.notinote.Notice.domain.entity.Notice;
import com.answer.notinote.Notice.domain.repository.NoticeRepository;
import com.answer.notinote.Notice.dto.NoticeRequestDto;
import com.answer.notinote.Notice.dto.NoticeSaveDto;
import com.answer.notinote.Notice.dto.NoticeTitleListDto;
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
import java.io.*;
import java.util.*;


@Service
public class NoticeService {

    @Autowired
    NoticeRepository noticeRepository;
    @Autowired
    UserRepository userRepository;
    @Autowired
    JwtTokenProvider jwtTokenProvider;

    public String detectText(MultipartFile uploadfile) throws IOException{
        List<AnnotateImageRequest> requests = new ArrayList<>();

        InputStream inputStream =  new BufferedInputStream(uploadfile.getInputStream());
        ByteString imgBytes = ByteString.readFrom(inputStream);

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

        return text.get(0);
    }


    public String transText(String korean, HttpServletRequest userrequest) throws IOException {
        String text = korean;
        String projectId = "notinote-341918";
        String token = jwtTokenProvider.resolveToken(userrequest);
        String useremail = jwtTokenProvider.getUserEmail(token);
        User user = userRepository.findByUemail(useremail).orElseThrow(IllegalArgumentException::new);
        String targetLanguage = user.getUlanguage(); // 추후 입력받아야함
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

        return textlist.get(0);
    }



    public NoticeTitleListDto saveNotice(MultipartFile uploadfile, NoticeRequestDto noticeRequestDto, HttpServletRequest request) throws IOException{
        //요청한 사용자 확인
        String token = jwtTokenProvider.resolveToken(request);
        String useremail = jwtTokenProvider.getUserEmail(token);
        User user = userRepository.findByUemail(useremail).orElseThrow(IllegalArgumentException::new);

        //이미지 파일 저장
        String nimageoriginal = uploadfile.getOriginalFilename();
        String uuid = UUID.randomUUID().toString();
        String nimagename = uuid + nimageoriginal;
        String nimageurl = System.getProperty("user.dir")+"/src/main/resources/static";

        File saveFile = new File(nimageurl, nimagename);
        uploadfile.transferTo(saveFile);

        //dto 저장
        NoticeSaveDto noticeSaveDto = NoticeSaveDto.builder()
                .nimagename(nimagename)
                .nimageoriginal(nimageoriginal)
                .nimageurl(nimageurl)
                .title(noticeRequestDto.getTitle())
                .ndate(noticeRequestDto.getDate())
                .origin_full(noticeRequestDto.getKorean())
                .trans_full(noticeRequestDto.getFullText())
                .user(user)
                .build();
        Notice notice = noticeRepository.save(noticeSaveDto.toNoticeEntity(user));

        return new NoticeTitleListDto(notice);

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
