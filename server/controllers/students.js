const dal = require('../dal/students');
const mailer = require('../services/mailer');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')


exports.register = async (req, res) => {

    const { firstName, lastName, idNumber, email, password, image } = req.body;
    //confirm data
    if (!idNumber || !email || !password) {
        return res.status(400).json({ message: "all fields are required" });
    }
    const duplicate = await dal.findOne({ where: { idNumber: idNumber } })
    if (duplicate) {
        return res.status(409).json({ message: "Duplicate student" })
    }
    //Hash password
    const hashedPwd = await bcrypt.hash(password, 10);
    const studentObject = { firstName, lastName, idNumber, email, password: hashedPwd, image };
    const student = await dal.create(studentObject);
    if (student) { // Created
        const subject = 'Welcome to our school';
        const body = 'Thank you for joining 👍,\nHappy to see you with us.\nWish you beneficial experience!\n😊';
        mailer.sendEmail(email, subject, body)
            .then(info => {
                console.log('Email sent: ', info.response);
            })
            .catch(error => {
                return res.status(500).send('Failed to send email');
            });
        return res.status(201).json({
            message: `New student ${firstName} ${lastName} created`
        })
    }
    return res.status(400).json({ message: 'Invalid student data received' })
};

exports.login = async (req, res) => {

    const { password, idNumber } = req.body;
    if (!idNumber || !password) {
        return res.status(400).send({ message: "All fields are required" })
    }
    const finduser = await dal.findOne({ where: { idNumber: idNumber } })
    if (!finduser) {
        return res.status(401).send({ message: 'Unauthorized' });
    }
    const match = await bcrypt.compare(password, finduser.password);
    if (!match) {
        return res.status(401).send({ message: 'The password is mistake' });
    }
    const studentInfo = { id: finduser.id, firstName: finduser.firstName, lastName: finduser.lastName, idNumber: finduser.idNumber, email: finduser.email };

    const accessToken = jwt.sign(studentInfo, process.env.ACCESS_TOKEN_SECRET);

    res.json({ accessToken: accessToken })
}

exports.findAll = async (req, res) => {
    await dal.findAll()
        .then(data => { res.send(data); })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving students."
            });
        })
}

exports.findOneByPassword = async (req, res) => {
    const password = req.body.password;
    await dal.findOne({ where: { password: password } })
        .then(data => {
            if (data) {
                res.send(data);
            }
            else {
                res.status(404).send({
                    message: `Cannot find student by password = ${password}`
                })
            }
        })
}

exports.findOneByIdNumber = async (req, res) => {
    const idNumber = req.body.idNumber;
    await dal.findOne({ where: { idNumber: idNumber } })
        .then(data => {
            if (data) {
                res.send(data);
            }
            else {
                res.status(404).send({
                    message: `Cannot find student by idNumber = ${idNumber}`
                })
            }
        })
}

exports.findOne = async (req, res) => {
    const id = req.params.id;
    await dal.findOne({ where: { id: id } })
        .then((data) => {
            if (data) {
                res.send(data);
            }
            else {
                res.status(404).send({
                    message: `Cannot find student by id = ${id}`
                });
            }
        })
}

exports.update = async (req, res) => {
    const id = req.body.id;
    const hashedPwd = await bcrypt.hash(req.body.password, 10);
    const userObject = {
        firstName: req.body.firstName, lastName: req.body.lastName,
        idNumber: req.body.idNumber, email: req.body.email, password: hashedPwd
    }
    await dal.update(userObject, id)

        .then(num => {
            console.log(req.body, id);
            if (num == 1) {
                res.send({
                    message: "Student was updated successfully."
                });
            } else {
                res.send({
                    message: `Cannot update Student with id = ${id}.
                    Maybe Student was not found or req.body is empty!`
                });
            }
        });
}

exports.delete = async (req, res) => {
    const id = req.params.id;
    await dal.delete(id)
        .then(num => {
            if (num == 1) {
                const to = req.body.email;
                const subject = 'Deleted Successfully';
                const body = 'You will be required to sign up again, \nif you want to register a new course or anything else.\n\nGood Luck!';

                res.send({ message: `Student was deleted successfully! 👍` });
                mailer.sendEmail(to, subject, body)
                    .then(info => {
                        console.log('Email sent: ', info.response);
                    })
                    .catch(error => {
                        console.log('Error sending email: ', error);
                        res.status(500).send('Failed to send email');
                    });
            }
            else {
                res.send({ message: `Cannot delete Student with id = ${id}. Maybe Student was not found!` })
            }
        })
        .catch(err => {
            res.status(500).send({ message: err.message || `Could not delete student with id ${id}` });
        });
}