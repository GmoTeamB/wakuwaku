
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

export function searchFreeTime(free){
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
      
      }
      const startTime = chageMinutesToHour(starttime);
      console.log(startTime)
      console.log(freetime);
      return [startTime,freetime]
}

export function calRendering(scheduleItems){
    let title = ""
    let startDateTime  = ""
    let endDateTime  = ""
    let eventAdd = []

    for (const scheduleItem of scheduleItems) {
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
      return eventAdd
      console.log(eventAdd)
}