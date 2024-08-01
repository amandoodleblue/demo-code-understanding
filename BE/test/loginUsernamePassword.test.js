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
    "userName": "battle-star",
    "password": "Password@123"
}

describe("POST /api/v1/user/login/username/password", () => {

    it("#V1-loginUsernamePassword 1 Mandatory Fields is empty should return an status: 422 Ok.", (done) => {
        console.log("Here");
        let body = { };
        chai
          .request(server)
          .post("/api/v1/user/login/username/password")
          .send(body)
          .end((err, res) => {
            res.should.have.status(422);
            res.body.should.be.a("object");
            res.body.message.should.be.eql("userName is required, password is required");
            res.body.status.should.be.eql(422);
            done();
        });
    });

    it("#V1-loginUsernamePassword 2 userName Empty should return an status: 422 Ok.", (done) => {
        delete reqbody['userName']
        reqbody['userName'] = ""
        chai
        .request(server)
        .post("/api/v1/user/login/username/password")
        .send(reqbody)
        .end((err, res) => {
          res.should.have.status(422);
          res.body.should.be.a("object");
          res.body.message.should.be.eql("userName is not allowed to be empty");
          res.body.status.should.be.eql(422);
          done();
        });
    });

    it("#V1-loginUsernamePassword 3 password Empty should return an status: 422 Ok.", (done) => {
        reqbody['password'] = ""
        reqbody['userName'] = "battle-star"
        chai
        .request(server)
        .post("/api/v1/user/login/username/password")
        .send(reqbody)
        .end((err, res) => {
          res.should.have.status(422);
          res.body.should.be.a("object");
          res.body.message.should.be.eql("password is not allowed to be empty");
          res.body.status.should.be.eql(422);
          done();
        });
    });

    
    it("#V1-loginUsernamePassword 4 password is required and username is empty  should return an status: 422 Ok.", (done) => {
        delete reqbody['userName']
        reqbody['password'] = ""
        chai
        .request(server)
        .post("/api/v1/user/login/username/password")
        .send(reqbody)
        .end((err, res) => {
          res.should.have.status(422);
          res.body.should.be.a("object");
          res.body.message.should.be.eql("userName is required, password is not allowed to be empty");
          res.body.status.should.be.eql(422);
          done();
        });
    });

    it("#V1-loginUsernamePassword 5 password is required and username is empty  should return an status: 422 Ok.", (done) => {
        delete reqbody['password']
        reqbody['userName'] = ""
        chai
        .request(server)
        .post("/api/v1/user/login/username/password")
        .send(reqbody)
        .end((err, res) => {
          res.should.have.status(422);
          res.body.should.be.a("object");
          res.body.message.should.be.eql("userName is not allowed to be empty, password is required");
          res.body.status.should.be.eql(422);
          done();
        });
    });

});