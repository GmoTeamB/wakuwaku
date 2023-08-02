import jaLocale from '@fullcalendar/core/locales/ja';
import dayGridPlugin from '@fullcalendar/daygrid';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid'; // 追加
import React, { useState } from 'react';

const json =
{
    "@odata.context":"https://graph.microsoft.com/v1.0/$metadata#Collection(microsoft.graph.scheduleInformation)",
    "value":[
        {
            "scheduleId":"AlexW@contoso.OnMicrosoft.com",
            "availabilityView":"111111002222222200000000000000000000",
            "scheduleItems":[
                {
                    "status":"Tentative",
                    "start":{
                        "dateTime":"2018-08-06T09:00:00.0000000",
                        "timeZone":"Pacific Standard Time"
                    },
                    "end":{
                        "dateTime":"2018-08-06T10:30:00.0000000",
                        "timeZone":"Pacific Standard Time"
                    }
                },
                {
                    "status":"Busy",
                    "start":{
                        "dateTime":"2023-08-02T11:00:00.0000000",
                        "timeZone":"Pacific Standard Time"
                    },
                    "end":{
                        "dateTime":"2023-08-02T13:00:00.0000000",
                        "timeZone":"Pacific Standard Time"
                    }
                }
            ],
            "workingHours":{
                "daysOfWeek":[
                    "monday",
                    "tuesday",
                    "wednesday",
                    "thursday",
                    "friday"
                ],
                "startTime":"08:00:00.0000000",
                "endTime":"17:00:00.0000000",
                "timeZone":{
                    "@odata.type":"#microsoft.graph.customTimeZone",
                    "bias":480,
                    "name":"Customized Time Zone",
                    "standardOffset":{
                        "time":"02:00:00.0000000",
                        "dayOccurrence":1,
                        "dayOfWeek":"sunday",
                        "month":11,
                        "year":0
                    },
                    "daylightOffset":{
                        "daylightBias":-60,
                        "time":"02:00:00.0000000",
                        "dayOccurrence":2,
                        "dayOfWeek":"sunday",
                        "month":3,
                        "year":0
                    }
                }
            }
        }
    ]
}



const thisMonth = () => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(
      2,
      "0"
    )}`;
  };

// props = { account: { accessToken, username, ... } }
const Calendar = (props) => {
  const [events, setEvents] = useState([
    // 初期のイベントデータ（必要に応じてカスタマイズしてください）
    { title: 'イベント1', start: '2023-08-02T10:00:00', end: '2023-08-02T12:00:00' },
    { title: 'イベント2', start: '2023-08-03T14:00:00', end: '2023-08-03T16:00:00' },
  ]);

  const handleAddEvent = () => {
    let title = "test"
    let startDateTime  = ""
    let endDateTime  = ""

    for (const scheduleItem of json.value[0].scheduleItems) {
      if (scheduleItem.status === "Busy") {

          startDateTime = scheduleItem.start.dateTime;
          console.log("Start Date and Time:", startDateTime);
          break; // 最初の Busy スケジュールアイテムを見つけたらループを終了
      }
    }
    for (const scheduleItem of json.value[0].scheduleItems) {
      if (scheduleItem.status === "Busy") {
          startDateTime = scheduleItem.start.dateTime;
          endDateTime = scheduleItem.end.dateTime;
          console.log("Start Date and Time:", startDateTime);
          break; // 最初の Busy スケジュールアイテムを見つけたらループを終了
      }
    }
    if (title) {
      const newEvent = {
        title,
        start: startDateTime,
        end: endDateTime,
      };
      setEvents([...events, newEvent]);
    }
  };


  const divStyle = {
    display: "flex",
    flexDirection: "column",
  };

  return (
    <div style={divStyle}>
      <button onClick={handleAddEvent} style={{flex: 0, width: "max-content"}}>イベントを追加</button>

      <FullCalendar
          height="100%"
          plugins={[ dayGridPlugin ,timeGridPlugin]}
          initialView="timeGridDay"
          locales={[jaLocale]}
          locale='ja'
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridDay',
          }}
          events={events}
      />
    </div>
  )
}

export default Calendar