import { RESTService } from '../Api/api.js'
import moment from 'moment';

export const LexAPI = {
    getInstructors
}

async function getInstructors(data) {
    
    let request = {};

    request.fromdate=moment(data.startDate).format("DD-MMM-YYYY");
    request.todate=moment(data.endDate).format("DD-MMM-YYYY");
    request.city = data.city;


    request.slot0810='N';
    request.slot1012='N';
    request.slot1214='N';
    request.slot1416='N';
    request.slot1618='N';
    request.slot1820='N';
    request.slot2022='N';

    if(data.plan === 1){
        request.planNo = 4;
    }
    else if(data.plan === 2){
        request.planNo = 6;
    }
    else if(data.plan === 3){
        request.planNo = 10;
    }
    
    if(data.timeSlot === 1){
        request.slot0810='Y';
    }
    else if(data.timeSlot === 2){
        request.slot1012='Y';
    }
    else if(data.timeSlot === 3){
        request.slot1214='Y';
    }
    else if(data.timeSlot === 4){
        request.slot1416='Y';
    }
    else if(data.timeSlot === 5){
        request.slot1618='Y';
    }
    else if(data.timeSlot === 6){
        request.slot1820='Y';
    }
    else if(data.timeSlot === 7){
        request.slot2022='Y';
    }

    let response= await RESTService.getInstructorsForDates(request);
    let list = [];
    let arr = response.data.result.data

    console.log("Complete response");
    console.log(arr);
    for(let i = 0; i < arr.length; ++i){

        if(!list.includes(arr[i].iusername)){
            list.push(arr[i].iusername)
        }
    }
    // console.log("list");
    // console.log(list);
    
    return list;
}