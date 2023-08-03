import React ,{useEffect, useState}from 'react'
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid'; // 追加
import jaLocale from '@fullcalendar/core/locales/ja';
import { readCalendar } from '../lib/graph';
import { sendCalendar } from '../lib/graph';
import { calRendering, searchFreeTime } from './CalFunc';
import styled from "@emotion/styled";



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

// export const StyleWrapper = styled.div`
// .fc-toolbar{
//   margin-bottom: 9.5m
// }
// .fc .fc-button{

// }
// :root{

// }
// `

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

  const css = ` .fc-day-today { background-color: white !important; } .fc{border-radius: 30px;}`


  return (
    <>
    <style>
     {css}
      </style>

      <FullCalendar
         plugins={[ timeGridPlugin ]}
         initialView="timeGridDay"
         headerToolbar={false}
         height="98vh"
         locales={[jaLocale]}
         locale='ja'
         events={events}
         dayHeaderContent={renderDayHeaderContent} // ヘッダーの内容をカスタマイズする関数を指定する
         allDaySlot={false} 
         themeSystem="bootstrap"  // テーマを標準に設定する
         todayHighlight={false} // 今日の背景色を変えない
         nowIndicator={true}
         slotDuration="00:30:00" // 時間の間隔を1時間に設定する
         dayHeaderDidMount={function(info) { // 日付のヘッダーの要素にアクセスする関数
          info.el.style.boxShadow = "5px 5px 5px gray"; // box-shadowプロパティの値を変更する
        }}
        eventDidMount={function(info) {
          info.el.style.borderRadius = "10px";
        }}
         />
     </>
  )
}
function renderDayHeaderContent(dayHeaderInfo) {
  const css = `font-size: 100em;`
  return (
    <div style={{fontSize: "2em"}}>
      {dayHeaderInfo.date.toLocaleDateString()} 
    </div>
  )
}
export default Calendar