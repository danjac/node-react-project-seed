import request from 'supertest'
import express from 'express'
import dotenv from 'dotenv'
import bodyParser from 'body-parser'
import errorHandler from 'errorhandler'
import methodOverride from 'method-override'
import expressJwt from 'express-jwt'
import mongoose from 'mongoose'
import ClearDB from 'mocha-mongoose'
import {expect} from 'chai'

import routes, {jwtToken} from '../lib/routes'
import {User} from '../lib/models'

dotenv.load()

const ObjectId = mongoose.Types.ObjectId
const dbUri = 'mongodb://localhost/'+ process.env.DB_NAME + '_test'

const clearDB = ClearDB(dbUri)

const app = express()

app.use(bodyParser.json())
app.use(methodOverride())

// fake jwt
//
app.use((req, res, next) => {
    var userId = req.header('authToken')
    if (userId) {
        req.authToken = {id: userId}
    }
    next()
})

routes(app)

// Example 
/*
describe("DELETE /api/delete",function() {

    beforeEach((done) => {
        if (mongoose.connection.db) return done()
        mongoose.connect(dbUri, done)
    })
    
    beforeEach((done) => {
        clearDB(done)
    })

    beforeEach((done) => {

        new User({
            name: 'testuser10',
            email: 'teste10r@gmail.com',
            password: 'testpass'
        })
        .save()
        .then((user) => {
            this.user = user
            return new Post({
                title: 'testing something',
                url: 'http://test',
                author: this.user._id
            }).save()
        })
        .then((post) => {
            this.post = post
            done()
        }, (err) => {
            console.log(err)
            done()
        })
    })

    it('should return a 401 if no user is authenticated', (done) => {
            request(app)
                .delete('/api/' + this.post._id + '/')
                .expect(401)
                .end(done)
    })

    it('should return a 404 if no post exists', (done) => {
        request(app)
            .delete('/api/' + ObjectId())
            .set('authToken', this.user._id)
            .expect(404)
            .end(done)
    })

    it('should return a 404 if post does not belong to user', (done) => {
            new User({
                name: 'testuser11',
                email: 'test11@gmail.com',
                password: 'testpass'
            })
            .save()
            .then((user) => {
                request(app)
                .delete('/api/' + this.post._id + '/')
                .set('authToken', user._id)
                .expect(404)
                .end(done)
            })
    })

    it('should delete the post if the post belongs to the user', (done) => {
        request(app)
            .delete('/api/' + this.post._id + '/')
            .set('authToken', this.user._id)
            .expect(200)
            .end(() => {
                Post
                    .count()
                    .exec()
                    .then((result) => {
                        expect(result).to.equal(0)
                        done()
                    }, (err) => console.log(err))
            })

    })


})
*/
