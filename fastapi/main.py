from fastapi import FastAPI
from pydantic import BaseModel
import re
from bisect import bisect_left
import datetime


class Request(BaseModel):
    language: str
    kr_text: str
    translated_text: str


app = FastAPI()


@app.post("/event-dict")
async def root(request: Request):
    event_dict = {}
    event_list = ["졸업식", "종업식", "소풍", "입학식", "수학여행", "현장체험학습", "방학식", "겨울방학", "여름방학", "봄방학", "개학", "전시회", "실기대회",
                  "미술대회", "수학올림피아드", "과학올림피아드", "신체검사", "예방접종", "수련회", "운동회", "견학", "답사", "민방위", "소방훈련", "개교기념일", "축제",
                  "졸업장 수여식"]
    event_list_en = ["Graduation Ceremony", "Closing Ceremony", "Excursion", "Entrance Ceremony", "School Trip",
                     "Field Experience Study", "Vacation", "Winter Vacation", "Summer Vacation", "Spring Break",
                     "Starting School", "Exhibition", "Practical Competition", "Art Competition",
                     "Mathematics Olympiad", "Science Olympiad", "Physical Examination", "Vaccination", "Retreat",
                     "Sports Day", "Field Trip", "Exploration", "Civil defense", "Fire drill", "Anniversary of school",
                     "Festival", "diploma awarding ceremony"]
    event_list_th = ["พิธีสำเร็จการศึกษา", "พิธีปิด", "ทัศนศึกษา", "พิธีรับเข้าเรียน", "ทัศนศึกษา", "การศึกษาประสบการณ์ภาคสนาม",
                     "พิธีเช้า", "วันหยุดฤดูหนาว", "วันหยุดฤดูร้อน", "วันหยุดฤดูใบไม้ผลิ", "โรงเรียนเริ่มต้น", "นิทรรศการ",
                     "การแข่งขันภาคปฏิบัติ", "การประกวดศิลปะ", "คณิตศาสตร์โอลิมปิก", "วิทยาศาสตร์โอลิมปิก", "การตรวจร่างกาย",
                     "การฉีดวัคซีน", "หนี", "วันกีฬาสี", "ทัศนศึกษา", "สำรวจ", "ป้องกันภัยพลเรือน", "ซ้อมดับเพลิง", "ครบรอบโรงเรียน",
                     "เทศกาล", "พิธีรับปริญญา"]
    event_list_km = ["ពិធីបញ្ចប់ការសិក្សា", "ពិធីបិទ", "ដំណើរកំសាន្ត", "ពិធីចូលរៀន", "ការធ្វើដំណើរសាលា", "ការសិក្សាបទពិសោធន៍",
                     "ពិធីអាហារពេលព្រឹក", "វិស្សមកាលរដូវរងារ", "វិស្សមកាលរដូវក្តៅ", "សម្រាកនិទាឃរដូវ", "សាលាចាប់ផ្តើម", "ការតាំងពិព័រណ៍",
                     "ការប្រកួតប្រជែងជាក់ស្តែង", "ការប្រកួតសិល្បៈ", "គណិតវិទ្យាអូឡាំពិក", "វិទ្យាសាស្ត្រអូឡាំព្យាដ", "ការប្រឡងរាងកាយ",
                     "ការចាក់វ៉ាក់សាំង", "សម្រាក", "ទិវាកីឡា", "ការធ្វើដំណើរវាល។ ", "ការរុករក", "ការការពារស៊ីវិល", "សមយុទ្ធអគ្គីភ័យ",
                     "ខួបនៃសាលារៀន", "ពិធីបុណ្យ", "ពិធីបញ្ចប់ការសិក្សា"]
    event_list_vn = ["Lễ tốt nghiệp", "Lễ tổng kết", "Chuyến tham quan", "Lễ nhập học", "Chuyến đi học",
                     "Nghiên cứu trải nghiệm thực tế", "Lễ ăn sáng", "Kỳ nghỉ đông", "Kỳ nghỉ hè", "Kỳ nghỉ xuân",
                     "Khai giảng", "Triển lãm", "Cuộc thi thực hành", "Cuộc thi nghệ thuật", "Olympic Toán học",
                     "Olympic Khoa học", "Kiểm tra thể chất", "Tiêm phòng", "Khóa tu", "Ngày hội thể thao",
                     "Chuyến dã ngoại "," Khám phá "," Phòng thủ dân sự "," Diễn tập chữa cháy ",
                     " Lễ kỷ niệm thành lập trường "," Lễ hội "," Lễ tốt nghiệp "]
    event_list_ja = ["卒業式", "従業式", "ピクニック", "入学式", "修学旅行", "現場体験学習", "方程式", "冬休み", "夏休み", "春休み",
                     "開校", "展示会", "実技大会", "美術大会", "数学オリンピアード", "科学オリンピアド", "身体検査", "予防接種",
                     "修練会", "運動会", "見学", "回答", "民防衛", "消防訓練", "開校記念日", "祭り", "卒業場授与式"]
    event_list_cn = ["毕业典礼", "结业典礼", "远足", "入学典礼", "学校旅行", "实地体验学习", "早餐仪式", "寒假", "暑假", "春假",
                     "开学", "展览", "实践比赛", "艺术竞赛", "数学奥林匹克", "科学奥林匹克", "体格检查", "疫苗接种", "撤退",
                     "运动项目", "实地考察", "探索", "民防", "消防演习", "奠基日", "节日", "毕业典礼"]

    if request.language == 'en':
        event_dict = dict(zip(event_list, event_list_en))
    elif request.language == 'th':
        event_dict = dict(zip(event_list, event_list_th))
    elif request.language == 'km':
        event_dict = dict(zip(event_list, event_list_km))
    elif request.language == 'vn':
        event_dict = dict(zip(event_list, event_list_vn))
    elif request.language == 'ja':
        event_dict = dict(zip(event_list, event_list_ja))
    elif request.language == 'cn':
        event_dict = dict(zip(event_list, event_list_cn))

    index_event_dict = {}
    matched_events = {}
    response = {'status': 200, 'body': []}

    def findall(sub, string):
        index = 0 - len(sub)
        try:
            while True:
                index = string.index(sub, index + len(sub))
                index_event_dict[index] = sub
        except ValueError:
            pass

    for event in event_list:
        findall(event, request.kr_text)

    sorted_dict = dict(sorted(index_event_dict.items()))
    event_index_list = list(sorted_dict.keys())
    # print(event_index_list)

    date_reg_list = [r'\d{4}년 ([1-9]|1[012])월 ([1-9]|[12][0-9]|3[01])일',
                     r'\d{4}.([1-9]|1[012]).([1-9]|[12][0-9]|3[01])']
    matched_dates = []

    for reg in date_reg_list:
        matched_dates += re.finditer(reg, request.kr_text)

    for date in matched_dates:
        # print(date.start())
        matched_event_index = bisect_left(event_index_list, date.start())

        if matched_event_index < 1:
            return {"status": 200, "message": "no events"}
        matched_event = index_event_dict[event_index_list[matched_event_index - 1]]
        tmp_date = ''

        if not matched_events.get(matched_event):
            if "년" in date.group():
                tmp_date = datetime.datetime.strptime(date.group(), "%Y년 %m월 %d일").date()
            else:
                tmp_date = datetime.datetime.strptime(date.group(), "%Y.%m.%d").date()

            matched_events[matched_event] = tmp_date.strftime('%Y-%m-%d')
            translated_event = re.search(event_dict[matched_event].lower(), request.translated_text.lower())
            # print(translated_event)
            res_body = dict()
            res_body['content'] = event_dict[matched_event]
            res_body['date'] = matched_events[matched_event]
            res_body['sIndex'] = translated_event.span()[0]
            res_body['eIndex'] = translated_event.span()[1]

            response['body'].append(res_body)

    return response
