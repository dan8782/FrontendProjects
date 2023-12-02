import { Link } from 'react-router-dom';
import { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import InputGroup from 'react-bootstrap/InputGroup';

function SignupApplicantForm() {
  const [validated, setValidated] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.stopPropagation();
    } else {
      try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/signup`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...formData,
            role: 'applicant', // добавляем роль соискателя
          }),
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
    }

    setValidated(true);
  };

  return (
    <div className="loginform">
      <h2>Регистрация соискателя работы</h2>
      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <Form.Group as={Col} md="12" controlId="validationCustomUsername">
          <Form.Label>Логин:</Form.Label>
          <InputGroup hasValidation>
            <InputGroup.Text id="inputGroupPrepend">@</InputGroup.Text>
            <Form.Control
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Логин"
              aria-describedby="inputGroupPrepend"
              required
            />
            <Form.Control.Feedback type="invalid">
              Пожалуйста, выберите логин.
            </Form.Control.Feedback>
          </InputGroup>
        </Form.Group>
        <Form.Group as={Col} md="12" controlId="validationCustomPassword">
          <Form.Label>Пароль:</Form.Label>
          <Form.Control
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Пароль"
            required
          />
          <Form.Control.Feedback type="invalid">
            Пожалуйста, введите пароль.
          </Form.Control.Feedback>
        </Form.Group>
        <Button type="submit">Зарегистрироваться</Button>
      </Form>
      <p>
        Уже есть аккаунт? <Link to="/" className='text-white'>Войти</Link>
      </p>
      <p>
        Вы работодатель? {' '}
        <Link to="/signupEmployer" className='text-white'>Зарегистрироваться</Link>
      </p>
    </div>
  );
}

export default SignupApplicantForm;
