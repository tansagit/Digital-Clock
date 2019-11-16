
const selectBox = document.getElementById('mySelect');
const converted_time = document.getElementById('MyClockDisplay1');
var myInterval;


function getTimeZone() {
    fetch("https://api.timezonedb.com/v2.1/list-time-zone?key=WB6ZH047G4BC&format=json&fields=zoneName")
        .then(response => response.json())
        .then(data => {
            for (i in data.zones) {
                let option = document.createElement('option');
                let location = data.zones[i].zoneName.split('/');       // Asia/HO_CHI_MINH => [Asia,HO_CHI_MINH]
                let city = location[location.length - 1];               // HO_CHI_MINH
                let country = location[location.length - 2];            // Asia
                let zone = city + " - " + country;
                option.text = zone;
                option.value = data.zones[i].zoneName;
                selectBox.appendChild(option);
            }
        })
        .catch(error => console.error(error))
}
getTimeZone();

function displayTime(date, id) {
    var hours = date.getHours();
    var mins = date.getMinutes();
    var seconds = date.getSeconds();
    var session = "AM";
    
    if (hours > 12) {
        hours = hours - 12;
        session = "PM";
    }

    //7:12:9 => 07:12:09
    hours = (hours < 10) ? "0" + hours : hours;
    mins = (mins < 10) ? "0" + mins : mins;
    seconds = (seconds < 10) ? "0" + seconds : seconds;
    var convertedTime = hours + ":" + mins + ":" + seconds + " " + session;

    document.getElementById(id).innerText = convertedTime;
    document.getElementById(id).textContent = convertedTime;
}
function showLocalTime() {
    setInterval(function () { displayTime(new Date(), "LocalTime") }, 1000);
}
showLocalTime();


function formatDate(d, city) {
    var day;
    switch (d.getDay()) {
        case 0:
            day = "Sunday";
            break;
        case 1:
            day = "Monday";
            break;
        case 2:
            day = "Tuesday";
            break;
        case 3:
            day = "Wednesday";
            break;
        case 4:
            day = "Thursday";
            break;
        case 5:
            day = "Friday";
            break;
        case 6:
            day = "Saturday";
    }
    var date = d.getDate();
    var month = d.getMonth();
    var year = d.getFullYear();

    if (city === "Ho_Chi_Minh") {
        city = "HCM City";
    }
    if (city.includes("_")) {
        city = city.split("_").join(" ");
    }

    var datetime = city + " - " + day + ", " + date + "/" + month + "/" + year;

    document.getElementById("DateTimeInfo").innerText = datetime;
    document.getElementById("DateTimeInfo").textContent = datetime;
}
formatDate(new Date(), "Da Nang");

function convertTimeZone() {
    var baseURL = new URL('http://api.timezonedb.com/v2.1/convert-time-zone?key=WB6ZH047G4BC&format=json&from=Asia/Ho_Chi_Minh');

    //create unix time
    var d = new Date;
    var currentTime = d.getTime();
    var localOffset = (-1) * d.getTimezoneOffset() * 60000;
    var localTimestamp = Math.round(new Date(currentTime + localOffset).getTime() / 1000);

    //add parameter to url
    var opt = selectBox.options[selectBox.selectedIndex];
    var toZoneName = opt.value.toString();

    //format toZoneName
    var location = toZoneName.split('/');       // Asia/HO_CHI_MINH => [Asia,HO_CHI_MINH]
    var city = location[location.length - 1];

    var params = new URLSearchParams(baseURL.search);
    params.append('to', toZoneName);                //&to=toZoneName
    params.append('time', localTimestamp);          //&time=local_unixTime
    baseURL.search = params.toString();
    var convertURL = baseURL.toString();            //final url to request

    fetch(convertURL)
        .then(response => response.json())
        .then(data => {
            var toTime = Math.round(data.toTimestamp * 1000 - new Date(localOffset).getTime());
            console.log(data.toTimestamp);
            console.log(toTime);
            var tempDate = new Date(toTime);
            console.log("ToDate: " + tempDate);
            formatDate(tempDate, city);
            displayTime(tempDate, "ConvertTime");
            myInterval = setInterval(function () {
                var nextsecond = tempDate.setSeconds(tempDate.getSeconds() + 1);
                var convertDate = new Date(nextsecond);
                displayTime(convertDate, "ConvertTime");
            }, 1000);


        })
        .catch(error => console.error(error)
        )
}

function resetIntervarl() {
    clearInterval(myInterval);
}

function hideDiv() {
    document.getElementById('LocalTime').style.display = "none";
}


function onClickAction() {
    hideDiv();
    resetIntervarl();
    convertTimeZone();

}





