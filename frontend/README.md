 Storage Unit Booking System
A full-stack web application that allows users to book storage units and administrators to manage units and bookings. The application is deployed on AWS EC2 with CI/CD using GitHub Actions.

Features
User Features

  Register and login using JWT authentication
  View available storage units
  Create bookings
  Update bookings
  Cancel bookings
  Make payments for bookings


Admin Features

  Create storage units
  Update storage units
  Delete storage units
  View all bookings

Tech Stack:
Frontend

  React
  Axios
  Yarn

Backend

  Node.js
  Express.js
  MongoDB (Mongoose)

DevOps

  AWS EC2 (deployment)
  GitHub Actions (CI/CD)
  PM2 (process management)

  Project Structure
StorageUnitBooking/
│
├── frontend/        # React application
├── backend/         # Node.js API
├── .github/
│   └── workflows/   # CI/CD pipeline
└── README.md

Setup Instructions
1.Clone the repository
git clone https://github.com/SS6623/IFQ636-StorageUnitBooking.git
2.cd IFQ636-StorageUnitBooking
3.cd IFQ636-StorageUnitBooking

Backend setup
cd backend
npm install

Create .env file:
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret_key
PORT=5001

Run backend:
npm start

Frontend setup

cd frontend
yarn install

Update API URL (src/config.js):
export const API_URL = "http://<ec2-public-ip>:5001"

yarn start

Running Tests

cd backend
npm test
✅ Uses:

Mocha
Chai
Sinon

CI/CD Pipeline

GitHub Actions automatically:

  Installs dependencies
  Runs tests
  Builds frontend
  Deploys to EC2 via self-hosted runner

Workflow triggers:

  Push to main branch

Deployment (AWS EC2)

  Application hosted on EC2 instance
  PM2 used for process management

Start services:
pm2 start npm --name backend -- start
pm2 start npm --name frontend -- start

Save processes:

pm2 save
pm2 startup

In the EC2 instance, add Custom / MY IP / Port 5001 to the security group to ensure traffic is allowed from the local machine. 

Access the Application
http://<EC2-PUBLIC-IP>:3000
Backend API:
http://<EC2-PUBLIC-IP>:5001


Security Notes

  Environment variables used for secrets
  Security groups restrict access to required ports, so specific local IP addresses need to be added before accessing the application

Tests Covered
1.Booking Flow

  Create booking
  Update booking
  Make payment
  Cancel booking
  View booking

2.Admin Features

  Create storage unit
  Update storage unit
  Delete storage unit
  View all bookings

Author
Sweta Shah

License
This project is for academic purposes.

# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
