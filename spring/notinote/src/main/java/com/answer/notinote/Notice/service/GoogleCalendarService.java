package com.answer.notinote.Notice.service;

import com.google.api.client.auth.oauth2.Credential;
import com.google.api.client.extensions.java6.auth.oauth2.AuthorizationCodeInstalledApp;
import com.google.api.client.extensions.jetty.auth.oauth2.LocalServerReceiver;
import com.google.api.client.googleapis.auth.oauth2.GoogleAuthorizationCodeFlow;
import com.google.api.client.googleapis.auth.oauth2.GoogleClientSecrets;
import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.JsonFactory;
import com.google.api.client.json.gson.GsonFactory;
import com.google.api.client.util.DateTime;
import com.google.api.client.util.store.FileDataStoreFactory;
import com.google.api.services.calendar.Calendar;
import com.google.api.services.calendar.CalendarScopes;
import com.google.api.services.calendar.model.*;
import org.springframework.stereotype.Service;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.security.GeneralSecurityException;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

@Service
public class GoogleCalendarService {
    private static final String APPLICATION_NAME = "Google Calendar API Java Quickstart";

    private static final JsonFactory JSON_FACTORY = GsonFactory.getDefaultInstance();

    private static final String TOKENS_DIRECTORY_PATH = "tokens";

    private static final List<String> SCOPES = Collections.singletonList(CalendarScopes.CALENDAR);

    private static final String CREDENTIALS_FILE_PATH = "/client_secret.json";

    private static Credential getCredentials(final NetHttpTransport HTTP_TRANSPORT) throws IOException {
        // Load client secrets.
        InputStream in = GoogleCalendarService.class.getResourceAsStream(CREDENTIALS_FILE_PATH);
        if (in == null) {
            throw new FileNotFoundException("Resource not found: " + CREDENTIALS_FILE_PATH);
        }
        GoogleClientSecrets clientSecrets = GoogleClientSecrets.load(JSON_FACTORY, new InputStreamReader(in));

        // Build flow and trigger user authorization request.
        GoogleAuthorizationCodeFlow flow = new GoogleAuthorizationCodeFlow.Builder(
                HTTP_TRANSPORT, JSON_FACTORY, clientSecrets, SCOPES)
                .setDataStoreFactory(new FileDataStoreFactory(new java.io.File(TOKENS_DIRECTORY_PATH)))
                .setAccessType("offline")
                .build();
        LocalServerReceiver receiver = new LocalServerReceiver.Builder().setPort(8888).build();
        Credential credential = new AuthorizationCodeInstalledApp(flow, receiver).authorize("user");
        //returns an authorized Credential object.
        return credential;
    }

    public void createEvent(String summary, String description, String date) throws GeneralSecurityException, IOException {
        // Build a new authorized API client service.
        final NetHttpTransport HTTP_TRANSPORT = GoogleNetHttpTransport.newTrustedTransport();
        Calendar service = new Calendar.Builder(HTTP_TRANSPORT, JSON_FACTORY, getCredentials(HTTP_TRANSPORT))
                .setApplicationName(APPLICATION_NAME)
                .build();

        Event event = new Event()
                .setSummary(summary)
                .setDescription(description);

        //date Format: "2015-05-28T09:00:00-07:00"
        DateTime startDateTime = new DateTime("2015-05-28T09:00:00-07:00");
        EventDateTime start = new EventDateTime()
                .setDateTime(startDateTime)
                .setTimeZone("Asia/Seoul");
        event.setStart(start);

        DateTime endDateTime = new DateTime("2015-05-28T17:00:00-07:00");
        EventDateTime end = new EventDateTime()
                .setDateTime(endDateTime)
                .setTimeZone("Asia/Seoul");
        event.setEnd(end);

        event.setColorId("11");

        // 리마인더를 메일 or 팝업으로 보낼 수 있음
        EventReminder[] reminderOverrides = new EventReminder[] {
                new EventReminder().setMethod("email").setMinutes(24 * 60),
                new EventReminder().setMethod("popup").setMinutes(10),
        };
        Event.Reminders reminders = new Event.Reminders()
                .setUseDefault(false)
                .setOverrides(Arrays.asList(reminderOverrides));
        event.setReminders(reminders);

        String calendarId = "primary";
        event = service.events().insert(calendarId, event).execute();
        System.out.printf("Event created: %s\n", event.getHtmlLink());
    }
}

/*  <colorId>
 *   "1": {
 *    "background": "#ac725e",
 *    "foreground": "#1d1d1d"
 *   },
 *   "2": {
 *    "background": "#d06b64",
 *    "foreground": "#1d1d1d"
 *   },
 *   "3": {
 *    "background": "#f83a22",
 *    "foreground": "#1d1d1d"
 *   },
 *   "4": {
 *    "background": "#fa573c",
 *    "foreground": "#1d1d1d"
 *   },
 *   "5": {
 *    "background": "#ff7537",
 *    "foreground": "#1d1d1d"
 *   },
 *   "6": {
 *    "background": "#ffad46",
 *    "foreground": "#1d1d1d"
 *   },
 *   "7": {
 *    "background": "#42d692",
 *    "foreground": "#1d1d1d"
 *   },
 *   "8": {
 *    "background": "#16a765",
 *    "foreground": "#1d1d1d"
 *   },
 *   "9": {
 *    "background": "#7bd148",
 *    "foreground": "#1d1d1d"
 *   },
 *   "10": {
 *    "background": "#b3dc6c",
 *    "foreground": "#1d1d1d"
 *   },
 *   "11": {
 *    "background": "#fbe983",
 *    "foreground": "#1d1d1d"
 *   },
 *   "12": {
 *    "background": "#fad165",
 *    "foreground": "#1d1d1d"
 *   },
 *   "13": {
 *    "background": "#92e1c0",
 *    "foreground": "#1d1d1d"
 *   },
 *   "14": {
 *    "background": "#9fe1e7",
 *    "foreground": "#1d1d1d"
 *   },
 *   "15": {
 *    "background": "#9fc6e7",
 *    "foreground": "#1d1d1d"
 *   },
 *   "16": {
 *    "background": "#4986e7",
 *    "foreground": "#1d1d1d"
 *   },
 *   "17": {
 *    "background": "#9a9cff",
 *    "foreground": "#1d1d1d"
 *   },
 *   "18": {
 *    "background": "#b99aff",
 *    "foreground": "#1d1d1d"
 *   },
 *   "19": {
 *    "background": "#c2c2c2",
 *    "foreground": "#1d1d1d"
 *   },
 *   "20": {
 *    "background": "#cabdbf",
 *    "foreground": "#1d1d1d"
 *   },
 *   "21": {
 *    "background": "#cca6ac",
 *    "foreground": "#1d1d1d"
 *   },
 *   "22": {
 *    "background": "#f691b2",
 *    "foreground": "#1d1d1d"
 *   },
 *   "23": {
 *    "background": "#cd74e6",
 *    "foreground": "#1d1d1d"
 *   },
 *   "24": {
 *    "background": "#a47ae2",
 *    "foreground": "#1d1d1d"
 *   }
 *  },
 */

