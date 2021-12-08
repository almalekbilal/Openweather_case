var forecatsData = {}


$(".searchButton").click(function(){
  var city = $(".searchText").val();
  view_city_data(city);
})



view_city_data("Göteborg")

function view_city_data(city){

  $(function() {

  $.get("https://api.openweathermap.org/data/2.5/forecast?q="+city+"&units=metric&lang=sv&appid=4922dd64b949f61c5b8aa3ae0b007a87", function(data){
    view_forecast_data(data);
    forecatsData = data;
    console.log(data)
  });

  $.get("https://api.openweathermap.org/data/2.5/weather?q="+city+"&units=metric&lang=sv&appid=4922dd64b949f61c5b8aa3ae0b007a87&", function(data){
    view_current_data(data,data["name"],data["timezone"])

    console.log(data)
  });
  });

}

function view_current_data(data, cityName, timezone){

  $("#cityName").text(cityName);
  $("#currentTemp").text(data["main"]["temp"] + " °C");
  $("#minAndMax").text(data["main"]["temp_min"] + "°C / " + data["main"]["temp_max"] + " °C")
  $("#description").text(data["weather"]["0"]["description"]);
  $("#currentTime").text(from_unix_to_ordinary_time(data["dt"] + timezone));

  $("#iconCurrentWeather").attr("src", "http://openweathermap.org/img/wn/" + data["weather"]["0"]["icon"] + "@2x.png");

  $("#humidityProgress").css("width", data["main"]["humidity"] + "%");
  $("#humidityProgress").text(data["main"]["humidity"] + "%");

  $("#feelsLike").text("Känns som: " + data["main"]["feels_like"]);

  $("#windDeg").text("Riktning " + data["wind"]["deg"] + " grader");
  $("#windSpeed").text("Hastighet " + data["wind"]["speed"] + " m/s");

  if("pod" in data["sys"]){
    set_night_or_day_color(data["sys"]["pod"]);
  }else{
    set_night_or_day_color(get_pod(data["dt"],data["sys"]["sunrise"],data["sys"]["sunset"]));
  }

}

function view_forecast_data(data){
  var forecat_data = data["list"];
  var threeHoursForecastList = $(".threeHoursForecast");
  for(var i = 0; i < 6; i++){
    var weatherInfo = data["list"][i.toString()];

    var temp = weatherInfo["main"]["temp"] + " °C";
    var time = from_unix_to_ordinary_time(weatherInfo["dt"] + data["city"]["timezone"]);
    var imageUrl = "http://openweathermap.org/img/wn/" + weatherInfo["weather"]["0"]["icon"] + "@2x.png";

    threeHoursForecastList.eq(i).find(".threeHoursForecastTime").text(time);
    threeHoursForecastList.eq(i).find(".threeHoursForecastTemp").text(temp);
    threeHoursForecastList.eq(i).find(".threeHoursForecastImage").attr("src",imageUrl);
    threeHoursForecastList.eq(i).find(".listIndex").text(i.toString())
  }

  var fiveDaysForecastList = $(".fiveDaysForecast");
  var index = 0;
  for(var i = 7; i < 40; i += 8){
    var weatherInfo = data["list"][i.toString()];

    var temp = weatherInfo["main"]["temp_min"] + "°C / " + weatherInfo["main"]["temp_max"] + " °C";
    var date = weatherInfo["dt_txt"].split(" ")[0];
    var imageUrl = "http://openweathermap.org/img/wn/" + weatherInfo["weather"]["0"]["icon"] + "@2x.png";

    fiveDaysForecastList.eq(index).find(".fiveDaysForecastDate").text(date);
    fiveDaysForecastList.eq(index).find(".fiveDaysForecastTemp").text(temp);
    fiveDaysForecastList.eq(index).find(".fiveDaysForecastImage").attr("src",imageUrl);
    fiveDaysForecastList.eq(index).find(".listIndex").text(i.toString())
    index += 1;
  }
}
function get_pod(current, sunrise, sunset){


  if(sunrise < current && current < sunset){
    return "d"
  }else{
    return "n"
  }
}

function set_night_or_day_color(pod){
  var mainColor = "";
  var color = "";
  if(pod == "d"){
    mainColor = "#00FFFF";
    color = "#00CDFF";
  }else{
    mainColor = "#9FA2A2";
    color = "#7D7D7D";
  }

  $("body").css("background-color", mainColor);
  $(".currentBox").css("background-color", color);
  $(".fiveDaysForecast").css("background-color", color);
}
function from_unix_to_ordinary_time(unix){
  var date = new Date(unix * 1000);
  var hours = date.getHours() -1;
  if(hours < 0){
    hours = hours + 24;
  }
  var minutes = date.getMinutes();
  if(parseInt(minutes) < 10){
    minutes = "0"+minutes;
  }
  var time = hours + ":" + minutes;
  return time
}

var lastclicked = '';
var color = '';
var isLastClickedADay = false;

$(".threeHoursForecast").click(function(){
  change_view_to_forecasted_data($(this));

  $(this).css("background-color", "#D1D1D1")
  if (isLastClickedADay){
    lastclicked.css("background-color", color);
  }else{
    if(lastclicked != ''){
      lastclicked.css("background-color", "");
    }
  }
  lastclicked = $(this);
  isLastClickedADay = false;
});

$(".fiveDaysForecast").click(function(){
  change_view_to_forecasted_data($(this));
  color = $(this).css("background");
  $(this).css("background-color", "#D1D1D1")
  if (isLastClickedADay){
    lastclicked.css("background-color", color);
  }else{
    if(lastclicked != ''){
      lastclicked.css("background-color", "");
    }
  }
  lastclicked = $(this);
  isLastClickedADay = true;
});

function change_view_to_forecasted_data(element){
  var index = element.find(".listIndex").text();
  view_current_data(forecatsData["list"][index], forecatsData["city"]["name"], forecatsData["city"]["timezone"]);
}
