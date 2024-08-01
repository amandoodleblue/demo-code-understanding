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
const reqbody = {
    "countryCode": "+91",
    "mobileNumber": "9876543210"
}

describe("POST /api/v1/user/otp/get", () => {
    it("#V1-getotp 1 Mandatory Fields is empty should return an status: 400 Ok.", (done) => {
        console.log("Here");
        let body={ }
        chai
          .request(server)
          .post("/api/v1/user/otp/get")
          .send(body)
          .end((err, res) => {
            res.should.have.status(400);
            res.body.should.be.a("object");
            res.body.message.should.be.eql("Mobile number is required");
            res.body.status.should.be.eql(400);
            done();
          });
      });

      it("#V1-getotp 2 Mobileno Empty should return an status: 422 Ok.", (done) => {
        reqbody['mobileNumber'] = ""
        chai
        .request(server)
        .post("/api/v1/user/otp/get")
        .send(reqbody)
        .end((err, res) => {
          res.should.have.status(422);
          res.body.should.be.a("object");
          res.body.message.should.be.eql("mobileNumber is not allowed to be empty");
          res.body.status.should.be.eql(422);
          done();
        });
    });

    it("#V1-getotp 3 Mobileno should not contains alpha & special characters should return an status: 422 Ok.", (done) => {
        reqbody['mobileNumber'] = "abc"
        chai
        .request(server)
        .post("/api/v1/user/otp/get")
        .send(reqbody)
        .end((err, res) => {
          res.should.have.status(422);
          res.body.should.be.a("object");
          res.body.message.should.be.eql("mobileNumber must only contain numbers");
          res.body.status.should.be.eql(422);
          done();
        });
    });
    it("#V1-getotp 4 countryCode Empty should return an status: 422 Ok.", (done) => {
        reqbody['countrycode'] = ""
        reqbody['mobileNumber'] = "9876543210"
        chai
        .request(server)
        .post("/api/v1/user/otp/get")
        .send(reqbody)
        .end((err, res) => {
          res.should.have.status(422);
          res.body.should.be.a("object");
          res.body.message.should.be.eql("countrycode is not allowed");
          res.body.status.should.be.eql(422);
          done();
        });
      });
      it("#V1-getotp 5 country code contains alpha characters should return an status: 422 Ok.", (done) => {
        reqbody['countrycode'] = "abc"
        chai
        .request(server)
        .post("/api/v1/user/otp/get")
        .send(reqbody)
        .end((err, res) => {
          res.should.have.status(422);
          res.body.should.be.a("object");
          res.body.message.should.be.eql("countrycode is not allowed");
          res.body.status.should.be.eql(422);
          done();
        });
    });
    it("#V1-getotp valid reqbody should return an status: 200 Ok.", (done) => {
        let bodyReq = {
            "countryCode": "+91",
            "mobileNumber": "9876543210"
        }
        chai
        .request(server)
        .post("/api/v1/user/otp/get")
        .send(bodyReq)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.message.should.be.eql("OTP has been sent");
          res.body.status.should.be.eql(200);
          done();
        });
    });
    it("#V1-getotp 7 EmailId Empty should return an status: 422 Ok.", (done) => {
        delete reqbody['countrycode']
        reqbody['emailId'] = ""
        chai
        .request(server)
        .post("/api/v1/user/otp/get")
        .send(reqbody)
        .end((err, res) => {
          res.should.have.status(422);
          res.body.should.be.a("object");
          res.body.message.should.be.eql("emailId is not allowed to be empty");
          res.body.status.should.be.eql(422);
          done();
        });
    });

    it("#V1-getotp 8 Invaid Email should return an status: 422 Ok.", (done) => {
        reqbody['emailId'] = "abc"
        chai
        .request(server)
        .post("/api/v1/user/otp/get")
        .send(reqbody)
        .end((err, res) => {
          res.should.have.status(422);
          res.body.should.be.a("object");
          res.body.message.should.be.eql("emailId must be a valid email");
          res.body.status.should.be.eql(422);
          done();
        });
    });

    it("#V1-getotp 9 Success should return an status: 200 Ok.", (done) => {
      let bodyreq = {
        "countryCode": "+91",
        "mobileNumber": "9876543210"
      }
       chai
      .request(server)
      .post("/api/v1/user/otp/get")
      .send(bodyreq)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a("object");
        res.body.message.should.be.eql("OTP has been sent");
        res.body.status.should.be.eql(200);
        done();
      });
  });

});