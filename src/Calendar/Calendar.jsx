import React ,{useEffect, useState}from 'react'
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid'; // 追加
import jaLocale from '@fullcalendar/core/locales/ja';
import { readCalendar } from '../lib/graph';
function getFiveMinutesSinceMidnightInJapan() {
  const now = new Date();
  const japanTime = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Tokyo' }));
  const midnight = new Date(japanTime.getFullYear(), japanTime.getMonth(), japanTime.getDate());
  
  const elapsedMilliseconds = japanTime - midnight;
  const elapsedMinutes = Math.floor(elapsedMilliseconds / (1000 * 60));
  
  return Math.ceil(elapsedMinutes / 5);
}
function chageMinutesToHour(minutes){
  let hour = Math.floor((minutes * 5)  / 60)
  hour = hour >= 10 ? hour : "0" + hour

  console.log(minutes)
  let m = (minutes * 5)  % 60
  m = m >= 10 ? m : "0" + m

  const now = new Date();

  const formattedDate = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}T`;
  return formattedDate + hour + ":" +  m + ":00" 

}
const minutesSinceMidnightInJapan = getFiveMinutesSinceMidnightInJapan();
console.log('今日の0時から経過した分数（日本時間）:', minutesSinceMidnightInJapan);


const Calendar = (props) => {
  let json = readCalendar()
  const [events, setEvents] = useState([
    // 初期のイベントデータ（必要に応じてカスタマイズしてください）
  ]);
  useEffect(() => {
    (async function() {

      let json = await readCalendar();
      console.log("%o",json)

      let title = ""
      let startDateTime  = ""
      let endDateTime  = ""
      let eventAdd = []
      let free = json.value[0].availabilityView.split('');
      console.log(free)
      const minutesFiveSinceMidnightInJapan = getFiveMinutesSinceMidnightInJapan();
      let changestate = false
      let freetime = 0
      let starttime = -1
      for(let i = minutesFiveSinceMidnightInJapan; i < free.length;i++){
        if(free[i] == 0){
          freetime += 5
          if(starttime == -1){
            starttime = i
          }
          changestate = true
          console.log(freetime)
        }else if(changestate && free[i] != 0){
          break
        }
        // if(!changestate){
        //   continue
        // }
      }
      console.log(freetime)
    
      console.log(chageMinutesToHour(starttime))

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
       
        const newEvent = {
          title,
          start: startDateTime,
          end: endDateTime,
        };
        eventAdd.push(newEvent)
      
      } 
      console.log(eventAdd)
      setEvents([...events, ...eventAdd]);

    })();
  }, []);

  const handleAddEvent = () => {
    
  };

  return (
    <>
      <FullCalendar
          plugins={[ dayGridPlugin ,timeGridPlugin]}
          initialView="timeGridDay"
          locales={[jaLocale]}
          locale='ja'
          events={events}
      />
     </>
  )
}

export default Calendar