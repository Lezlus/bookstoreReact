import { useState } from "react";
import AuthService from "../../services/authService";
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import '../../css/loginRegisterPage.css';
import { Link, useNavigate } from "react-router-dom";
import { UserRegisterType } from '../../types';
import { sleep } from '../utility/sleep';
import Alert from 'react-bootstrap/Alert'

interface RegisterUserFormElements extends HTMLFormControlsCollection {
  firstName: HTMLInputElement;
  lastName: HTMLInputElement;
  username: HTMLInputElement;
  password: HTMLInputElement;
}

interface RegisterUserFormElement extends HTMLFormElement {
  readonly elements: RegisterUserFormElements
}


const RegisterPage = () => {
  const [registerFormValid, setRegisterFormValid] = useState<boolean>(false);
  const [usernameTaken, setUsernameTaken] = useState<boolean>(false);
  const [showAlert, setShowAlert] = useState<boolean>(false);

  let navigate = useNavigate();

  const onRegisterSubmit = async (e: React.FormEvent<RegisterUserFormElement>) => {
    const form = e.currentTarget;
    e.preventDefault();
    e.stopPropagation();
    if (form.checkValidity()) {
      let newUser: UserRegisterType = {
        first_name: form.elements.firstName.value,
        last_name: form.elements.lastName.value,
        username: form.elements.username.value,
        password: form.elements.password.value
      }
      
      let res = await AuthService.register(newUser);
      if (res.message.userTaken) {
        setUsernameTaken(true);
      }
      setShowAlert(true);
      if (!res.message.userTaken) {
        await sleep(1000);
        navigate('/login');
      }
    }
    setRegisterFormValid(true);
  }

  return (
    <div className='auth-form-container'>
      <div className='container'>
        <div className='auth-form'>
          <h2>Register</h2>
          <section className='login-form-wrapper'>
            <Form onSubmit={onRegisterSubmit} noValidate validated={registerFormValid} className='row g-3'>
              <Form.Group className='mb-3 col-12' controlId='formAuthFirstName'>
                <Form.Label>First Name</Form.Label>
                <Form.Control 
                  type='text'
                  required
                  name='firstName'
                  placeholder='First Name'
                />
                <Form.Control.Feedback type='invalid'>Please fill out field</Form.Control.Feedback>
              </Form.Group>
              <Form.Group className='mb-3 col-12' controlId='formAuthLastName'>
                <Form.Label>Last Name</Form.Label>
                <Form.Control 
                  type='text'
                  required
                  name='lastName'
                  placeholder='Last Name'
                />
                <Form.Control.Feedback type='invalid'>Please fill out field</Form.Control.Feedback>
              </Form.Group>
              <Form.Group className='mb-3 col-12' controlId="formAuthUsername">
                <Form.Label>Username</Form.Label>
                <Form.Control 
                  type='text'
                  required 
                  name="username" 
                  placeholder='Username' 
                />
                <Form.Control.Feedback type='invalid'>Please fill out field</Form.Control.Feedback>
              </Form.Group>
              <Form.Group className='mb-3 col-12' controlId='formAuthPassword'>
                <Form.Label>Password</Form.Label>
                <Form.Control 
                  type='password' 
                  name='password' 
                  placeholder='Password' 
                  required
                  />
                <Form.Control.Feedback type='invalid'>Please fill out field</Form.Control.Feedback>
              </Form.Group>
              <Form.Group className='col-md-3 '>
                <Button type='submit' variant="primary">Create account</Button>
              </Form.Group>
              <Link to='/login'>Have an account? Login here</Link>
            </Form>
            <Alert show={showAlert} variant={usernameTaken ? 'danger' : 'success'}>
              <Alert.Heading>{usernameTaken ? 'Username Taken': 'Account Created'}</Alert.Heading>
            </Alert>
          </section>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage;