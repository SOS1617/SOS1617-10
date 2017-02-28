var dateformat=require("format-date");

function date(){
    var date= new Date();
    var day = dateformat('{day}',date);
    var valor="";
    switch (day) {
        case '1':
            valor="st";
            break;
        case '2':
            valor="nd";
            break;
        case '3':
            valor="rd";
            break;
        default:
            valor="th";
    }
    var res= dateformat('{date}',date)+valor+" "+dateformat('{month-name}',date)+" of "+dateformat('{year}',date)+", "+dateformat('{hours}:{minutes}:{seconds}');
    return res;
    
}