import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Button, Col, Row } from 'react-bootstrap';
import InputGroup from 'react-bootstrap/InputGroup';
import ModalPass from './modal';
import authProvider from '../../AuthProvider';
import './login.css';

function Auth() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [show, setShow] = useState(false);
    const [validated, setValidated] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const form = e.currentTarget;

        if (form.checkValidity() === false) {
            e.stopPropagation();
        } else {
            let a = await authProvider.signin(email, password);

            if (a) {
                console.log(authProvider.role);
                navigate("/vacancies");
            } else {
                handleShow();
            }
        }

        setValidated(true);
    };

    return (
        <div className="loginform">
            <ModalPass show={show} handleClose={handleClose}></ModalPass>
            <h2>Вход</h2>
            <Form noValidate validated={validated} onSubmit={handleSubmit}>
                <Row className="mb-3">
                    <Form.Group as={Col} controlId="validationCustomUsername">
                        <InputGroup hasValidation>
                            <Form.Control
                                type="email"
                                placeholder="Email"
                                aria-describedby="inputGroupPrepend"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <Form.Control.Feedback type="invalid">
                                Напишите валидный емейл
                            </Form.Control.Feedback>
                        </InputGroup>
                    </Form.Group>
                </Row>

                <Row className="mb-3">
                    <Form.Group as={Col} controlId="validationCustomPassword">
                        <Form.Control
                            type="password"
                            placeholder="Password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <Form.Control.Feedback type="invalid">
                            Напишите пароль
                        </Form.Control.Feedback>
                    </Form.Group>
                </Row>

                <Form.Group className="mb-3">
                    <Form.Check
                        required
                        label="Agree to terms and conditions"
                        feedback="You must agree before submitting."
                        feedbackType="invalid"
                    />
                </Form.Group>

                <div className="d-flex justify-content-center mb-3">
                    <Button type="submit" className='button__login border'>Вход</Button>
                </div>
            </Form>
            <p>
                Нет аккаунта? <Link to="/signup" className='text-white'>Зарегистрироваться</Link>
            </p>
        </div>
    );
}

export default Auth;
