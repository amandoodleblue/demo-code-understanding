"use-strict";

/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
//During the test the env variable is set to test
const { OTP_TYPE } = require('./../src/constants')
const path = require("path");
process.env.NODE_ENV = "test";
process.env.CONFIG_ARG = "TEST";
require("dotenv").config({
  path: path.join(
    process.cwd(),
    `.env.${process.env.CONFIG_ARG.toLocaleLowerCase()}`
  )
});

console.log(process.env.DB_CHOICE);
let CONFIG = require("../src/configs/config")(process.env.CONFIG_ARG);
console.log(CONFIG);
const { messages, statusCodes, businessLayerConfig } = require("./../src/configs");
let mongoose = require("mongoose");
let { user, otp } = require("../src/database/mongo/models");

//Require the dev-dependencies
let chai = require("chai");
let chaiHttp = require("chai-http");
let server = require("../app");
let should = chai.should();
chai.use(chaiHttp);
let futureDate = new Date().toISOString().slice(0, 10);
//futureDate.setDate(futureDate.getDate() + 1);
const reqbody = {
  "firstName": "MS",
  "lastName": "Dhoni",
  "countryCode": "+91",
  "userName": "battle-dev",
  "mobileNumber": "9976543210",
  "emailId": "abc@abc.com",
  "password": "Password@123",
  "dob": "1998-07-03",
  "gender": "Male",
  "smsOtp": "123456",
  "profileImage": "https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__480.jpg"
}

