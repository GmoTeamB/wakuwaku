import React ,{useState}from 'react'
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid'; // 追加
import jaLocale from '@fullcalendar/core/locales/ja';

const thisMonth = () => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(
      2,
      "0"
    )}`;
  };
const Calendar = () => {
  const [events, setEvents] = useState([
    // 初期のイベントデータ（必要に応じてカスタマイズしてください）
    { title: 'イベント1', start: '2023-08-02T10:00:00', end: '2023-08-02T12:00:00' },
    { title: 'イベント2', start: '2023-08-03T14:00:00', end: '2023-08-03T16:00:00' },
  ]);

  const handleAddEvent = () => {
    const title = prompt('イベント名を入力してください:');
    if (title) {
      const newEvent = {
        title,
        start: new Date(),
        end: new Date(),
      };

      setEvents([...events, newEvent]);
    }
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