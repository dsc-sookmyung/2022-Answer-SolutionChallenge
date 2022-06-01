from transformers import pipeline
import parsedatetime as pdt
from fastapi import FastAPI
from pydantic import BaseModel
import re

from translated_events import event_list_kr, event_list_en, event_list_km, event_list_th, event_list_zh, event_list_ja, event_list_vi


class Request(BaseModel):
    language: str
    kr_text: str
    en_text: str
    translated_text: str


app = FastAPI()
cal = pdt.Calendar()
qa_pipeline = pipeline(
    "question-answering",
    model="deepset/roberta-base-squad2",
    tokenizer="deepset/roberta-base-squad2"
)
events = []
NOT_FOUNDED = -1


def make_event_dict_by_lang(lang):
    if lang == 'en':
        return dict(zip(event_list_en, event_list_en))
    elif lang == 'kr':
        return dict(zip(event_list_en, event_list_kr))
    elif lang == 'th':
        return dict(zip(event_list_en, event_list_th))
    elif lang == 'km':
        return dict(zip(event_list_en, event_list_km))
    elif lang == 'vi':
        return dict(zip(event_list_en, event_list_vi))
    elif lang == 'ja':
        return dict(zip(event_list_en, event_list_ja))
    elif lang == 'zh':
        return dict(zip(event_list_en, event_list_zh))


def ask_model(context, question):
    response = qa_pipeline({
        'context': context,
        'question': question
    })
    answer = response["answer"]
    return answer


def format_date(date):
    date.replace(" ", "")
    date.replace("/", "-")
    date.replace(".", "-")
    # delete day information inside brackets e.g.(Mon)
    if date.find("(") != NOT_FOUNDED and date.find(")") != NOT_FOUNDED:
        open_index = date.find("(")
        close_index = date.find(")")
        date = date[:open_index] + date[close_index + 1:]
    return date


def has_alpha(text):
    reg = re.compile(r'[a-zA-Z]')
    if reg.match(text):
        return True
    return False


@app.post("/event")
async def root(request: Request):
    en_to_tr_event_dict = make_event_dict_by_lang(request.language)
    for event in event_list_en:
        if request.en_text.find(event) != NOT_FOUNDED:
            question = 'When is the {}?'.format(event)
            answer = ask_model(request.en_text, question)
            extracted_date = format_date(answer)

            try:
                if has_alpha(extracted_date):
                    datetime = cal.parseDateText(extracted_date)
                else:
                    datetime = cal.parseDate(extracted_date)
                datetime = str(datetime[0]) + "-" + str(datetime[1]).zfill(2) + "-" + str(datetime[2]).zfill(2)
            except:
                return {"status": 200, "message": "no date information"}

            translated_event = en_to_tr_event_dict[event]
            translated_event_start_index = request.translated_text.lower().find(translated_event.lower())
            translated_event_end_index = translated_event_start_index + len(translated_event)

            if translated_event_start_index == NOT_FOUNDED:
                return {"status": 200, "message": "translation error"}

            result = {
                "event": en_to_tr_event_dict[event],
                "s_index": translated_event_start_index,
                "e_index": translated_event_end_index,
                "date": datetime
            }

            events.append(result)
    return {"status": 200, "body": events}
