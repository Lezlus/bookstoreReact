import { useState } from "react";
import AuthService from "../../services/authService";
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import '../../css/loginRegisterPage.css';
import { UserLoginType } from "../../types";
import Alert from 'react-bootstrap/Alert';
import { Link, useNavigate } from 'react-router-dom';

interface LoginUserFormElements extends HTMLFormControlsCollection {
  username: HTMLInputElement
  password: HTMLInputElement
}

interface LoginUserFormElement extends HTMLFormElement {
  readonly elements: LoginUserFormElements
}

const LoginPage = () => {
  const [loginFormValid, setLoginFormValid] = useState<boolean>(false)
  const [userInValid, setUserInValid] = useState<boolean>(false);
  let navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const { mutate } = useMutation((user: UserLoginType) => {
    return AuthService.login(user)
  }, {
    onSuccess: (result) => {
      setUserInValid(false)
      console.log(result);
      queryClient.invalidateQueries(['user']);
      navigate('/')
    },
    onError: (error) => {
      setUserInValid(true);
    }
  })

  const onLoginChange = (e: React.FormEvent<LoginUserFormElement>) => {
    const form = e.currentTarget
    e.preventDefault();
    e.stopPropagation();
    if (form.checkValidity()) {
      let userCredentials: UserLoginType = {
        username: e.currentTarget.elements.username.value, 
        password: e.currentTarget.elements.password.value
      }
      mutate(userCredentials);
    }
    setLoginFormValid(true);
  }

  return (
    <div className='auth-form-container'>
      <div className='container'>
        <div className='auth-form'>
          <h2>Login</h2>
          <section className='login-form-wrapper'>
            <Form noValidate validated={loginFormValid} className='row g-3' onSubmit={onLoginChange}>
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
                <Button type='submit' variant="primary">Sign in</Button>
              </Form.Group>
              <Link to='/register'>Don't have an account? Register here</Link>
            </Form>
            <Alert show={userInValid} variant='danger' transition>
              Your username or password are incorrect
            </Alert>
          </section>
        </div>
      </div>
    </div>
  )
}

export default LoginPage