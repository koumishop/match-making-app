import moment from "moment";
import { useEffect, useState } from "react";
import axios, { AxiosError, isAxiosError } from 'axios'

export default function TimePicker({ defaultValue, onChange, name, beginLimit, endLimit, step, className, privateCompanyId}) {
    const [appointmentUsedTime, setAppointmentUsedTime] = useState("");

    const getTimeStart =  (appointmentDate)=>{
        let dateTime= new Date(appointmentDate), hour = dateTime.getUTCHours()+1, minutes = dateTime.getUTCMinutes();
        minutes = minutes < 10 && minutes > 0 ? `0${minutes}` : minutes;
        return `${hour}:${minutes}`
    }


    // useEffect(() => {
    //     if(!privateCompanyId.rows ){
    //         console.log('nothing...');
    //         setAppointmentUsedTime("");
    //      } else{
    //         console.log("**** appointment received: ", privateCompanyId.rows);
    //         setAppointmentUsedTime(privateCompanyId.rows)
    //         // privateCompanyId.rows.forEach((row)=>{
    //         //     setAppointmentUsedTime(getTimeStart(row.appointmentTime));
    //         // });
    //     }
    // }, []);

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
    console.log("***** used time : ", privateCompanyId.rows);
    //options.push(<option key={timeValue} value={timeValue} >{timeValue}</option>);
    privateCompanyId.rows.forEach((row)=>{
        console.log('***** appointmentTime : ',getTimeStart(row.appointmentTime));
        options.push(<option key={timeValue} value={timeValue}  disabled={timeValue === getTimeStart(row.appointmentTime)}>{timeValue}</option>);
    })
    // !privateCompanyId.row?options.push(<option key={timeValue} value={timeValue} >{timeValue}</option>) : privateCompanyId.rows.forEach((row)=>{
    //     console.log('***** appointmentTime : ',getTimeStart(row.appointmentTime));
    //     options.push(<option key={timeValue} value={timeValue}  disabled={timeValue === getTimeStart(row.appointmentTime)}>{timeValue}</option>);
    // })

    while ( isEarlierThanEndLimit(timeValue, setEndLimit, lastValue) ) {
        lastValue = timeValue;
        //console.log('');
        timeValue = moment(timeValue, 'HH:mm').add(setStep, 'minutes').format('HH:mm');
        //options.push(<option key={timeValue} value={timeValue}>{timeValue}</option>)

        privateCompanyId.rows.forEach((row)=>{
            console.log('***** appointmentTime : ',getTimeStart(row.appointmentTime));
            options.push(<option key={timeValue} value={timeValue} disabled={timeValue === getTimeStart(row.appointmentTime)}>{timeValue}</option>)
        })

        // !privateCompanyId.row ? options.push(<option key={timeValue} value={timeValue}>{timeValue}</option>):privateCompanyId.rows.forEach((row)=>{
        //     console.log('***** appointmentTime : ',getTimeStart(row.appointmentTime));
        //     options.push(<option key={timeValue} value={timeValue} disabled={timeValue === getTimeStart(row.appointmentTime)}>{timeValue}</option>)
        // })
        //!appointmentData ? console.log("**** nothing to show") :appointmentData.rows.forEach((row)=>console.log("**** row : ", row));
    }


    return(
        <select defaultValue={defaultValue} onChange={onChange} name={name} className={className}>
            {options}
        </select>
    )
}