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
    "emaiIdOrMobile": "8277362212"
}

describe("POST /api/v1/user/forgot/password", () => {
    it("#V1-forgetPassword 1 Mandatory Fields is empty should return an status: 422 Ok.", (done) => {
        console.log("Here");
        let body={ }
        chai
          .request(server)
          .post("/api/v1/user/forgot/password")
          .send(body)
          .end((err, res) => {
            res.should.have.status(422);
            res.body.should.be.a("object");
            res.body.message.should.be.eql("emaiIdOrMobile is required");
            res.body.status.should.be.eql(422);
            done();
          });
      });

      it("#V1-forgetPassword 2 emaiIdOrMobile pass Empty value should return an status: 422 Ok.", (done) => {
        reqbody['emaiIdOrMobile'] = ""
        chai
        .request(server)
        .post("/api/v1/user/forgot/password")
        .send(reqbody)
        .end((err, res) => {
          res.should.have.status(422);
          res.body.should.be.a("object");
          res.body.message.should.be.eql("emaiIdOrMobile is not allowed to be empty");
          res.body.status.should.be.eql(422);
          done();
        });
    });

    it("#V1-forgetPassword 3 Invalid Email or Mobile should return an status: 400 Ok.", (done) => {
        reqbody['emaiIdOrMobile'] = "abc"
        chai
        .request(server)
        .post("/api/v1/user/forgot/password")
        .send(reqbody)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a("object");
          res.body.message.should.be.eql("Invalid email Id or mobile number");
          res.body.status.should.be.eql(400);
          done();
        });
    });
    it("#V1-forgetPassword 4 user not exist should return an status: 409 Ok.", (done) => {
        let requestBody={
            "emaiIdOrMobile": "8277362212"
        }
        chai
        .request(server)
        .post("/api/v1/user/forgot/password")
        .send(requestBody)
        .end((err, res) => {
          res.should.have.status(409);
          res.body.should.be.a("object");
          res.body.message.should.be.eql("User not found");
          res.body.status.should.be.eql(409);
          done();
        });
      });
      it("#V1-forgetPassword 5 success response should return an status: 200 Ok.", (done) => {
        let bodyrequest={
            "emaiIdOrMobile": "9876543210"
        }
        chai
        .request(server)
        .post("/api/v1/user/forgot/password")
        .send(bodyrequest)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.message.should.be.eql("Data fetched successfully");
          res.body.status.should.be.eql(200);
          done();
        });
    });

});