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
    "currentPassword": "Password@123",
    "password": "Password@123",
    "confirmPassword": "Password@123"
}

describe("POST /api/v1/user/change/password", () => {
  it('#V1-changePassword 1 should fail when authorization is missing with status: 401', (done) => {
    console.log("Here");
    chai
    .request(server)
    .post("/api/v1/user/change/password")
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
    it("#V1-changePassword 2 Mandatory Fields is empty should return an status: 422 Ok.", (done) => {
        console.log("Here");
        let body={ }
        chai
          .request(server)
          .post("/api/v1/user/change/password")
          .set('authorization', input.token)
          .send(body)
          .end((err, res) => {
            res.should.have.status(422);
            res.body.should.be.a("object");
            res.body.message.should.be.eql("currentPassword is required");
            res.body.status.should.be.eql(422);
            done();
          });
      });

      it("#V1-changePassword 3 Current Passeord Empty should return an status: 422 Ok.", (done) => {
        reqbody['currentPassword'] = ""
        chai
        .request(server)
        .post("/api/v1/user/change/password")
        .set('authorization', input.token)
        .send(reqbody)
        .end((err, res) => {
          res.should.have.status(422);
          res.body.should.be.a("object");
          res.body.message.should.be.eql("currentPassword is not allowed to be empty");
          res.body.status.should.be.eql(422);
          done();
        });
    });

    it("#V1-changePassword 4 User not exist should return an status: 409 Ok.", (done) => {
        console.log("rea",reqbody)
        chai
        .request(server)
        .post("/api/v1/user/change/password")
        .set('authorization', input.token)
        .send(reqbody)
        .end((err, res) => {
          if(res.status== 409){
          res.should.have.status(409);
          res.body.should.be.a("object");
          res.body.message.should.be.eql("User not found");
          res.body.status.should.be.eql(409);
          done();
          }else{
            res.should.have.status(200);
            res.body.should.be.a("object");
            res.body.message.should.be.eql("Password changed successfully");
            res.body.status.should.be.eql(200);
            done();
          }
        });
    });
    it("#V1-changePassword 5 comparePassword failed should return an status: 409 Ok.", (done) => {
        chai
        .request(server)
        .post("/api/v1/user/change/password")
        .set('authorization', input.token)
        .send(reqbody)
        .end((err, res) => {
          res.should.have.status(409);
          res.body.should.be.a("object");
          res.body.message.should.be.eql("Current password is incorrect");
          res.body.status.should.be.eql(409);
          done();
        });
      });
      it("#V1-changePassword 6 passwordMatchesCurrent should return an status: 409 Ok.", (done) => {
        chai
        .request(server)
        .post("/api/v1/user/change/password")
        .set('authorization', input.token)
        .send(reqbody)
        .end((err, res) => {
          res.should.have.status(409);
          res.body.should.be.a("object");
          res.body.message.should.be.eql("New password matches your current password");
          res.body.status.should.be.eql(409);
          done();
        });
    });
    it("#V1-changePassword 7 passwordNotmatch should return an status: 409 Ok.", (done) => {
        chai
        .request(server)
        .post("/api/v1/user/change/password")
        .set('authorization', input.token)
        .send(reqbody)
        .end((err, res) => {
          res.should.have.status(409);
          res.body.should.be.a("object");
          res.body.message.should.be.eql("Password doesn't match with confirm password");
          res.body.status.should.be.eql(409);
          done();
        });
    });
    

});