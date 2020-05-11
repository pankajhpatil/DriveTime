
import React, { Component } from 'react';
import { Chart } from 'react-charts'
import { connect } from "react-redux";
import {
    Card, Form, Input, Button, Row, Col, Spin, message,Select
} from 'antd';

import { Jumbotron} from 'react-bootstrap'; 
import { RESTService } from "../Api/api.js";

const { Option } = Select;

class ReportsComponent extends Component {

    state = {
        tableData: [],
        reportdata: [],
        renderReport:false,
        charttype: 'bar'
    };

    async componentDidMount() {
        
        console.log('in componentDidMount')
        console.log(this.props.reportData)
//For feedback
let response1=await RESTService.getfeedbackForstudent();
console.log('Feedback response')
console.log(response1)
let feedbackData=response1.data.result;
let tdata=[];
if(feedbackData){
for(var keys in feedbackData){
    let tempData = feedbackData[keys];
    let fdata={};
    fdata.label='Session '+tempData.sessionSlot;
    fdata.data=[
    {x: 'Car Prechecks' ,y: parseInt(tempData.feedback1)},
    {x: 'Seatbelt check',y: parseInt(tempData.feedback2)},
    {x: 'Followed Speed limit',y: parseInt(tempData.feedback3)},
    {x: 'Over the shoulder check',y: parseInt(tempData.feedback4)},
    {x: 'Stop sign followed',y: parseInt(tempData.feedback5)},
    {x: 'Used proper signals',y: parseInt(tempData.feedback6)},
    {x: 'Pedestrian checks',y: parseInt(tempData.feedback7)},
    {x: 'Freeway Driving',y: parseInt(tempData.feedback8)},
    {x: 'Followed traffic signals',y: parseInt(tempData.feedback9)},
    {x: 'Parking precision and skills',y: parseInt(tempData.feedback10)}
];
    tdata.push(fdata);
    console.log(fdata)
};
console.log(tdata)
this.setState({reportdata:tdata})
}



       this.setState({renderReport:true})
        // {
        //     label: 'Series 1',
        //     data: [
        //     {x: 'Car Prechecks' ,y: 10},
        //     {x: 'Seatbelt check',y: 6},
        //     {x: 'Followed Speed limit',8},
        //     {x: 'Over the shoulder check',6},
        //     {x: 'Stop sign followed',y: 7},
        //     {x: 'Used proper signals',y: 7},
        //     {x: 'Pedestrian checks',y: 7},
        //     {x: 'Freeway Driving',y: 8},
        //     {x: 'Followed traffic signals',y: 6},
        //     {x: 'Parking precision and skills',5}
        // ]
        //   }
    }
   

      
    setChartType = (e) => {
        console.log('event')
        console.log(e)
        this.setState({charttype:e})
      }


    render() {
        let data= this.state.reportdata;
        const {getFieldDecorator} = this.props.form;

    console.log(data);
          let axes= [
            // { primary: true, type: 'ordinal', position: 'left' },
            // { position: 'bottom', type: 'linear', stacked: true }
            { primary: true, type: 'ordinal', position: 'bottom' },
            { position: 'left', type: 'linear', stacked: true }
          ];

          let series = {
            type: this.state.charttype
          };

        return (

            
            
            <div className="cards" style={{ display: 'flex', alignItems:'center', height: '20%' }}>

            <Select defaultValue="bar" style={{ width: 120 }} onChange={this.setChartType}>
                <Option value="bar">Bar Chart</Option>
                <Option value="line">Line Chart</Option>
                <Option value="bubble">Bubble Chart</Option>
                <Option value="area">Area Chart</Option>
            </Select>
                <table>
                        
                    <tr>
                    <td style={{ padding: '70px' , paddingTop: '20px', paddingBottom: '20px'}}>
                        <Jumbotron style={{width: '55rem' , height: '40rem' }}>
                            <br/>
                            <br/>
                            <br/>
                            {this.state.renderReport ?
                            <Chart data={data} series={series} axes={axes} tooltip /> : null }
                           
                        
                        </Jumbotron>
                        </td>
                    </tr>  
                </table>
            </div>
        );
    }
}

function mapStateToProps(state) {
    const {simpleReducer} = state;
    return {
        simpleReducer
    };
  }
   
export default connect(mapStateToProps)(Form.create()(ReportsComponent));