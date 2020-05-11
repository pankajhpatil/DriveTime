import React, { Component } from 'react';
import { Popover, Icon, Modal, Button  } from 'antd';
import { RESTService } from '../Api/api.js'
import Feedback from './Feedback';
import { CloseCircleFilled } from '@ant-design/icons';

class PopoverComponent extends Component{

    state = {
        // visible: false,
        studentdata:"",
        modalVisible : false,
        userinfo : "",
        hovered: false,
    };

    showModal = () => {
        // console.log('show modal')
        this.setState({
            hovered : false,
            modalVisible: true,
        });
    };

    handleOk = e => {
        // console.log('handle ok')
        console.log(e);
        this.setState({
            modalVisible: false,
        });
    };

    handleCancel = e => {
        // console.log('cancel')
        console.log(e);
        this.setState({
            modalVisible: false,
        });
    };
    
    close = () => {
        // console.log('hide')
        this.setState({
            hovered: false,
        });
    };
    open = () => {
        // console.log('hide')
        this.setState({
            hovered: true,
        });
    };
    async componentDidMount() {


            let data = {};
            // console.log("this.props.data");
            // console.log(this.props.data);
            // console.log(this.props.date);  
            data.username = this.props.data.replace('Booked_','');
            // data.username = 'manishlokhande96@gmail.com'
            // console.log(data.username);  
               
            let userinfo =await RESTService.getUserdata(data);
            // console.log(userinfo.data.result);
            
            const bookingdata = (
                <div>
                  <p><div><a onClick={this.close} style={{ color: '#F5222D'}}><CloseCircleFilled /></a></div></p>
                  <p><b>{"Booked By : "}</b>{userinfo.data.result.UserFullName}</p>
                  <p><b>{"Address : "}</b>{userinfo.data.result.Address + ","+userinfo.data.result.City}</p>
                  <p><b>{"Phone : "}</b>{userinfo.data.result.PhoneNumber}</p>
                  <Button type="dashed" onClick={this.showModal}>Feedback</Button>
                </div>
              );            

              this.setState({
              studentdata:bookingdata,
              userinfo : userinfo.data.result
            });
            

    }
    // handleVisibleChange = visible => {
    //     console.log('visible')
    //     this.setState({ visible : true });
    // };

    render(){

        return (
            <Popover
                content={this.state.studentdata} 
                // trigger="click"
                // visible={this.state.visible}
                // onVisibleChange={this.handleVisibleChange}
                // onClick = {this.feedbackSubmit}
                visible={this.state.hovered}
                 >
                { <Icon type="car" theme="filled" style={{color: '#d9be25' }} onClick = {this.open} />}
                <Modal
                    title="Fill the following feedback for the seesion"
                    centered
                    style={{ down: 20 }}
                    bodyStyle={{ padding: '0', width: 1500 }}
                    footer={null}
                    width={820}
                    visible={this.state.modalVisible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    >      
                    <Feedback sessionInfo = {this.state.userinfo} slot = {this.props.slot}/>
                </Modal>
            </Popover>
        )
    }
}

export default PopoverComponent;