from translated_events import event_list_en, event_list_th, event_list_km, event_list_vi, event_list_ja, event_list_zh
import re
from bisect import bisect_left
import datetime


class SchoolEventsExtractor:
    def __init__(self, kr_text, translated_text, kr_event_list, lang):
        self.kr_text = kr_text
        self.translated_text = translated_text
        self.kr_event_list = kr_event_list
        self.lang = lang
        self.foreign_event_list = self.make_event_dict_by_lang()
        self.index_to_event = {}
        self.matched_dates = []
        self.matched_events = {}
        self.events_indexes = []
        self.results = []

    def make_event_dict_by_lang(self):
        if self.lang == 'en':
            return dict(zip(self.kr_event_list, event_list_en))
        elif self.lang == 'th':
            return dict(zip(self.kr_event_list, event_list_th))
        elif self.lang == 'km':
            return dict(zip(self.kr_event_list, event_list_km))
        elif self.lang == 'vi':
            return dict(zip(self.kr_event_list, event_list_vi))
        elif self.lang == 'ja':
            return dict(zip(self.kr_event_list, event_list_ja))
        elif self.lang == 'zh':
            return dict(zip(self.kr_event_list, event_list_zh))

    def find_all_dates_from_korean_text(self):
        date_reg_list = [r'\d{4}년 ([1-9]|1[012])월 ([1-9]|[12][0-9]|3[01])일',
                         r'\d{4}\.([1-9]|1[012])\.([1-9]|[12][0-9]|3[01])',
                         r'([1-9]|1[012])월 ([1-9]|[12][0-9]|3[01])일',
                         r'([1-9]|1[012])\.([1-9]|[12][0-9]|3[01])']

        for reg in date_reg_list:
            self.matched_dates += re.finditer(reg, self.kr_text)

    def handle_ymd(self, date):
        if "월" in date.group():
            format_string = "%Y년 %m월 %d일"
        else:
            format_string = "%Y.%m.%d"
        return datetime.datetime.strptime(date.group(), format_string).date()

    def handle_md(self, date):
        if "월" in date.group():
            format_string = "%m월 %d일"
        else:
            format_string = "%m.%d"
        return datetime.datetime.strptime(date.group(), format_string).date()

    def unify_date_format_and_save_with_event(self, date, matched_event):
        is_date_with_year = len(date.group()) > 7
        if is_date_with_year:
            objectified_date = self.handle_ymd(date)
        else:
            objectified_date = self.handle_md(date)
        self.matched_events[matched_event] = objectified_date.strftime('%Y-%m-%d')

    def save_to_result(self, matched_event):
        if self.lang == 'ko':
            result = self.save_ko_event(matched_event)
        else:
            result = self.save_foreign_event(matched_event)
        self.results.append(result)

    def save_ko_event(self, matched_event):
        result = {}
        kr_event = re.search(matched_event, self.kr_text)
        result['content'] = matched_event
        result['date'] = self.matched_events[matched_event]
        result['s_index'] = kr_event.span()[0]
        result['e_index'] = kr_event.span()[1]

        return result

    def save_foreign_event(self, matched_event):
        result = {}
        translated_event = re.search(self.foreign_event_list[matched_event].lower(), self.translated_text.lower())
        result['content'] = self.foreign_event_list[matched_event]
        result['date'] = self.matched_events[matched_event]
        result['s_index'] = translated_event.span()[0]
        result['e_index'] = translated_event.span()[1]

        return result

    def match_dates_with_events_and_save(self):
        for date in self.matched_dates:
            # print(date.start())
            index_of_matched_event = bisect_left(self.events_indexes, date.start())
            matched_event = self.index_to_event[self.events_indexes[index_of_matched_event - 1]]

            is_event_in_event_to_date_dict = self.matched_events.get(matched_event)
            if not is_event_in_event_to_date_dict:
                self.unify_date_format_and_save_with_event(date, matched_event)
                self.save_to_result(matched_event)

    def find_all_events_starting_index(self):
        for event in self.kr_event_list:
            self.find_event_index_from_korean_text(event, self.kr_text)

        self.events_indexes = self.sort_and_make_list(self.index_to_event.keys())

    def find_event_index_from_korean_text(self, sub, string):
        index = 0 - len(sub)
        try:
            while True:
                index = string.index(sub, index + len(sub))
                self.index_to_event[index] = sub
        except ValueError:
            pass

    def get_number_of_events_in_kr_text(self):
        return len(self.index_to_event)

    @staticmethod
    def sort_and_make_list(items):
        return list(sorted(items))
