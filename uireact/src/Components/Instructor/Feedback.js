import React, { Component } from 'react';
import {Form, Button, Rate} from 'antd';
import { RESTService } from '../Api/api.js'
import { message } from "antd/lib/index";
import { history } from '../../Helper/history';
import moment from 'moment';

class Feedback extends Component{
    
    state = {
        sessionInfo : this.props.sessionInfo
    };

    feedbackSubmit = async(e) => {    
        // console.log('clicking on submit')
        e.preventDefault();
        this.props.form.validateFields(async (err, values) => {   
            if (!err) {
                // console.log(values);
                // console.log(this.state.sessionInfo);
                // console.log(this.props.slot);
                // console.log(this.props.date);
                let info = this.state.sessionInfo;

                let data = {};
                data.username = info.Name;
                data.session = this.props.slot;
                // data.instructorName take from sessionname, 
                // sessionDate =  not available,  
                data.feedback1 = parseInt(values.feedback1) * 2;
                data.feedback2 = parseInt(values.feedback2) * 2;
                data.feedback3 = parseInt(values.feedback3) * 2;
                data.feedback4 = parseInt(values.feedback4) * 2;
                data.feedback5 = parseInt(values.feedback5) * 2;
                data.feedback6 = parseInt(values.feedback6) * 2;
                data.feedback7 = parseInt(values.feedback7) * 2;
                data.feedback8 = parseInt(values.feedback8) * 2;
                data.feedback9 = parseInt(values.feedback9) * 2;
                data.feedback10 = parseInt(values.feedback10) * 2;

                // console.log('prepared data');
                // console.log(data);
                let resp = await RESTService.addFeedback(data);
                if(resp.statusText === 'Feedback Added' || resp.data.statusText === 'Feedback Added'){
                    message.success('Your Feedback submitted!');
                }
                else{
                    message.error('There was some error while adding feedback please try again later');
                }
                
            }
        });
    };

    render(){
    
    const formItemLayout = {
        labelCol: { span: 4 },
        wrapperCol: { span: 3},
    };
        
    const { getFieldDecorator } = this.props.form;

    return(
        <div>
            <Form {...formItemLayout} onSubmit={this.feedbackSubmit}>
                <Form.Item label="Car Prechecks?" className="marginBottom0">
                    {getFieldDecorator('feedback1', {
                        rules: [{required: true, message: 'Please give feedback'}],
                    })(<Rate />)}
                </Form.Item>
                <Form.Item label="Seatbelt check?" className="marginBottom0">
                    {getFieldDecorator('feedback2', {
                        rules: [{required: true, message: 'Please give feedback'}],
                    })(<Rate />)}
                </Form.Item>
                <Form.Item label="Followed Speed limit?" className="marginBottom0">
                    {getFieldDecorator('feedback3', {
                        rules: [{required: true, message: 'Please give feedback'}],
                    })(<Rate />)}
                </Form.Item>
                <Form.Item label="Over the shoulder check?" className="marginBottom0">
                    {getFieldDecorator('feedback4', {
                        rules: [{required: true, message: 'Please give feedback'}],
                    })(<Rate />)}
                </Form.Item>
                <Form.Item label="Stop sign followed?" className="marginBottom0">
                    {getFieldDecorator('feedback5', {
                        rules: [{required: true, message: 'Please give feedback'}],
                    })(<Rate />)}
                </Form.Item>
                <Form.Item label="Used proper signals?" className="marginBottom0">
                    {getFieldDecorator('feedback6', {
                        rules: [{required: true, message: 'Please give feedback'}],
                    })(<Rate />)}
                </Form.Item>
                <Form.Item label="Pedestrian checks?" className="marginBottom0">
                    {getFieldDecorator('feedback7', {
                        rules: [{required: true, message: 'Please give feedback'}],
                    })(<Rate />)}
                </Form.Item>
                <Form.Item label="Freeway Driving?" className="marginBottom0">
                    {getFieldDecorator('feedback8', {
                        rules: [{required: true, message: 'Please give feedback'}],
                    })(<Rate />)}
                </Form.Item>
                <Form.Item label="Followed traffic signals?" className="marginBottom0">
                    {getFieldDecorator('feedback9', {
                        rules: [{required: true, message: 'Please give feedback'}],
                    })(<Rate />)}
                </Form.Item>
                <Form.Item label="Parking precision and skills?" className="marginBottom0">
                    {getFieldDecorator('feedback10', {
                        rules: [{required: true, message: 'Please give feedback'}],
                    })(<Rate />)}
                </Form.Item>
            <Form.Item wrapperCol={{ span: 12, offset: 6 }}>
            <Button type="primary" htmlType="submit">
                Submit
            </Button>
            </Form.Item>
            </Form>
        </div>
    )}   
}

export default (Form.create()(Feedback));