const dal = require('../dal/course_students');
const task_student_dal = require("../dal/tasks_course_student")
const test_dal = require("../dal/tests")
const tasks_dal = require('../dal/tasks');
const lectures_dal = require('../dal/lectures')

exports.create = async (req, res) => {
    const { studentId, courseId, registerDate } = req.body;
    if (!studentId || !courseId || !registerDate)
        return res.status(400).json({ message: "All fields are required" });

    await dal.create(req.body)
        .then(data => res.send(data))
        .catch(err => res.status(500).send({ message: err.message || "Some error occurred while creating the question." }))

}
exports.findAll = async (req, res) => {
    // only manager can access
    await dal.findAll()
        .then(data => { res.send(data); })
        .catch(err => {
            res.status(404).send({ message: err.message || "Failed retrieving courses for students." })
        })
}
// According to studentID
exports.findAllByStudentId = async (req, res) => {
    const studentId = req.params.id;
    await dal.findAll({ where: { studentId: studentId } })
        .then(data => { res.send(data); })
        .catch(err => {
            res.status(404).send({ message: err.message || "Failed retrieving courses for students." })
        })
}
exports.findOne = async (req, res) => {
    const id = req.params.id;
    await dal.findOne({ where: { id: id } })
        .then(data => {
            if (data)
                res.send(data);
            else res.status(404).send({ message: `Could not find course for student by id ${id}` });
        })
}
exports.update = async (req, res) => {
    const id = req.body.id;
    await dal.update(req.body, id)
        .then(num => {
            if (num == 1)
                res.send(`Successfully Updating course for student by id ${id}`);
            else res.status(500).send('Failed Updating');
        });
}
exports.delete = async (req, res) => {
    const id = req.params.id;
    await dal.delete(id)
        .then(num => {
            if (num == 1)
                res.send(`Successfully deletion course for student by id ${id}`)
            else res.status(500).send('Failed Deletion');
        })
}

exports.viewDetails = async (req, res) => {
    const courseStudentId = req.params.id;
    let details = [];
    let numOfLectures = 0;
    const courseStudent = await dal.findOne({ where: { id: courseStudentId } });
    if (courseStudent) {
        const nextLectureNum = courseStudent.nextLectureNum;
        const lectures = await lectures_dal.findAll({ where: { courseId: courseStudent.courseId } });
        if (lectures) {
            numOfLectures = lectures.length;
            for (let i = 0; i < lectures.length; i++) {
                const task = await tasks_dal.findOne({ where: { lectureId: lectures[i].id } });
                if (!task) {
                    details.push({ lectureNum: i + 1, existTask: false, isDone: false, isViewed: i < nextLectureNum });
                }
                else {
                    const taskStudent = await task_student_dal.findOne({ where: { taskId: task.id } });
                    if (taskStudent)
                        details.push({ lectureNum: i + 1, existTask: true, isDone: taskStudent.isDone, isViewed: i < nextLectureNum });
                    if (numOfLectures <= nextLectureNum) {
                        const test = await test_dal.findOne({ where: { courseStudentId: courseStudentId } });
                        if (test) {
                            details.push({ testScores: test.scores });
                        }
                        else details.push({ testScores: 'Unsubmitted' });
                    }
                }
            }

        }
        return res.send(details);
    }
    return res.status(500).json({ message: `ERROR view details` });
}

exports.canTest = async (courseStudentId) => {
    const courseStudent = await dal.findOne({ where: { id: courseStudentId } });
    if (courseStudent) {
        const nextLectureNum = courseStudent.nextLectureNum;
        const lectures = lectures_dal.findAll({ where: { courseId: courseStudent.courseId } });
        if (lectures) {
            if (nextLectureNum > lectures.length)
                return true;
        }
    }
    return false;
}