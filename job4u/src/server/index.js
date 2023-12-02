const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const saltRounds = 10;
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cookieParser());
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());

app.get('/users', async (req, res) => {
    const users = await prisma.users.findMany();
    res.json(users);
});

app.get('/users/:id', async (req, res) => {
    const userId = parseInt(req.params.id, 10);

    try {
        const user = await prisma.users.findUnique({
            where: {
                id: userId,
            },
        });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await prisma.users.findUnique({
            where: {
                username,
            },
        });

        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        const passwordMatch = await comparePasswords(password, user.password);
        if (passwordMatch) {
            const token = jwt.sign({ userId: user.id, email: user.email, role: user.role }, `${process.env.REACT_APP_SECRET_TOKEN}`, { expiresIn: '1h' });
            res.cookie('token', token, {
                httpOnly: true,
                maxAge: 3600000,
            });
            return res.status(200).json({ message: 'Login successful', user });
        } else {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

app.get('/getrole', (req, res) => {
    try {
        const token = req.cookies.token;
        // eslint-disable-next-line no-unused-vars
        const userRole = getUserRoleFromToken(token);
        const uidofuser = getUserFromToken(token);
        return res.json({ role: userRole, uid: uidofuser.userId })
    } catch (error) {
        console.log(error)
        return 'not found'
    }
});

app.get('/checktoken', (req, res) => {
    const token = req.cookies.token;
    console.log(token)
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    jwt.verify(token, `${process.env.REACT_APP_SECRET_TOKEN}`, (err) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid token' });
        }
        res.json({ message: 'Protected route' });
    });
});

app.post('/vacancies', async (req, res) => {
    try {
        const { title, description, englishLevel, grades, tags } = req.body;
        const token = req.cookies.token;
        const userRole = getUserRoleFromToken(token);
        const user = getUserFromToken(token);
        console.log(user)

        if (userRole !== 'employer') {
            return res.status(403).json({ message: 'Unauthorized. Only employers can create vacancies.' });
        }

        const newVacancy = await prisma.vacancies.create({
            data: {
                title: title,
                description: description,
                status: 'open', // open, closed, Filled
                englishLevel: englishLevel,
                grades: grades,
                tags: tags,
                employer_id: user.userId,
            },
        });

        return res.status(201).json({ message: 'Vacancy created successfully', vacancy: newVacancy });
    } catch (error) {
        console.error('Error during vacancy creation:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

app.get('/vacancies', async (req, res) => {
    try {
        const vacanciesWithEmployer = await prisma.vacancies.findMany({
            where: {
                status: 'open',
            },
            include: {
                users: {
                    include: {
                        employer_profiles: {
                            select: {
                                company_name: true,
                            },
                        },
                    },
                },
            },

        });

        const openVacancies = vacanciesWithEmployer.map((vacancy) => ({
            id: vacancy.id,
            title: vacancy.title,
            description: vacancy.description,
            status: vacancy.status,
            employer_id: vacancy.employer_id,
            companyName: vacancy.users?.employer_profiles.map((profile) => profile.company_name),
            tags: vacancy.tags,
            grades: vacancy.grades,
            englishLevel: vacancy.englishLevel,
            applicants: vacancy.applicants,
        }));

        res.status(200).json(openVacancies);
    } catch (error) {
        console.error('Error retrieving open vacancies:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

app.put('/vacancies/:vacancyId', async (req, res) => {
    const { vacancyId } = req.params;
    const { applicantProfileId } = req.body;

    try {
        const vacancy = await prisma.vacancies.findUnique({
            where: { id: parseInt(vacancyId) },
        });

        if (!vacancy) {
            return res.status(404).json({ error: 'Vacancy not found' });
        }

        const applicants = vacancy.applicants || [];

        if (applicants.includes(applicantProfileId)) {
            // If the applicant is already in the list, remove them (cancel the application)
            const updatedVacancy = await prisma.vacancies.update({
                where: { id: parseInt(vacancyId) },
                data: {
                    applicants: {
                        set: applicants.filter(id => id !== applicantProfileId),
                    },
                },
            });

            return res.json(updatedVacancy);
        } else {
            // If the applicant is not in the list, add them (apply for the vacancy)
            const updatedVacancy = await prisma.vacancies.update({
                where: { id: parseInt(vacancyId) },
                data: {
                    applicants: {
                        push: applicantProfileId,
                    },
                },
            });

            return res.json(updatedVacancy);
        }

    } catch (error) {
        console.error('Error applying to/canceling vacancy:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


app.get('/my-vacancies', async (req, res) => {
    try {
        const token = req.cookies.token;
        const jwtObject = getUserFromToken(token);

        const userId = jwtObject.userId;

        // Retrieve the vacancies associated with the employer (user)
        const employerVacancies = await prisma.vacancies.findMany({
            where: {
                employer_id: userId,
            },
        });

        res.status(200).json(employerVacancies);
    } catch (error) {
        console.error('Error retrieving employer vacancies:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

app.get('/applied-vacancies', async (req, res) => {
    try {
        const token = req.cookies.token;
        const jwtObject = getUserFromToken(token);

        const userId = jwtObject.userId;

        // Retrieve the vacancies that the user has applied to
        const userAppliedVacancies = await prisma.vacancies.findMany({
            where: {
                applicants: {
                    has: parseInt(userId),
                },
            },
        });
        console.log(userAppliedVacancies)

        res.status(200).json(userAppliedVacancies);
    } catch (error) {
        console.error('Error retrieving user applied vacancies:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});


app.post('/signup', async (req, res) => {
    try {
        const { username, password, role, companyName } = req.body;

        // Check if the username already exists
        const existingUser = await prisma.users.findUnique({
            where: {
                username: username,
            },
        });

        if (existingUser) {
            return res.status(400).json({ message: 'User with this username already exists' });
        }

        // Hash the password
        const hashedPassword = await hashPassword(password);

        // Create a new user
        const newUser = await prisma.users.create({
            data: {
                username: username,
                password: hashedPassword,
                role: role,
                ...(role === 'employer' ? { employer_profiles: { create: { company_name: companyName } } } : {}),
            },
            include: {
                employer_profiles: true, // Include employer_profiles in the response
            },
        });

        return res.status(201).json({ message: 'User registered successfully', user: newUser });
    } catch (error) {
        console.error('Error during signup:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

app.delete('/vacancies/:id', async (req, res) => {
    try {
      const vacancyId = parseInt(req.params.id, 10);
  
      // Проверка, существует ли вакансия с указанным id
      const existingVacancy = await prisma.vacancies.findUnique({
        where: {
          id: vacancyId,
        },
      });
  
      if (!existingVacancy) {
        return res.status(404).json({ message: 'Vacancy not found' });
      }
  
      // Удаление вакансии
      await prisma.vacancies.delete({
        where: {
          id: vacancyId,
        },
      });
  
      res.status(200).json({ message: 'Vacancy deleted successfully' });
    } catch (error) {
      console.error('Error deleting vacancy:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });



async function comparePasswords(plainPassword, hashedPassword) {
    return bcrypt.compare(plainPassword, hashedPassword);
}

async function hashPassword(password) {
    return bcrypt.hash(password, saltRounds);
}

//TODO избавится от этой функции
function getUserRoleFromToken(token) {
    const [header, payload, signature] = token.split('.');
    const decodedPayload = Buffer.from(payload, 'base64').toString('utf-8');
    const jwtObject = JSON.parse(decodedPayload);
    return jwtObject.role;
}

function getUserFromToken(token) {
    const [header, payload, signature] = token.split('.');
    const decodedPayload = Buffer.from(payload, 'base64').toString('utf-8');
    const jwtObject = JSON.parse(decodedPayload);
    return jwtObject;
}



app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});
