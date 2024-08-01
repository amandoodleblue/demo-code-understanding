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
    "mobileNumber": "9876543210",
    "smsOtp": "123456"
}

describe("POST /api/v1/user/otp/verify/login", () => {
    it("#V1-verifylogin 1 Mobileno Empty should return an status: 422 Ok.", (done) => {
        delete reqbody['mobileNumber']
        reqbody['mobileNumber'] = ""
        chai
        .request(server)
        .post("/api/v1/user/otp/verify/login")
        .send(reqbody)
        .end((err, res) => {
          res.should.have.status(422);
          res.body.should.be.a("object");
          res.body.message.should.be.eql("mobileNumber is not allowed to be empty");
          res.body.status.should.be.eql(422);
          done();
        });
    });

    it("#V1-verifylogin 2 Mobileno should not contains alpha & special characters should return an status: 422 Ok.", (done) => {
        delete reqbody['mobileNumber']
        reqbody['mobileNumber'] = "abc"
        chai
        .request(server)
        .post("/api/v1/user/otp/verify/login")
        .send(reqbody)
        .end((err, res) => {
          res.should.have.status(422);
          res.body.should.be.a("object");
          res.body.message.should.be.eql("mobileNumber must only contain numbers");
          res.body.status.should.be.eql(422);
          done();
        });
    });

    
    it("#V1-verifylogin 3 Empty OTP should return an status: 422 Ok.", (done) => {
        delete reqbody['mobileNumber']
        reqbody['smsOtp'] = ""
        chai
        .request(server)
        .post("/api/v1/user/otp/verify/login")
        .send(reqbody)
        .end((err, res) => {
          res.should.have.status(422);
          res.body.should.be.a("object");
          res.body.message.should.be.eql("smsOtp is not allowed to be empty");
          res.body.status.should.be.eql(422);
          done();
        });
    });

    it("#V1-verifylogin 4 smsotp has alphabets should return an status: 422 Ok.", (done) => {
        reqbody['smsOtp'] = "abc"
        chai
        .request(server)
        .post("/api/v1/user/otp/verify/login")
        .send(reqbody)
        .end((err, res) => {
          res.should.have.status(422);
          res.body.should.be.a("object");
          res.body.message.should.be.eql("smsOtp must only contain numbers");
          res.body.status.should.be.eql(422);
          done();
        });
    });
  
    it("#V1-verifylogin 5 invalid OTP should return an status: 422 Ok.", (done) => {
        reqbody['smsOtp'] = "12345"
        chai
        .request(server)
        .post("/api/v1/user/otp/verify/login")
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