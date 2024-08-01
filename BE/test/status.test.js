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
let requestBody={ 
    "status": "ACTIVE"
}

describe("PUT /api/v1/user/status", () => {
    it('#userStatus should fail when authorization is missing with status: 401', (done) => {
        console.log("Here");
        chai
        .request(server)
        .put("/api/v1/user/status")
        .send(requestBody)
        .end((err, res) => {
            console.log("res",res)
                res.should.have.status(401);
                res.body.should.be.a("object");
                res.body.message.should.be.eql("unauthorized");
                res.body.status.should.be.eql(401);
                done();
        });
    });
    it("#userStatus 2 Mandatory Fields is empty should return an status: 422 Ok.", (done) => {
        console.log("Here");
        let body={ }
        chai
          .request(server)
          .put("/api/v1/user/status")
          .set('authorization', input.token)
          .send(body)
          .end((err, res) => {
            res.should.have.status(422);
            res.body.should.be.a("object");
            res.body.message.should.be.eql("status is required");
            res.body.status.should.be.eql(422);
            done();
          });
      });

      it("#userStatus 3 status pass Empty value should return an status: 422 Ok.", (done) => {
        let body={
            "status": ""
         }
        chai
        .request(server)
        .put("/api/v1/user/status")
        .set('authorization', input.token)
        .send(body)
        .end((err, res) => {
          res.should.have.status(422);
          res.body.should.be.a("object");
          res.body.message.should.be.eql("status is not allowed to be empty");
          res.body.status.should.be.eql(422);1
          done();
        });
    });
    it("#userStatus 4 User not Found should return an status: 409 Ok.", (done) => {
        console.log("Here");
        chai
          .request(server)
          .put("/api/v1/user/status")
          .set('authorization', input.token)
          .send(requestBody)
          .end((err, res) => {
            if(res.status == 409){
                res.should.have.status(409);
                res.body.should.be.a("object");
                res.body.message.should.be.eql("User not found");
                res.body.status.should.be.eql(409);
                done();
            }else{
                res.should.have.status(200);
                res.body.should.be.a("object");
                res.body.message.should.be.eql("User data updated successfully");
                res.body.status.should.be.eql(200);
                done();
            }
           
          });
      });
});