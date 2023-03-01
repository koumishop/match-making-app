import moment from "moment";
import { useState } from "react";

export default function TimePicker({ defaultValue, onChange, name, beginLimit, endLimit, step, className, privateCompanyId}) {

    const getTimeStart =  (appointmentDate)=>{
        let dateTime= new Date(appointmentDate), hour = dateTime.getUTCHours(), minutes = dateTime.getUTCMinutes();
        minutes = minutes < 10 ? `0${minutes}` : minutes;
        return `${hour}:${minutes}`
    }

    const isEarlierThanEndLimit=(timeValue, endLimit, lastValue)=> {
		var timeValueIsEarlier = moment(timeValue, 'h:mmA').diff(moment(endLimit, 'h:mmA')) < 0
		var timeValueIsLaterThanLastValue = lastValue === undefined ? true : moment(lastValue, 'h:mmA').diff(moment(timeValue, 'h:mmA')) < 0
		return timeValueIsEarlier && timeValueIsLaterThanLastValue;
	};
    var timeValue = beginLimit || "14:20";
    var lastValue;
    var setEndLimit = endLimit || "16:40";
    var setStep = step || 20;

    var options = [];
    if(defaultValue){
        options.push(<option key={timeValue} value={timeValue} selected={defaultValue === timeValue}>{timeValue}</option>)
    }else{
        if(privateCompanyId?.rows){
            privateCompanyId?.rows.forEach((row)=>{ 
                options.push(<option key={timeValue} value={timeValue}  disabled={timeValue === getTimeStart(row.appointmentTime)}>{timeValue}</option>);
            });                    
        }else{
            options.push(<option key={timeValue} value={timeValue}>{timeValue}</option>)
        }
    }


    while ( isEarlierThanEndLimit(timeValue, setEndLimit, lastValue) ) {
         lastValue = timeValue;
         timeValue = moment(timeValue, 'HH:mm').add(setStep, 'minutes').format('HH:mm');
        if(defaultValue){
            options.push(<option key={timeValue} value={timeValue} selected={defaultValue === timeValue}>{timeValue}</option>)
        }else{
            if(privateCompanyId?.rows){
                privateCompanyId?.rows.forEach((row)=>{ 
                    options.push(<option key={timeValue} value={timeValue}  disabled={timeValue === getTimeStart(row.appointmentTime)}>{timeValue}</option>);
                });                    
            }else{
                options.push(<option key={timeValue} value={timeValue}>{timeValue}</option>)
            }
        }
    }


    return(
        <select defaultValue={defaultValue?defaultValue:beginLimit} onChange={onChange} name={name} className={className}>
            {options}
        </select>
    )
}