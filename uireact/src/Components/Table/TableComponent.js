import React, { Component } from 'react';
import { Table, Divider } from 'antd';
import { message } from "antd/lib/index";
import { RESTService } from '../Api/api.js'


class TableComponent extends Component {

    state = {tableData: []};

    async componentDidMount() {

        let response = await RESTService.getTableData();
        let data = response.data.result;
        this.setState({tableData: data});
    }

    deleteFile = async (fileName) => {

        let data = {};
        data.fileName = fileName;
        await RESTService.deleteFile(data);
        message.success('File ' + fileName + ' deleted Successfully!');
        let response = await RESTService.getTableData();
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
                title: 'File Name',
                dataIndex: 'file_name',
            },
            {
                title: 'File Description',
                dataIndex: 'filedesc',
            },
            {
                title: 'Upload Duration',
                dataIndex: 'fileuploadtime',
                render: (text) => text + "sec",
            },
            {
                title: 'Created Date',
                dataIndex: 'filecreatedate',
            },
            {
                title: 'Last Update Date',
                dataIndex: 'filemodifieddate',
            },
            {
                title: 'User ID',
                dataIndex: 'username',
            },
            {
                title: 'File Action(s)',
                dataIndex: 'fileurl',
                render: (text, record) => <div><a href={text} target="_blank">Download</a> <Divider type="vertical"/> <a
                    onClick={() => this.deleteFile(record.file_name)}>Delete</a></div>,
            },
        ];

        return (
            <div className="table">
                <Table columns={columns} dataSource={this.state.tableData}/>
            </div>
        );
    }
}

export default TableComponent;