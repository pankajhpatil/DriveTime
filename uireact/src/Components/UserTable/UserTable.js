import React, { Component } from 'react';
import { Table } from 'antd';
import { message } from "antd/lib/index";
import { RESTService } from '../Api/api.js'


class UserTable extends Component {


    state = {tableData: []};

    //to reload page
    refreshPage = () => {
        window.location.reload(false);
    }

    async componentDidMount() {
        // this.refreshPage()

        let response = await RESTService.getUserTableData();
        console.log("response")
        console.log(response)
        this.setState({tableData: response.data.result});
    }

    deleteUser = async (userName) => {

        let data = {};
        data.username = userName;
        await RESTService.deleteUser(data);
        message.success('User ' + userName + ' deleted Successfully!');
        let response = await RESTService.getUserTableData();
        this.setState({tableData: response.data.result});
    };


    render() {
        const columns = [
            {
                title: 'First Name',
                dataIndex: 'firstname',
            },
            {
                title: 'Last Name',
                dataIndex: 'lastname',
            },
            {
                title: 'User Name',
                dataIndex: 'username',
            },
            {
                title: 'Email',
                dataIndex: 'email',
            },
            {
                title: 'User Type',
                dataIndex: 'usertype',
            },
            {
                title: 'Phone',
                dataIndex: 'phone',
            },
            {
                title: 'Action',
                dataIndex: 'username',
                render: (text) => <div><a
                    onClick={() => this.deleteUser(text)}>Delete</a></div>,
            },

        ];


        return (
            <div className="table">
                <Table columns={columns} dataSource={this.state.tableData}/>
            </div>
        );
    }
}


export default UserTable;