//import CommonVariables from "./commonVariables";

// const CV = new CommonVariables();
export class CommonHelpers{
  createElements(tr,...values) {
    values.forEach(value => {
      let td = document.createElement('td')
      td.textContent = value
      tr.appendChild(td)
    });
  }

  // async hitAPI(name){
  //   CV.response = await fetch('./APIUrls.json')
  //   CV.data = await CV.response.json(); 
  //   CV.data = await fetch(CV.data.name);
  //   CV.data = await CV.data.json();
  //   return CV.data;
  // }

  getWeekOfMonth(date) {
    const dayOfMonth = date.getDate();
    const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    const startDayOfWeek = startOfMonth.getDay();
    
    const weekNumber = 'Week '+Math.ceil((dayOfMonth + startDayOfWeek) / 7).toString();
    
    return weekNumber;
  }
  getGreeting() {
    const now = new Date();
    const timeString = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:00`;
    
    const Morning = '04:00:00';
    const Afternoon = '12:00:00';
    const Evening = '16:00:00';
    
    if (timeString >= Morning && timeString < Afternoon) return 'Good Morning!';
    if (timeString >= Afternoon && timeString < Evening) return 'Good Afternoon!';
    return 'Good Evening!';
  }


  async getAllAPIUrls(name){
    let response = await fetch('./APIUrls.json')
    let data = await response.json()
    return data[name]; 
  }

}
export default CommonHelpers