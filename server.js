
const express = require('express');

const app = express();
app.use(express.json());

// Initial Data
let enrollments = [
    {
        id: 601,
        studentName: "Aarav Gupta",
        courseCode: "CS301",
        courseName: "Data Structures",
        semester: 3,
        attendance: 82
    },
    {
        id: 602,
        studentName: "Meera Joshi",
        courseCode: "CS305",
        courseName: "Database Systems",
        semester: 3,
        attendance: 74
    },
    {
        id: 603,
        studentName: "Kabir Khan",
        courseCode: "CS310",
        courseName: "Computer Networks",
        semester: 3,
        attendance: 91
    }
];

// Generate Unique ID
let nextId = 604;

// Validate Request Body
function validateData(data) {
    const { studentName, courseCode, courseName, semester, attendance } = data;

    return (
        typeof studentName === 'string' &&
        studentName.trim() !== '' &&
        typeof courseCode === 'string' &&
        courseCode.trim() !== '' &&
        typeof courseName === 'string' &&
        courseName.trim() !== '' &&
        Number.isInteger(semester) &&
        semester > 0 &&
        typeof attendance === 'number' &&
        attendance >= 0 &&
        attendance <= 100
    );
}

// 1. GET All Enrollments
app.get('/api/enrollments', (req, res) => {
    res.status(200).json(enrollments);
});

// 2. POST New Enrollment
app.post('/api/enrollments', (req, res) => {
    if (!validateData(req.body)) {
        return res.status(400).json({
            message: "Invalid input data"
        });
    }

    const newEnrollment = {
        id: nextId++,
        ...req.body,
        studentName: req.body.studentName.trim(),
        courseCode: req.body.courseCode.trim(),
        courseName: req.body.courseName.trim()
    };

    enrollments.push(newEnrollment);

    res.status(201).json(newEnrollment);
});

// 3. Filter By Semester
app.get('/api/enrollments/filter', (req, res) => {
    const semester = Number(req.query.semester);

    if (!req.query.semester || !Number.isInteger(semester) || semester <= 0) {
        return res.status(400).json({
            message: "Please provide a valid semester"
        });
    }

    const result = enrollments.filter(
        e => e.semester === semester
    );

    res.status(200).json(result);
});

// 4. Low Attendance
app.get('/api/enrollments/low-attendance', (req, res) => {
    const result = enrollments.filter(
        e => e.attendance < 75
    );

    res.status(200).json(result);
});

// 5. GET Enrollment By ID
app.get('/api/enrollments/:id', (req, res) => {
    const id = Number(req.params.id);

    const enrollment = enrollments.find(
        e => e.id === id
    );

    if (!enrollment) {
        return res.status(404).json({
            message: "Enrollment not found"
        });
    }

    res.status(200).json(enrollment);
});

// 6. PUT Update Enrollment
app.put('/api/enrollments/:id', (req, res) => {
    const id = Number(req.params.id);

    const index = enrollments.findIndex(
        e => e.id === id
    );

    if (index === -1) {
        return res.status(404).json({
            message: "Enrollment not found"
        });
    }

    if (!validateData(req.body)) {
        return res.status(400).json({
            message: "Invalid input data"
        });
    }

    enrollments[index] = {
        id: id,
        ...req.body,
        studentName: req.body.studentName.trim(),
        courseCode: req.body.courseCode.trim(),
        courseName: req.body.courseName.trim()
    };

    res.status(200).json(enrollments[index]);
});

// 7. DELETE Enrollment
app.delete('/api/enrollments/:id', (req, res) => {
    const id = Number(req.params.id);

    const index = enrollments.findIndex(
        e => e.id === id
    );

    if (index === -1) {
        return res.status(404).json({
            message: "Enrollment not found"
        });
    }

    enrollments.splice(index, 1);

    res.status(200).json({
        message: "Enrollment deleted successfully"
    });
});

// Start Server
const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
