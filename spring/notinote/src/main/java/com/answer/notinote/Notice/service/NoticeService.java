package com.answer.notinote.Notice.service;

import com.answer.notinote.Auth.token.provider.JwtTokenProvider;
import com.answer.notinote.Child.service.ChildService;
import com.answer.notinote.Event.domain.Event;
import com.answer.notinote.Notice.dto.*;
import com.answer.notinote.Event.dto.EventRequestDto;
import com.answer.notinote.Event.service.EventService;
import com.answer.notinote.Exception.CustomException;
import com.answer.notinote.Exception.ErrorCode;
import com.answer.notinote.Notice.domain.entity.Notice;
import com.answer.notinote.Notice.domain.repository.NoticeRepository;
import com.answer.notinote.User.domain.entity.User;
import com.answer.notinote.User.domain.repository.UserRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.cloud.translate.v3.*;
import com.google.cloud.translate.v3.LocationName;
import com.google.cloud.translate.v3.Translation;
import com.google.cloud.vision.v1.*;
import com.google.protobuf.ByteString;
import com.nimbusds.jose.shaded.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletRequest;
import java.io.*;
import java.time.LocalDate;
import java.util.*;


@Service
public class NoticeService {

    @Autowired
    NoticeRepository noticeRepository;
    @Autowired
    UserRepository userRepository;
    @Autowired
    JwtTokenProvider jwtTokenProvider;
    @Autowired
    EventService eventService;
    @Autowired
    ChildService childService;

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


