import React, { Component } from 'react';
import {
    Form
} from 'antd';
import { connect } from "react-redux";
import { render } from 'react-dom';
import Quiz from 'react-quiz-component';



class QuizComponent extends Component {
  state = {
      loading: false,
  };
  setRef = webcam => {
    this.webcam = webcam;
  };
  

  capture = () => {
    console.log('inside capture')
    const imageSrc = this.webcam.getScreenshot();
    console.log('inside capture',imageSrc)
  };

  render() {
     const quiz =  {
      "quizTitle": "Sample Driving Test",
      "quizSynopsis": "Quiz BichePassing score required at the CA DMV: 83%",
      "questions": [
        {
          "question": "On a two-way roadway with a center lane, drivers from either direction can _________ from the center lane.",
          "questionType": "text",
          "answerSelectionType": "single",
          "answers": [
            "Make Right Turn",
            "Park",
            "Make left turns and U-turns",
            "Reverse"
          ],
          "correctAnswer": "3",
          "messageForCorrectAnswer": "Correct answer. Good job.",
          "messageForIncorrectAnswer": "Incorrect answer. Please try again.",
          "explanation": "Drivers from either direction may use the center lane for left turns and permitted U-turns. [Examples of Right and left Turns; Turns; Lane Control; California Driver Handbook]",
          "point": "20"
        },
        {
          "question": "On two-lane roads where traffic moves in opposite directions, you may pass on the left only when..",
          "questionType": "text",
          "answerSelectionType": "single",
          "answers": [
            "A Broken Yellow line is in your lane",
            "Double Solid Yellow line is in your lane",
            "Solid Yellow line is in your lane",
            "A Broken White line is in your lane",
          ],
          "correctAnswer": "1",
          "messageForCorrectAnswer": "Correct answer. Good job.",
          "messageForIncorrectAnswer": "Incorrect answer. Please try again.",
          "explanation": "On two-lane roads where traffic moves in opposite directions, you may pass on the left only when there is a broken yellow line in your lane. [Line Colors; Lane Controls; California Driver Handbook]",
          "point": "20"
        },
        {
          "question": "This is a 'No Trucks Allowed' road sign?",
          "questionPic": "https://s.driving-tests.org/wp-content/uploads/autotest/MUTCD_R5-2.svg", // if you need to display Picture in Question
          "questionType": "text",
          "answerSelectionType": "single",
          "answers": [
            "True",
            "False"
          ],
          "correctAnswer": "1",
          "messageForCorrectAnswer": "Correct answer. Good job.",
          "messageForIncorrectAnswer": "Incorrect answer. Please try again.",
          "explanation": "NA",
          "point": "20"
        },
        {
          "question": "This is a 'No Trucks Allowed' road sign?",
          "questionPic": "https://s.driving-tests.org/wp-content/uploads/autotest/MUTCD_R5-2.svg", // if you need to display Picture in Question
          "questionType": "text",
          "answerSelectionType": "single",
          "answers": [
            "True",
            "False"
          ],
          "correctAnswer": "1",
          "messageForCorrectAnswer": "Correct answer. Good job.",
          "messageForIncorrectAnswer": "Incorrect answer. Please try again.",
          "explanation": "NA",
          "point": "20"
        },
        {
          "question": "This is a 'This is an 'Upcoming Side Road' road sign.?",
          "questionPic": "https://s.driving-tests.org/wp-content/uploads/autotest/MUTCD_W2-2R.svg", // if you need to display Picture in Question
          "questionType": "text",
          "answerSelectionType": "single",
          "answers": [
            "True",
            "False"
          ],
          "correctAnswer": "1",
          "messageForCorrectAnswer": "Correct answer. Good job.",
          "messageForIncorrectAnswer": "Incorrect answer. Please try again.",
          "explanation": "NA",
          "point": "20"
        },
        {
          "question": "This sign indicates that bicyclists must not use this road.",
          "questionPic": "https://s.driving-tests.org/wp-content/uploads/autotest/MUTCD_R5-6.svg",
          "questionType": "text",
          "answerSelectionType": "single",
          "answers": [
            "True",
            "False"
          ],
          "correctAnswer": "1",
          "messageForCorrectAnswer": "Correct answer. Good job.",
          "messageForIncorrectAnswer": "Incorrect answer. Please try again.",
          "explanation": "NA",
          "point": "20"
        },
        {
          "question": "This is a 'Wide Bridge Ahead' road sign.",
          "questionPic": "https://s.driving-tests.org/wp-content/uploads/autotest/MUTCD_W5-2a.svg",
          "questionType": "text",
          "answerSelectionType": "single",
          "answers": [
            "True",
            "False"
          ],
          "correctAnswer": "2",
          "messageForCorrectAnswer": "Correct answer. Good job.",
          "messageForIncorrectAnswer": "Incorrect answer. Please try again.",
          "explanation": "NA",
          "point": "20"
        },

        {
          "question": "This sign warns the drivers that they should not leave the pavement.",
          "questionType": "photo",
          "answerSelectionType": "single",
          "answers": [
            "https://s.driving-tests.org/wp-content/uploads/autotest/MUTCD_W8-4.svg",
            "https://s.driving-tests.org/wp-content/uploads/autotest/MUTCD_W5-2a.svg",
            "https://dummyimage.com/600x400/000/fff&text=C",
            "https://s.driving-tests.org/wp-content/uploads/autotest/MUTCD_W2-2R.svg"
          ],
          "correctAnswer": "1",
          "messageForCorrectAnswer": "Correct answer. Good job.",
          "messageForIncorrectAnswer": "Incorrect answer. Please try again.",
          "explanation": "NA",
          "point": "20"
        },
        {
          "question": "Mark images with no 7 and 6?",
          "questionType": "photo",
          "answerSelectionType": "multiple",
          "answers": [
            "https://colormax.org/wp-content/uploads/2015/08/colorblind-test-image1.jpg",
            "https://colormax.org/wp-content/uploads/2015/08/colorblind-test-image3.jpg",
            "https://colormax.org/wp-content/uploads/2015/08/colorblind-test-image2.jpg",
            "https://colormax.org/wp-content/uploads/2015/08/colorblind-test-image3.jpg"
          ],
          "correctAnswer": [1, 3],
          "messageForCorrectAnswer": "Correct answer. Good job.",
          "messageForIncorrectAnswer": "Incorrect answer. Please try again.",
          "explanation": "NA",
          "point": "20"
        },
      ]
    } 

    return (
      <div>
      <Quiz quiz={quiz} shuffle={true}/>
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
 


export default connect(mapStateToProps)(Form.create()(QuizComponent));