import React from 'react'
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
  return (
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
        events={[
          {
            id: "c",
            start: "2023-08-02T12:00:00",
            end: "2023-08-02T13:00:00",
            title: "針供np養",
            description: "古くなった針などを神社に納めて供養する",
            backgroundColor: "blue",
            borderColor: "blue",
            editable: true
          },            
          { title: "event 2", date: `${thisMonth()}-01`},
          ]}
    />
  )
}

export default Calendar