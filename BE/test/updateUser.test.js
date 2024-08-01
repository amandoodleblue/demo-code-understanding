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
const input = require("../test/data/token.json").user;
const reqbody = {
    "firstName": "MS",
    "lastName": "Dhoni",
    "countryCode": "+91",
    "userName": "battle-star",
    "mobileNumber": "9876543210",
    "emailId": "abc@abc.com",
    "dob": "1998-07-03",
    "gender": "Male",
    "profileImage": "https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__480.jpg"
}
describe("PUT /api/v1/user/", () => {
    it('#updateUser 1 should fail when authorization is missing with status: 401', (done) => {
        console.log("Here");
        chai
        .request(server)
        .put("/api/v1/user/")
        .send(reqbody)
        .end((err, res) => {
            console.log("res",res)
                res.should.have.status(401);
                res.body.should.be.a("object");
                res.body.message.should.be.eql("unauthorized");
                res.body.status.should.be.eql(401);
                done();
        });
    });
    it("#updateUser 2 Mobileno Empty should return an status: 422 Ok.", (done) => {
        delete reqbody['mobileNumber']
        reqbody['mobileNumber'] = ""
        chai
        .request(server)
        .put("/api/v1/user/")
        .set('authorization', input.token)
        .send(reqbody)
        .end((err, res) => {
          res.should.have.status(422);
          res.body.should.be.a("object");
          res.body.message.should.be.eql("mobileNumber is not allowed to be empty");
          res.body.status.should.be.eql(422);
          done();
        });
    });

    it("#updateUser 3 Mobileno should not contains alpha & special characters should return an status: 422 Ok.", (done) => {
        delete reqbody['mobileNumber']
        reqbody['mobileNumber'] = "abc"
        chai
        .request(server)
        .put("/api/v1/user/")
        .set('authorization', input.token)
        .send(reqbody)
        .end((err, res) => {
          console.log("resonse",res)
          res.should.have.status(422);
          res.body.should.be.a("object");
          res.body.message.should.be.eql("mobileNumber must only contain numbers");
          res.body.status.should.be.eql(422);
          done();
        });
    });

    it("#updateUser 4 Gender should not be empty should return an status: 422 Ok.", (done) => {
      delete reqbody['mobileNumber']
      reqbody['gender'] = ""
      chai
      .request(server)
      .put("/api/v1/user/")
      .set('authorization', input.token)
      .send(reqbody)
      .end((err, res) => {
        res.should.have.status(422);
        res.body.should.be.a("object");
        res.body.message.should.be.eql("gender is not allowed to be empty");
        res.body.status.should.be.eql(422);
        done();
      });
  });
  
    it("#updateUser 5 Gender has number should return an status: 422 Ok.", (done) => {
        reqbody['gender'] = "123"
        chai
        .request(server)
        .put("/api/v1/user/")
        .set('authorization', input.token)
        .send(reqbody)
        .end((err, res) => {
          res.should.have.status(422);
          res.body.should.be.a("object");
          res.body.message.should.be.eql("gender must be one of [Male, Female, Others, Prefer not to say]");
          res.body.status.should.be.eql(422);
          done();
        });
    });

    it("#updateUser 6 Invaid Firstname should return an status: 422 Ok.", (done) => {
      delete reqbody['gender']
      reqbody['firstname'] = "s"
      chai
      .request(server)
      .put("/api/v1/user/")
      .set('authorization', input.token)
      .send(reqbody)
      .end((err, res) => {
        res.should.have.status(422);
        res.body.should.be.a("object");
        res.body.message.should.be.eql("firstname is not allowed");
        res.body.status.should.be.eql(422);
        done();
      });
  });
    it("#updateUser 7 Invalid lastname should return an status: 422 Ok.", (done) => {
    delete reqbody['firstname']
    reqbody['lastName'] = "s"
    chai
    .request(server)
    .put("/api/v1/user/")
    .set('authorization', input.token)
    .send(reqbody)
    .end((err, res) => {
      res.should.have.status(422);
      res.body.should.be.a("object");
      res.body.message.should.be.eql("lastName must have characters and should be between 2 to 30 letters");
      res.body.status.should.be.eql(422);
      done();
    });
  });
});