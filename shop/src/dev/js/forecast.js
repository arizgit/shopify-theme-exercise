
class ForecastSection extends HTMLElement {

  constructor() {
    super();
    this.url = 'https://ski-resort-forecast.p.rapidapi.com/Revelstoke%20Mountain%20Resort/forecast?units=i&el=top';
    this.options = {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': '06532e2590msh175183c55f81266p11a9a5jsnc37f66f164ad',
        'X-RapidAPI-Host': 'ski-resort-forecast.p.rapidapi.com'
      }
    };
    this.fetchForecast(this.url);
    const searchResortInput = document.querySelector("#search-resort");
    searchResortInput.addEventListener('keyup', this.debounce(this.onKeyUp.bind(this), 400));
  }

  onKeyUp(event) {
    if (event.code.toUpperCase() === 'ESCAPE') return;
    const searchValue = event.target.value;
    if (searchValue !== '' && searchValue.length > 1) {
      this.fetchForecast('https://ski-resort-forecast.p.rapidapi.com/'+searchValue+'/forecast?units=i&el=top')
    }
  }
  
  debounce(cb, interval, immediate) {
    var timeout;
    return function() {
      var context = this, args = arguments;
      var later = function() {
        timeout = null;
        if (!immediate) cb.apply(context, args);
      };          
      var callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, interval);
      if (callNow) cb.apply(context, args);
    };
  }

  async fetchForecast(url) {
    try {
      const response = await fetch(url, this.options);
      const result = await response.text();
      const resultJSON = JSON.parse(result);
      console.log(resultJSON);
      console.log(resultJSON.basicInfo.name);
      if (resultJSON.basicInfo.name)
        this.insertContent(resultJSON);
    } catch (error) {
      console.error(error);
    }
  }

  insertContent(data) {
    this.querySelector('h4').textContent = data.basicInfo.name;
    this.querySelector('#region').textContent = data.basicInfo.region;
    this.querySelector('#elevation-top').textContent = data.basicInfo.topLiftElevation;
    this.querySelector('#elevation-middle').textContent = data.basicInfo.midLiftElevation;
    this.querySelector('#elevation-bottom').textContent = data.basicInfo.botLiftElevation;
    this.querySelector('#website').href = data.basicInfo.url;
    this.querySelector('#map').href = 'http://maps.google.com/?q=' + data.basicInfo.name;
    this.querySelector('#today-weekday').textContent = data.forecast5Day[0].dayOfWeek;
    this.querySelector('#today-weather').textContent = data.forecast5Day[0].am.summary;
    this.querySelector('#rain-thickness').textContent = data.forecast5Day[0].am.rain;
    this.querySelector('#snow-thickness').textContent = data.forecast5Day[0].am.snow;
    this.querySelector('#temp-low').textContent = data.forecast5Day[0].am.minTemp;
    this.querySelector('#temp-high').textContent = data.forecast5Day[0].am.maxTemp;
    this.querySelector('#forecast-days-3').textContent = data.summary3Day;
    this.querySelector('#forecast-days-4').textContent = data.summaryDays4To6;
  }
}

customElements.get('forecast-section') || customElements.define('forecast-section', ForecastSection); // eslint-disable-line

export default ForecastSection;