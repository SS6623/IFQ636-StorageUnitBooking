Storage Unit Booking System
The storage unit booking system is a full-stack web application that allows users to book storage units and administrators to manage units and bookings. The application is deployed on AWS EC2 with CI/CD using GitHub Actions.
Features
•	User Features
o	Register and login using JWT authentication
o	View available storage units
o	Create bookings
o	Update bookings
o	Cancel bookings
o	View their own bookings
o	Make payments for bookings

•	Admin Features
o	Create storage units
o	Update storage units
o	Delete storage units
o	View all bookings

Tech Stack:
•	Frontend: React, Axios, Yarn
•	Backend: Node.js, Express.js, MongoDB (Mongoose)

•	DevOps: AWS EC2 (deployment), GitHub Actions (CI/CD), PM2 (process management)

Project Structure
StorageUnitBooking/
frontend/        # React application
backend/         # Node.js API
.github/
workflows/   # CI/CD pipeline
README.md

Setup Instructions
1.	Clone the GitHub repository in VS code: https://github.com/SS6623/IFQ636-StorageUnitBooking.git 
2.	If not already done, complete installation on EC2 instance for the following as per instructions provided in the file “Set up EC2 in AWS and GitHub self-hosted runner_ A part of CD configuration”: nginx, PM2, nvm. Add new Self-hosted runner in GitHub. Ensure PM2 processes are up and running. If they are not running, run them using: 
pm2 start npm --name backend -- start
pm2 start npm --name frontend -- start

3.	Set up the environment variables and environment secret in GitHub
4.	Add a repository secret for PROD in GitHub
5.	Update base URL in (src/pages/axiosConfig.jsx):
baseURL: "http://<Public IP of EC2 instance>:5001" --> The IP here should be updated with EC2 instance public IP

6.	In GitHub: git push origin main
This will trigger the workflow in GitHub Actions.
7.	In AWS CLI go to folder: cd www/action_runners$/ _work/cd IFQ636-StorageUnitBooking/ IFQ636-StorageUnitBooking
cd frontend
yarn build
pm2 restart all 
8.	In the EC2 instance, add the following rules to the security group:
•	Custom / MY IP / Port 5001 to the security group to ensure traffic is allowed from the local machine. 
•	Custom / MY IP / Port 3000 to the security group to ensure traffic is allowed from the local machine. 
•	SSH / MY IP to the security group to ensure traffic is allowed from the local machine.
•	HTTP / MY IP to the security group to ensure traffic is allowed from the local machine 
9.	Access the Application in the browser by typing: http://<EC2-PUBLIC-IP>:3000
10.	Backend API can be accessed using: http://<EC2-PUBLIC-IP>:5001
--> This will show a message saying API is running
11.	Login to the application using the following credentials: 
For user  user1@user1.com; Password: user1
For Admin  admin@admin.com; Password: admin

Workflow triggers: Push to main branch
CI/CD Pipeline: GitHub Actions automatically Installs dependencies, Runs tests, Builds frontend, Deploys to EC2 via self-hosted runner. 
Deployment (AWS EC2):
Application hosted on EC2 instance
PM2 used for process management
Security Notes:
•	Environment variables used for secrets.
•	Security groups restrict access to required ports, so specific local IP addresses need to be added before accessing the application

Tests Covered
1.Booking Flow

  Create booking
  Update booking
  Make payment
  Cancel booking

2.Admin Features

  Create storage unit
  Update storage unit
  Delete storage unit
  View all bookings

Author
Sweta Shah

License
This project is for academic purposes.

