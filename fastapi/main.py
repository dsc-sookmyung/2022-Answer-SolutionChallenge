from fastapi import FastAPI
from pydantic import BaseModel

from translated_events import event_list
from school_events_extractor import SchoolEventsExtractor


class Request(BaseModel):
    language: str
    kr_text: str
    translated_text: str


app = FastAPI()


@app.post("/event-dict")
async def root(request: Request):
    events_extractor = SchoolEventsExtractor(request.kr_text, request.translated_text, event_list, request.language)
    events_extractor.find_all_events_starting_index()

    if events_extractor.get_number_of_events_in_kr_text() < 1:
        return {"status": 200, "message": "no events"}

    events_extractor.find_all_dates_from_korean_text()
    events_extractor.match_dates_with_events_and_save()

    return {'status': 200, 'body': events_extractor.results}