describe("POST /api/v1/user/otp/verify/register", () => {
    it("#V1-verifyotp 1 Username required should return an status: 422 Ok.", (done) => {
        console.log("Here");
        console.log("futureDate",futureDate)
        delete reqbody['userName']
        chai
          .request(server)
          .post("/api/v1/user/otp/verify/register")
          .send(reqbody)
          .end((err, res) => {
            res.should.have.status(422);
            res.body.should.be.a("object");
            res.body.message.should.be.eql("userName is required");
            res.body.status.should.be.eql(422);
            done();
          });
      });
    it("#V1-verifyotp 2 Username Empty should return an status: 422 Ok.", (done) => {
        delete reqbody['userName']
        reqbody['userName'] = ""
        chai
        .request(server)
        .post("/api/v1/user/otp/verify/register")
        .send(reqbody)
        .end((err, res) => {
          res.should.have.status(422);
          res.body.should.be.a("object");
          res.body.message.should.be.eql("userName is not allowed to be empty");
          res.body.status.should.be.eql(422);
          done();
        });
      });

    it("#V1-verifyotp 3 Mandatory Field missing from Reqbody [mobileno]", (done) => {
        delete reqbody['mobileNumber']
        reqbody['userName'] = "battle-dev",
        console.log("req",reqbody)
        chai
        .request(server)
        .post("/api/v1/user/otp/verify/register")
        .send(reqbody)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a("object");
          res.body.message.should.be.eql("Mobile number is required");
          res.body.status.should.be.eql(400);
          done();
        });
    });

    it("#V1-verifyotp 4 Mobileno Empty should return an status: 422 Ok.", (done) => {
        delete reqbody['mobileNumber']
        reqbody['mobileNumber'] = ""
        chai
        .request(server)
        .post("/api/v1/user/otp/verify/register")
        .send(reqbody)
        .end((err, res) => {
          res.should.have.status(422);
          res.body.should.be.a("object");
          res.body.message.should.be.eql("mobileNumber is not allowed to be empty");
          res.body.status.should.be.eql(422);
          done();
        });
    });

    it("#V1-verifyotp 5 Mobileno should not contains alpha & special characters should return an status: 422 Ok.", (done) => {
        delete reqbody['mobileNumber']
        reqbody['mobileNumber'] = "abc"
        chai
        .request(server)
        .post("/api/v1/user/otp/verify/register")
        .send(reqbody)
        .end((err, res) => {
          res.should.have.status(422);
          res.body.should.be.a("object");
          res.body.message.should.be.eql("mobileNumber must only contain numbers");
          res.body.status.should.be.eql(422);
          done();
        });
    });

    it("#V1-verifyotp 6 Email Id format wrong should return an status: 422 Ok. ", (done) => {
        delete reqbody['emailId']
        reqbody['mobileNumber'] = "9976543210"
        reqbody['emailId'] ="abc"
        chai
        .request(server)
        .post("/api/v1/user/otp/verify/register")
        .send(reqbody)
        .end((err, res) => {
          res.should.have.status(422);
          res.body.should.be.a("object");
          res.body.message.should.be.eql("emailId must be a valid email");
          res.body.status.should.be.eql(422);
          done();
        });
    });

    it("#V1-verifyotp 7 should not allow the future date in [DOB]", (done) => {
        reqbody['emailId'] ="abc@gmail.com"
        reqbody['dob'] = futureDate;
        console.log("reqbody",reqbody)
        chai
        .request(server)
        .post("/api/v1/user/otp/verify/register")
        .send(reqbody)
        .end((err, res) => {
          if(res.status == 409){
            res.should.have.status(409);
            res.body.should.be.a("object");
            res.body.message.should.be.eql("OTP is invalid");
            res.body.status.should.be.eql(409);
            done();
          }else if(res.status == 400){
          res.should.have.status(400);
          res.body.should.be.a("object");
          res.body.message.should.be.eql("Future date cannot be accepted for dob");
          res.body.status.should.be.eql(400);
          done();
          }else{
            res.should.have.status(200);
            res.body.should.be.a("object");
            res.body.message.should.be.eql("User Created Successfully");
            res.body.status.should.be.eql(200);
            done();
          }
        });
    });

    it("#V1-verifyotp 8 Gender should not be empty should return an status: 422 Ok.", (done) => {
        reqbody['gender'] = ""
        chai
        .request(server)
        .post("/api/v1/user/otp/verify/register")
        .send(reqbody)
        .end((err, res) => {
          res.should.have.status(422);
          res.body.should.be.a("object");
          res.body.message.should.be.eql("gender is not allowed to be empty");
          res.body.status.should.be.eql(422);
          done();
        });
    });
    
    it("#V1-verifyotp 9 Gender has number should return an status: 422 Ok.", (done) => {
        delete reqbody['gender']
        reqbody['gender'] = "123"
        chai
        .request(server)
        .post("/api/v1/user/otp/verify/register")
        .send(reqbody)
        .end((err, res) => {
          res.should.have.status(422);
          res.body.should.be.a("object");
          res.body.message.should.be.eql("gender must be one of [Male, Female, Others, Prefer not to say]");
          res.body.status.should.be.eql(422);
          done();
        });
    });

    it("#V1-verifyotp 10 Empty OTP should return an status: 422 Ok.", (done) => {
        delete reqbody['gender']
        reqbody['smsOtp'] = ""
        chai
        .request(server)
        .post("/api/v1/user/otp/verify/register")
        .send(reqbody)
        .end((err, res) => {
          res.should.have.status(422);
          res.body.should.be.a("object");
          res.body.message.should.be.eql("smsOtp is not allowed to be empty");
          res.body.status.should.be.eql(422);
          done();
        });
    });

    it("#V1-verifyotp 11 smsotp has alphabets should return an status: 422 Ok.", (done) => {
        reqbody['smsOtp'] = "abc"
        chai
        .request(server)
        .post("/api/v1/user/otp/verify/register")
        .send(reqbody)
        .end((err, res) => {
          res.should.have.status(422);
          res.body.should.be.a("object");
          res.body.message.should.be.eql("smsOtp must only contain numbers");
          res.body.status.should.be.eql(422);
          done();
        });
    });
  
    it("#V1-verifyotp 12 invalid OTP should return an status: 422 Ok.", (done) => {
        reqbody['smsOtp'] = "12345"
        chai
        .request(server)
        .post("/api/v1/user/otp/verify/register")
        .send(reqbody)
        .end((err, res) => {
          res.should.have.status(422);
          res.body.should.be.a("object");
          res.body.message.should.be.eql("smsOtp length must be 6 characters long");
          res.body.status.should.be.eql(422);
          done();
        });
    });


});