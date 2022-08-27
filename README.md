# Salesmigo Engage'22

## Introduction - Salesmigo's aim

We use face recognition for **customer detection** at entry, **customer sentiment
analysis** and capture **cutomer feedback gestures** across your entire
retail store and give you the best possible analysis of your customer.

Salesmigo is your key to multiplying your sales you make! 
Elevate your workforce to bring out the best in them, 
productivity and accuracy! In short a salesperson's best amigo!

Note: 
The hosted apps are very slow due to free tier limitations,
it would work best if you used the local server instances instead!

I've hosted the front-end app at: 
https://vercel.com/palanikannan1437/salesmigo

I've hosted the backend-end app at: 
https://salesmigo-backend.herokuapp.com/


## Tech Stack

**Client:** ReactJS(NextJS framework),face-api.js, tfjs-core, 
Styled Components, ReactDnD

**Server:** NodeJS(ExpressJS framework), face-api.js, tfjs-node, 
AWS,Recombee


## Optimizations

To increase the face decriptor matching downtime for face recognition,
I've implemented multithreading in nodejs using node worker threads!

As the size of the database increases,I noticed that just plainly iterating 
through the list of databases and comparing the euclidean distance between
the input descriptor and list of descriptors from the dataase increased by 10ms
with every customer record I inserted in the database. So to reduce the downtime implemented
comparing using worker threads by using shared buffer memory!

- Face database with 10k records:
  > iterative approach: 1 =>  ~100000ms / match

  > my approach: threadPoolSize: 12 =>  ~1000 ms / match

- Face database with 300k records:
  > threadPoolSize: 1 => ~43 mins / match  
  
  > my approach: threadPoolSize: 12 => ~24 s / match

  These results are based on my test run with loading
  the records from a json file instead of a database due 
  to free tier limitations on the number of request made!
## Run Locally

Clone the project

```bash
  git clone https://github.com/Palanikannan1437/Salesmigo-backend.git
```

Go to the project directory

```bash
  cd Salesmigo-backend
```

Install dependencies

```bash
  npm install
```

To start the server it in development mode,
```bash
  node server.js
```

## API-Documentation

Checkout my application's API Documentation at: https://documenter.getpostman.com/view/17862825/Uz5FKGd4

## Deployment

Note: 
The hosted apps are very slow due to free tier limitations and limits,
it would work best if you used the local server instances instead!

I've hosted the front-end app at: 
https://vercel.com/palanikannan1437/salesmigo

I've hosted the backend-end app at: 
https://salesmigo-backend.herokuapp.com/

## Environment Variables for Client Side

To run this project, you will need to add the following environment variables to your .env file

`NODE_ENV`

`PORT`

`DATABASE`

`DATABASE_PASSWORD`

`CLIENT_ID`
## Lessons Learned

 From the start of this project,
 - I have learnt about security aspects of our application like cors, jwt access tokens, refresh tokens,rotation of tokens,etc
 - Proper architecture of your application's code for maintaining it in the long run

 - Working properly with git branches...i.e. a new branch for each feature and then merging to the main branch if everything is working after deployment.

 - Properly commenting stuff not only for others to read but even for you to understand the code later

 - Recently I learnt about the production aspects as well..i.e. deploying my backend to aws and restart it on a crash automatically!

 - AND the importance of proper error/exception handling, rejection handling and debugging the code!

And specific to this project, I learnt to work with ML face recognition libraries and I read some research papers about which model is to be used with which use case, both at the frontend and backend!


## Demo

https://www.youtube.com/watch?v=IeTAEBTnJnU
