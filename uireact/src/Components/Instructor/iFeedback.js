import React, { Component } from 'react';
import {Form, Button,Table, Rate} from 'antd';

class IFeedback extends Component{

    state = {
        loading: false,
        ratingData: []
    };

    // updatefeedback = (e) => {
    //     this.state.ratingData = e.target.value;
    //   };

    render(){
    
        const formItemLayout = {
            labelCol: { span: 10 },
            wrapperCol: { span: 10 },
        };

        const dataSource = [
            {
              ques: 'Car Prechecks by student before start of the trip?',
            },
            {
              ques: 'Seat belt check before starting the car?',
            },
            {
              ques: 'Is Speed limit was followed during the entire journey?',
            },
            {
              ques: 'Over the shoulder check before turning?',
            },
            {
              ques: 'Emegercy break was applied?',
            },
            {
              ques: 'Stop sign stooping?',
            },
            {
              ques: 'Used proper signals before changing lane?',
            },
            {
              ques: 'Pedestrian checks over entire journey?',
            },
            {
              ques: 'Freeway Driving?',
            },
            {
              ques: 'Traffic signals followed according to conditions?',
            },
            {
              ques: 'Parking precision and skills?',
            }
          ];

        const columns = [
            {
                title: 'Question',
                dataIndex: 'ques',
            },
            {
                title: 'Feedback',
                dataIndex: 'feedback',
                render: () => <div><Rate onChange={this.updatefeedback}  /></div>
            }
        ];
        const { loading } = this.state;

        return(
            <div>
                <h4 className="alignCenter">Please complete the feedback form!</h4>
                <div className="table">
                <Table columns={columns} dataSource={dataSource}/>
            </div>
            <Button type="primary" htmlType="submit" onClick={this.start} loading={loading}>
                Submit
            </Button>

            </div>)
    }

}

export default IFeedback;