import React ,{useEffect, useState}from 'react'
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid'; // 追加
import jaLocale from '@fullcalendar/core/locales/ja';
import { readCalendar } from '../lib/graph';
import { sendCalendar } from '../lib/graph';
import { calRendering, searchFreeTime } from './CalFunc';


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


const Calendar = (props) => {
  const { setTimeParams, response } = props;
  console.log(props.account.username)

  let json = readCalendar()
  const [events, setEvents] = useState([
    // 初期のイベントデータ（必要に応じてカスタマイズしてください）
  ]);
  useEffect(() => {
    (async function() {

      let json = await readCalendar(props.account.username);
      if (!(json?.value && json.value[0])) {
        return;
      }
      console.log("%o",json)

      
      let[startTime,freetime]  = searchFreeTime(json.value[0].availabilityView.split(''))
          
      console.log(startTime)
      console.log(freetime);
      setTimeParams({ startTime, freetime });
      // sendCalendar("title",startTime,freetime)

      console.log(json.value[0].scheduleItems)
      let eventAdd = calRendering(json.value[0].scheduleItems)
      
      setEvents(eventAdd);

    })();
  }, [response]);

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