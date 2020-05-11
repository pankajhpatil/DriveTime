import React, { Component } from 'react';

import { Table, Button,Icon } from 'antd';
import { message } from "antd/lib/index";
import { RESTService } from '../Api/api.js'
import PopoverComponent from './PopoverComponent';


class ISchedule extends Component {
  
    state = {tableData: []};

    async componentDidMount() {

        let response = await RESTService.getinstructorSchedule();
        this.setState({tableData: response.data.result});
    }

    deleteISchedule = async (sdate) => {

        let data = {};
        data.sdate = sdate;
        await RESTService.deleteISdetails(data);
        message.success('Schedule for date "' + sdate + '" deleted Successfully!');
        let response = await RESTService.getinstructorSchedule();
        this.setState({tableData: response.data.result});

    };
    refresh = async (sdate) => {

      let response = await RESTService.getinstructorSchedule();
      this.setState({tableData: response.data.result});

  };

    render() {

        const columns = [
            {
                title: 'Schedule Date',
                dataIndex: 'sdate',
            },
            {
                title: '(8am-10am)',
                dataIndex : 'slot0810',
                render: (text) => <div>
                { (text==="Y" ? <Icon type="check" style={{color: '#3ebd04' }} />
                  :(text==="N" ?  <Icon type="dash" />:
                    <PopoverComponent data={text} slot='slot0810'/>
                    ))
                }
              </div>           
            },  
            {
                title: '(10am-12pm)',
                dataIndex: 'slot1012',
                render: (text) => <div>
                { (text==="Y" ? <Icon type="check" style={{color: '#3ebd04' }} />
                  :(text==="N" ?  <Icon type="dash" />:
                    <PopoverComponent data={text} slot='slot1012'/>
                    ))
                }
              </div>
            },
            {
                title: '(12pm-2pm)',
                dataIndex: 'slot1214',
                render: (text) => <div>
                { (text==="Y" ? <Icon type="check" style={{color: '#3ebd04' }} />
                  :(text==="N" ?  <Icon type="dash" />:
                    <PopoverComponent data={text} slot='slot1214'/>
                    ))
                }
              </div>
            },
            {
                title: '(2pm-4pm)',
                dataIndex: 'slot1416',
                render: (text) => <div>
                { (text==="Y" ? <Icon type="check" style={{color: '#3ebd04' }} />
                  :(text==="N" ?  <Icon type="dash" />:
                    <PopoverComponent data={text} slot='slot1416'/>
                    ))
                }
              </div>
            },
            {
                title: '(4pm-6pm)',
                dataIndex: 'slot1618',
                render: (text) => <div>
                { (text==="Y" ? <Icon type="check" style={{color: '#3ebd04' }} />
                  :(text==="N" ?  <Icon type="dash" />:
                    <PopoverComponent data={text} slot='slot1618'/>
                    ))
                }
              </div>
            },
            {
                title: '(6pm-8pm)',
                dataIndex: 'slot1820',
                render: (text) => <div>
                { (text==="Y" ? <Icon type="check" style={{color: '#3ebd04' }} />
                  :(text==="N" ?  <Icon type="dash" />:
                    <PopoverComponent data={text} slot='slot1820'/>
                    ))
                }
              </div>
            },
            {
                title: '(8pm-10pm)',
                dataIndex: 'slot2022',
                render: (text) => <div>
                { (text==="Y" ? <Icon type="check" style={{color: '#3ebd04' }} />
                  :(text==="N" ?  <Icon type="dash" />:
                    <PopoverComponent data={text} slot='slot2022'/>
                    ))
                }
              </div>
            },
            {
                title: 'Action',
                dataIndex: 'sdate',
                render: (text) => <div><a 
                onClick={() => this.deleteISchedule(text)}><Icon type="delete" style={{color: '#f00d0a' }} /></a></div>,
            },

        ];


        return (
            <div className="table">
                <Button type="primary" onClick={this.refresh} ><Icon type="reload"/></Button>
                <br/>
                <Table columns={columns} dataSource={this.state.tableData}/>
            </div>
        );
    }
}


export default ISchedule;