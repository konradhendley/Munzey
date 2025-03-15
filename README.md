Munzey – Real-Time Expense Tracker

Munzey is a serverless, cloud-native financial tracking web application built to help users manage expenses, visualize spending trends, and track financial goals. The application leverages AWS services for a scalable and cost-effective architecture while providing a seamless user experience with React.js on the frontend.

Features

✅ User Authentication – Secure sign-in and account management using Amazon Cognito
✅ Expense Management – Add, edit, and delete expenses with a user-friendly interface
✅ Data Visualization – Interactive charts powered by Chart.js for tracking spending trends
✅ Expense Calendar – View expenses on a full-featured calendar using FullCalendar
✅ Real-Time Updates – Backend powered by AWS Lambda, API Gateway, and DynamoDB
✅ Secure & Scalable Deployment – Hosted with AWS S3 & CloudFront, with CI/CD via GitHub Actions
✅ Testing & Automation – Comprehensive unit tests (Jest)
✅ RESTful API – Built with API Gateway & Lambda for seamless data handling

Tech Stack

Frontend
	•	React.js – UI framework for a dynamic and responsive experience
	•	Chart.js – For real-time data visualization
	•	CSS – Styling for a clean and intuitive design

Backend
	•	AWS Lambda – Serverless compute for handling business logic
	•	Amazon API Gateway – Exposing RESTful API endpoints
	•	Amazon DynamoDB – NoSQL database for fast, scalable data storage
	•	Amazon Cognito – Secure user authentication and authorization

Deployment & DevOps
	•	Amazon S3 & CloudFront – Static site hosting and content delivery
	•	GitHub Actions – CI/CD pipeline for automated builds and deployments
	•	AWS CloudWatch – Logging and monitoring for performance insights

Testing & Tools
	•	Jest – Unit testing for frontend components
	•	Postman – API testing and development
	•	GitHub – Version control and collaboration

Getting Started

Prerequisites

Ensure you have the following installed before running the project:
	•	Node.js (v20.5.1 recommended)
	•	AWS CLI (for deploying backend services)
	•	Git (for version control)

Installation
	1.	Clone the repository
		git clone https://github.com/konradhendley/Munzey.git
		cd Munzey
	2.	Install dependencies
		cd frontend
		npm install
	3.	Run the development server
		npm start

The frontend will be available at http://localhost:3000/.

	4.	Backend Setup
	•	Deploy AWS Lambda functions via CloudFormation
	•	Configure API Gateway for endpoints
	•	Set up DynamoDB tables for storing user expenses
	•	Connect Cognito for user authentication

Contributing

Contributions are welcome! If you’d like to report issues, request features, or contribute, please follow these steps:
	1.	Fork the repo
	2.	Create a feature branch (git checkout -b feature-xyz)
	3.	Commit changes (git commit -m "Add feature XYZ")
	4.	Push to your fork (git push origin feature-xyz)
	5.	Open a pull request

License

This project is licensed under the MIT License. See the LICENSE file for details.

Contact

For questions, feature requests, or feedback, reach out via:
	•	GitHub Issues
	•	LinkedIn:(https://www.linkedin.com/in/konradhendley/)
	•	Munzey contact page: https://mymunzey.com/contact
