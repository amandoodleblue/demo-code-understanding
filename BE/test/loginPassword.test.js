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
//futureDate.setDate(futureDate.getDate() + 1);
const reqbody = {
    "emaiIdOrMobile": "9876543210",
    "password": "Password@123"
}

describe("POST /api/v1/user/login/password", () => {
    it("#V1-loginPassword 1 Mandatory Fields is empty should return an status: 422 Ok.", (done) => {
        console.log("Here");
        let body = { };
        chai
          .request(server)
          .post("/api/v1/user/login/password")
          .send(body)
          .end((err, res) => {
            res.should.have.status(422);
            res.body.should.be.a("object");
            res.body.message.should.be.eql("emaiIdOrMobile is required, password is required");
            res.body.status.should.be.eql(422);
            done();
        });
    });

    it("#V1-loginPassword 2 emaiIdOrMobile pass Empty value should return an status: 422 Ok.", (done) => {
        reqbody['emaiIdOrMobile'] = ""
        chai
        .request(server)
        .post("/api/v1/user/login/password")
        .send(reqbody)
        .end((err, res) => {
          res.should.have.status(422);
          res.body.should.be.a("object");
          res.body.message.should.be.eql("emaiIdOrMobile is not allowed to be empty");
          res.body.status.should.be.eql(422);
          done();
        });
    });

    
    it("#V1-loginPassword 3 Invalid Email or Mobile should return an status: 400 Ok.", (done) => {
        reqbody['emaiIdOrMobile'] = "abc"
        chai
        .request(server)
        .post("/api/v1/user/login/password")
        .send(reqbody)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a("object");
          res.body.message.should.be.eql("Invalid email Id or mobile number");
          res.body.status.should.be.eql(400);
          done();
        });
    });

    it("#V1-loginPassword 4 emaiIdOrMobile is required and Empty Password should return an status: 422 Ok.", (done) => {
        delete reqbody['emaiIdOrMobile']
        reqbody['password'] = "";
        chai
        .request(server)
        .post("/api/v1/user/login/password")
        .send(reqbody)
        .end((err, res) => {
          res.should.have.status(422);
          res.body.should.be.a("object");
          res.body.message.should.be.eql("emaiIdOrMobile is required, password is not allowed to be empty");
          res.body.status.should.be.eql(422);
          done();
        });
    });

    it("#V1-loginPassword 5 Empty Password should return an status: 422 Ok.", (done) => {
        delete reqbody['password']
        reqbody['emaiIdOrMobile'] = "";
        chai
        .request(server)
        .post("/api/v1/user/login/password")
        .send(reqbody)
        .end((err, res) => {
          res.should.have.status(422);
          res.body.should.be.a("object");
          res.body.message.should.be.eql("emaiIdOrMobile is not allowed to be empty, password is required");
          res.body.status.should.be.eql(422);
          done();
        });
    });

});