    public String transText(String korean, String targetLanguage) throws IOException {
        String text = korean;
        String projectId = "solution-challenge-342914";
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

    public String englishText(String korean) throws IOException {
        String text = korean;
        String projectId = "solution-challenge-342914";
        ArrayList <String> textlist = new ArrayList<String>();

        try (TranslationServiceClient client = TranslationServiceClient.create()) {
            LocationName parent = LocationName.of(projectId, "global");

            // Supported Mime Types: https://cloud.google.com/translate/docs/supported-formats
            TranslateTextRequest request =
                    TranslateTextRequest.newBuilder()
                            .setParent(parent.toString())
                            .setMimeType("text/plain")
                            .setTargetLanguageCode("en")
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

    public NoticeResponseBody detectEvent(String korean, String translation, String language, String english) throws JsonProcessingException {
        String url = "https://notinote.herokuapp.com/event";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        JSONObject body = new JSONObject();
        body.put("language", language);
        body.put("kr_text", korean);
        body.put("translated_text", translation);
        body.put("en_text", english);
        HttpEntity<String> request = new HttpEntity<>(body.toString(), headers);

        String response = new RestTemplate().postForObject(url, request, String.class);
        System.out.println(response);
        JsonNode root = new ObjectMapper().readTree(response);

        boolean noEvents = root.path("message") != null && root.path("message").asText().equals("no events");
        if (noEvents) return null;
        return new ObjectMapper().treeToValue(root.path("body"), NoticeResponseBody.class);
    }

    public NoticeTitleListDto saveNotice(MultipartFile uploadfile, NoticeRequestDto noticeRequestDto, HttpServletRequest request) throws IOException{
        //요청한 사용자 확인
        String token = jwtTokenProvider.resolveAccessToken(request);
        String useremail = jwtTokenProvider.getUserEmail(token);
        User user = userRepository.findByUemail(useremail).orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        //이미지 파일 저장
        String nimageoriginal = uploadfile.getOriginalFilename();
        String uuid = UUID.randomUUID().toString();
        String nimagename = uuid + nimageoriginal;
        String nimageurl = System.getProperty("user.dir")+"/src/main/resources/static";

        File saveFile = new File(nimageurl, nimagename);
        uploadfile.transferTo(saveFile);

        Notice notice = Notice.builder()
                .nimagename(nimagename)
                .nimageoriginal(nimageoriginal)
                .nimageurl(nimageurl)
                .title(noticeRequestDto.getTitle())
                .ndate(noticeRequestDto.getDate())
                .origin_full(noticeRequestDto.getKorean())
                .trans_full(noticeRequestDto.getFullText())
                .user(user)
                .child(childService.findChildById(noticeRequestDto.getCid()))
                .build();
        noticeRepository.save(notice);

        String en_full = englishText(noticeRequestDto.getKorean());

        NoticeResponseBody responseBody = detectEvent(notice.getOrigin_full(), notice.getTrans_full(), user.getUlanguage(), en_full);
        List<EventRequestDto> eventWords = responseBody.getEvents();

        List<Event> events = new ArrayList<>();
        for (EventRequestDto dto : eventWords) events.add(eventService.create(dto, notice));

        List<NoticeSentenceDto> sentences = extractSentenceFromEvent(notice.getTrans_full(), events);

        return new NoticeTitleListDto(notice, sentences);
    }

    public List<NoticeSentenceDto> extractSentenceFromEvent(String text, List<Event> events) {
        List<NoticeSentenceDto> sentences = new ArrayList<>();
        int lastIndex = 0, id = 1;

        if (events == null) {
            NoticeSentenceDto dto = new NoticeSentenceDto(id, -1, text, null, false, false);
            sentences.add(dto);
            return sentences;
        }

        Collections.sort(events);

        for (Event event : events) {
            if (lastIndex != event.getIndex_start()) {
                // event가 아닌 경우
                String sentence = text.substring(lastIndex, event.getIndex_start());
                NoticeSentenceDto dto = new NoticeSentenceDto(id++, -1, sentence, null, false, false);
                sentences.add(dto);
            }

            // event인 경우
            String sentence = text.substring(event.getIndex_start(), event.getIndex_end());
            NoticeSentenceDto dto = new NoticeSentenceDto(id++, event.getEid(), sentence, event.getDate(), true, event.isRegistered());
            sentences.add(dto);

            lastIndex = event.getIndex_end();
        }

        if (lastIndex != text.length() - 1) {
            String sentence = text.substring(lastIndex, text.length() - 1);
            NoticeSentenceDto dto = new NoticeSentenceDto(id, -1, sentence, null, false, false);
            sentences.add(dto);
        }

        return sentences;
    }

    public List<NoticeSentenceDto> extractSentenceFromEventRequestDto(String text, List<EventRequestDto> events) {
        List<NoticeSentenceDto> sentences = new ArrayList<>();
        int lastIndex = 0, id = 1;

        if (events == null) {
            NoticeSentenceDto dto = new NoticeSentenceDto(id, -1, text, null, false, false);
            sentences.add(dto);
            return sentences;
        }

        Collections.sort(events);

        for (EventRequestDto event : events) {
            if (lastIndex != event.getS_index()) {
                // event가 아닌 경우
                String sentence = text.substring(lastIndex, event.getS_index());
                NoticeSentenceDto dto = new NoticeSentenceDto(id++, -1, sentence, null, false, false);
                sentences.add(dto);
            }

            // event인 경우
            String sentence = text.substring(event.getS_index(), event.getE_index());
            NoticeSentenceDto dto = new NoticeSentenceDto(id++, -1, sentence, LocalDate.parse(event.getDate()), true, false);
            sentences.add(dto);

            lastIndex = event.getE_index();
        }

        if (lastIndex != text.length() - 1) {
            String sentence = text.substring(lastIndex, text.length() - 1);
            NoticeSentenceDto dto = new NoticeSentenceDto(id, -1, sentence, null, false, false);
            sentences.add(dto);
        }

        return sentences;
    }

    public List<NoticeEventListDto> extractEventList(List<NoticeSentenceDto> fullText){
        List<NoticeEventListDto> events = new ArrayList<>();

        for (int i = 0; i < fullText.size(); i++){
            if(fullText.get(i).isHighlight()){
                NoticeEventListDto event = new NoticeEventListDto(fullText.get(i).getContent(), fullText.get(i).getDate());
                events.add(event);
            }
        }
        return events;
    }

    public Notice findNoticeById(Long id) {
        return noticeRepository.findById(id).orElseThrow(
                () -> new CustomException(ErrorCode.NOT_FOUND)
        );
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
