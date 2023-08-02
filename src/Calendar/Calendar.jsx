import React ,{useEffect, useState}from 'react'
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid'; // 追加
import jaLocale from '@fullcalendar/core/locales/ja';
import { readCalendar } from '../lib/graph';


console.log("start readCalendar")

// console.log("%o",JSON.stringify(json))

const thisMonth = () => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(
      2,
      "0"
    )}`;
  };

// props = { account: { accessToken, username, ... } }
const Calendar = (props) => {
  let json = readCalendar()
  const [events, setEvents] = useState([
    // 初期のイベントデータ（必要に応じてカスタマイズしてください）
    
  ]);
  useEffect(() => {
    (async function() {
      let json = await readCalendar();
      console.log("%o",json)
      let title = "test"
      let startDateTime  = ""
      let endDateTime  = ""
      let eventAdd = []
      console.log(json.value[0].scheduleItems)

      for (const scheduleItem of json.value[0].scheduleItems) {
        title = scheduleItem.subject
        console.log(scheduleItem.status)
        if (scheduleItem.status === "busy") {
            console.log(scheduleItem.start.dateTime)
            startDateTime = scheduleItem.start.dateTime;
            endDateTime = scheduleItem.end.dateTime;
        }
        if(scheduleItem.status === "tentative"){
          startDateTime = scheduleItem.start.dateTime;
          endDateTime = scheduleItem.end.dateTime;
        }
        console.log(startDateTime )
        if (title) {
          const newEvent = {
            title,
            start: startDateTime,
            end: endDateTime,
          };
          eventAdd.push(newEvent)
        }
      } 
      console.log(eventAdd)
      setEvents([...events, ...eventAdd]);

    })();
  }, []);

  const handleAddEvent = () => {
    
  };

  return (
    <>
      <button onClick={handleAddEvent}>イベントを追加</button>

      <FullCalendar
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
     </>
  )
}

export default Calendar