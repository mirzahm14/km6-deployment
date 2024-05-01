const {PrismaClient} = require('@prisma/client')

const prisma = new PrismaClient()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const {JWT_SECRET_KEY} = process.env

const imagekit = require('../libs/imagekit')
const path = require('path')

module.exports = {
    register: async (req, res, next) => {
        try {
            const { first_name, last_name, email, password } = req.body
            if(!first_name || !last_name || !email || !password) {
                return res.status(400).json({
                    status: false,
                    message: 'first name, last name, email and password are required!',
                    data: null
                });
            }

            const isExist = await prisma.users.findUnique({where: {email}})
            if(isExist) {
                return res.status(400).json({
                    status: false,
                    message: 'email has already been used!',
                    data: null
                });
            }

            const hashedPassword = await bcrypt.hash(password, 10)
            const user = await prisma.users.create({
                data: {
                    first_name,
                    last_name,
                    email,
                    password: hashedPassword
                }
            })

            if(!user){
                return res.status(400).json({
                    status: false,
                    message: 'user failed to create',
                    data: null
                });
            }
            delete user.password
            return res.status(201).json({
                status: true,
                message: 'OK',
                data: user
            });
        } catch (err) {
            next(err)
        }
    },

    login: async (req, res, next) => {
        try {
            const { email, password } = req.body
            if(!email || !password) {
                return res.status(400).json({
                    status: false,
                    message: 'email and password are required!',
                    data: null
                });
            }

            const user = await prisma.user.findUnique({where: {email}})
            if(!user) {
                return res.status(400).json({
                    status: false,
                    message: 'invalid email or password!',
                    data: null
                });
            }

            const isPasswordMatch = await bcrypt.compare(password, user.password)
            if(!isPasswordMatch) {
                return res.status(400).json({
                    status: false,
                    message: 'invalid email or password!',
                    data: null
                });
            }
            delete user.password

            const token = jwt.sign({id: user.id}, JWT_SECRET_KEY)
            return res.status(200).json({
                status: true,
                message: 'OK',
                data: {...user, token}
            });
        } catch (err) {
            next(err)
        }
    },

    googleOauth2: (req, res) => {
        let token = jwt.sign({ id: req.user.id }, JWT_SECRET_KEY);

        return res.status(200).json({
            status: true,
            message: 'OK',
            err: null,
            data: { user: req.user, token }
        });
    },

    updateProfile: async (req, res, next) => {
        try {
            const { first_name, last_name, email, address, occupation } = req.body
            if(!first_name || !last_name || !email || !address || !occupation) {
                return res.status(400).json({
                    status: false,
                    message: 'first name, last name, email, address and occupation are required!',
                    data: null
                });
            }
            const user = await prisma.users.update({
                where: { id: +req.params.id },
                data: {
                    first_name,
                    last_name,
                    email,
                    address,
                    occupation
                }
            })

            if(!user){
                return res.status(400).json({
                    status: false,
                    message: 'user failed to update',
                    data: null
                })
            }

            return res.status(200).json({
                status: true,
                message: 'OK',
                data: user
            });
        } catch (err) {
            next(err)
        }
    },

    updateAvatar: async (req, res, next) => {
        try {
            const strFile = req.file.buffer.toString('base64')

            const { url } = await imagekit.upload({
                fileName: Date.now() + path.extname(req.file.originalname),
                file: strFile
            })

            if(!url){
                return res.status(400).json({
                    status: false,
                    message: 'image failed to upload',
                    data: null
                })
            }

            const user = await prisma.users.update({
                where: { id: +req.params.id },
                data: {
                    avatar_url: url
                }
            })

            if(!user){
                return res.status(400).json({
                    status: false,
                    message: 'user failed to update',
                    data: null
                })
            }

            return res.status(200).json({
                status: true,
                message: 'OK',
                data: user
            });
        } catch (err) {
            next(err)
        }
    }
}