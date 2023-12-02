import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

const EmployerRegistrationForm = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        role: 'employer',
        companyName: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/signup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                console.log(data.message);
            } else {
                console.error(data.message);
            }
        } catch (error) {
            console.error('Error during registration:', error);
        }
    };

    return (
        <div className="loginform">
            <h2>Регистрация работодателя</h2>
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formUsername">
                    <Form.Label>Логин:</Form.Label>
                    <Form.Control
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                    />
                </Form.Group>

                <Form.Group controlId="formPassword">
                    <Form.Label>Пароль:</Form.Label>
                    <Form.Control
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </Form.Group>

                <Form.Group controlId="formCompanyName">
                    <Form.Label>Название компании:</Form.Label>
                    <Form.Control
                        type="text"
                        name="companyName"
                        value={formData.companyName}
                        onChange={handleChange}
                        required
                    />
                </Form.Group>

                <Button variant="primary" type="submit">
                    Зарегистрироваться
                </Button>
            </Form>
            <p>
                Уже есть аккаунт? <Link to="/" className='text-white'>Войти</Link>
            </p>
            <p>
                Вы соискатель? Зарегистрироваться{' '}
                <Link to="/signup">Зарегистрироваться</Link>
            </p>
        </div>
    );
};

export default EmployerRegistrationForm;
