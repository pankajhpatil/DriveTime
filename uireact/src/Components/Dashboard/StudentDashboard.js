import React, { Component } from 'react';
import { Jumbotron} from 'react-bootstrap'; 
import { message } from "antd/lib/index";
import { RESTService } from "../Api/api.js";
import { history } from '../../Helper/history';
import {Button} from 'antd';
import QuizComponent from "../Quiz/Quiz";

class StudentDashboardComponent extends Component{

    validateEnroll = async () => {
        
        let response=await RESTService.validateEnroll();
        history.push('/home/plan');
    };

    resources = () => { history.push('/home/resources'); };
    startQuiz = () => { history.push('/home/quiz'); };
    viewReports = () => { history.push('/home/reports'); };
    
                        
    render() {

        return (
            <div className="cards" style={{ display: 'flex', alignItems:'center', height: '20%' }}>
                <table>
                    <tr>
                    <td style={{ padding: '70px' , paddingTop: '20px', paddingBottom: '20px'}}>
                        <Jumbotron style={{ width: '26rem' , height: '20rem' }}>
                            <h1>Want to Enroll for Driving lesson?</h1>
                            <p>Explore the several options provided by individual instructors!</p>
                            <br/>
                            <Button type="primary" size="large" icon="login" onClick={this.validateEnroll}>Create a schedule</Button>
                        </Jumbotron>
                        </td>
                        <td style={{ padding: '70px' , paddingTop: '20px', paddingBottom: '20px'}}>
                        <Jumbotron style={{ width: '30rem' , height: '20rem' }}>
                            <h1>DMV Learning Resources</h1>
                            <p>Take advantage of videos, documents and other learning materials.</p>
                            <br/>
                            <Button type="primary" size="large" icon="book" onClick={this.resources}>Explore Resources</Button>
                        </Jumbotron>
                        </td>
                       
                    </tr>
                    <tr>
                    <td style={{ padding: '70px' , paddingTop: '20px', paddingBottom: '20px'}}>
                        <Jumbotron style={{ width: '26rem' , height: '20rem' }}>
                            <h1>Sample Test</h1>
                            <p>Take advantage of sample practice Questions.</p>
                            <br/>
                            <Button type="primary" size="large" icon="book" onClick={this.startQuiz}>Explore Resources</Button>
                        </Jumbotron>
                        </td>
                        <td style={{ padding: '70px' , paddingTop: '20px', paddingBottom: '20px'}}>
                        <Jumbotron style={{ width: '30rem' , height: '20rem' }}>
                            <h1>Reports</h1>
                            <p>Reports</p>
                            <br/>
                            <Button type="primary" size="large" icon="book" onClick={this.viewReports}>Explore Resources</Button>
                        </Jumbotron>
                        </td>   
                    </tr>    
                </table>
            </div>
        );
    }
}

export default StudentDashboardComponent;