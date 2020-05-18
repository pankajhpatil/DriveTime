# Team Trailblazers - DriveTime 

* [Demo Link](https://www.youtube.com/watch?v=OL8APwVIWNE)

- University Name: [San Jose State University](http://www.sjsu.edu/)
- Course: [CMPE-282 Sec 48 - Cloud Services](http://info.sjsu.edu/web-dbgen/catalog/courses/CMPE282.html)
- Professor: [Andrew Bond](https://www.linkedin.com/in/ahbond/)
- Team Members: 
  - [Manish Lokhande](https://www.linkedin.com/in/manishlokhande/)
  - [Pankaj Patil](https://www.linkedin.com/in/pankajhpatil/)
  - [Jignesh Madhani](https://www.linkedin.com/in/jdmadhani/)
  - [Geethu Padachery](https://www.linkedin.com/in/geethu-padachery/)
- Project Introduction:
  - We have developed a role based online driving school, which gives learners to gain behind the wheel driving training in a very cost optimal and convenient manner. The two roles, namely student and instructor, have an added advantage of having a convenient scheduling option, wherein they can schedule a driving session according to their favorable timings. 

## Basic functionality that we have implemented:

```shell
# Student Management:
Student can register, login and update profile with the required details.

# Booking Module:
Student can book driving sessions, by choosing the dates they are comfortable with and the timetable that is convenient to them.

# Learning and analytics Module:
Student can take the quiz that we have provided them and check their driving rules knowledge. They also have multiple informative DMV videos to learn about the rules. They can also look at the statistics from their driving session reviews from the instructors, to improve on the necessary skills.

# Instructor Scheduling Module:
Instructors can fix the days they are available and have the option to choose the slots they are comfortable with. This will enable the instructor to be displayed to all the students who search for matching options.

# Instructor Appointment Module:
Instructors can see all the bookings from the students. They can see the students name, their address and phone number. Based on the student’s performance, the instructor can rate the student on different driving skills. 
```

## Technologies used

* We have developed our backend using NodeJS and ExpressJS. Using the Express-session, we are performing session management. Using serverless framework the backend is deployed in AWS Lambda.
* The frontend is developed using ReactJS and Bootstrap. We have used Redux for state management. The frontend is deployed in EC2. 
* Using AWS API gateway is used to expose the backend API’s to AWS Lambda. 
* We have created CloudFormation template for easy deployment. 
* We have used Amazon Rekognition as our 2nd level authentication along with Amazon S3 to store and compare the facial images. Also, we have a informational chatbot, implemented using AWS LEX. 
* For Data Persistence, we are using AWS RDS and MongoDB. 
* For CDN, we are using CloudFront. CloudWatch and AWS SNS is used as an security alarming system. 
* We have setup our domain using Route53 and handling the incoming traffic and load on our application with the help of AWS ELB and Auto-Scaling groups.
For login/register management and user authentication, authorization and Single Sign On, we are using Okta. 
* To perform CI/CD, we have used GitHub as our version control code repository. We are using Jenkins to pull the code from GitHub using webhooks. Jenkins builds a docker image, which is then used to build a container on the EC2 and Lambda.

## Source Code

>[Github Repository](https://github.com/pankajhpatil/DriveTime)

>[Service Reposiroty](https://github.com/geethupadachery/DriveTimeService-Lambda.git)

>[Frontend Source Code](https://github.com/pankajhpatil/DriveTime/tree/master/uireact)

>[Backend Soruce Code](https://github.com/pankajhpatil/DriveTime/tree/master/Backend)
