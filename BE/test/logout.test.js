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
let body={ }

describe("POST /api/v1/user/logout", () => {
    it('#logoutt 1 should fail when authorization is missing with status: 401', (done) => {
        console.log("Here");
        chai
        .request(server)
        .post("/api/v1/user/logout")
        .end((err, res) => {
            console.log("res",res)
                res.should.have.status(401);
                res.body.should.be.a("object");
                res.body.message.should.be.eql("unauthorized");
                res.body.status.should.be.eql(401);
                done();
        });
    });
    it("#logoutt 2 Invalid Session Id should return an status: 409 Ok.", (done) => {
        console.log("Here");
        chai
          .request(server)
          .post("/api/v1/user/logout")
          .set('authorization', input.token)
          .end((err, res) => {
            if(res.status== 409){
              res.should.have.status(409);
              res.body.should.be.a("object");
              res.body.message.should.be.eql("Invalid session, unable to logout.");
              res.body.status.should.be.eql(409);
            done();
            }else{
              res.should.have.status(200);
              res.body.should.be.a("object");
              res.body.message.should.be.eql("User Logout Success");
              res.body.status.should.be.eql(200);
              done();
            }
          });
      });
});