import moment from "moment";

export default function TimePicker({ defaultValue, onChange, name, beginLimit, endLimit, step, className}) {

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
    options.push(<option key={timeValue} value={timeValue}>{timeValue}</option>);

    while ( isEarlierThanEndLimit(timeValue, setEndLimit, lastValue) ) {
        lastValue = timeValue;
        console.log(timeValue, moment(timeValue, 'HH:mm').diff(moment(setEndLimit, 'HH:mm'), 'minutes'));
        timeValue = moment(timeValue, 'HH:mm').add(setStep, 'minutes').format('HH:mm');
        options.push(<option key={timeValue} value={timeValue}>{timeValue}</option>)
    }
    return(
        <select defaultValue={defaultValue} onChange={onChange} name={name} className={className}>
            {options}
        </select>
    )
}