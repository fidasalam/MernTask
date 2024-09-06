import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { setUser } from '../store/slice/authSlice';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import styled from 'styled-components';

// Styled Components for messages
const MessageContainer = styled.div`
  margin-top: 15px;
  text-align: center;
`;

const ErrorText = styled.div`
  color: #e74c3c;
  font-size: 14px;
  margin-top: 10px;
`;

const SuccessText = styled.p`
  color: #2ecc71;
  font-size: 16px;
  margin-top: 10px;
`;

const StyledInput = styled(Field)`
  width: 100%;
  padding: 8px;
  margin: 5px 0;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const StyledButton = styled.button`
  padding: 10px 15px;
  color: #fff;
  background-color: #3498db;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  &:disabled {
    background-color: #bdc3c7;
    cursor: not-allowed;
  }
`;

const OtherPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loginError, setLoginError] = useState('');

  // Get user ID from local storage
  const userId = localStorage.getItem('userId');

  // Define the query function
  const fetchUserById = async (id) => {
    const response = await axios.get(`http://localhost:3000/api/users/${id}`);
    return response.data;
  };

  // Use React Query to fetch user data
  const { data: user, error: userError, refetch } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUserById(userId),
    enabled: !!userId, // Only run the query if userId exists
  });

  // Define the validation schema using Yup
  const validationSchema = Yup.object({
    name: Yup.string().required('Name is required'),
    password: Yup.string().min(5, 'Password must be at least 5 characters').required('Password is required'),
  });

  // Define the mutation function
  const loginMutation = useMutation({
    mutationFn: async (credentials) => {
      const response = await axios.post('http://localhost:3000/api/login', credentials);
      return response.data;
    },
    onSuccess: async (data) => {
      if (data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('userId', data.id); // Store userId in localStorage

        // Refetch user data
        refetch();

        dispatch(setUser({ name: data.name, token: data.token }));
        navigate('/'); // Redirect to the home page or another page
      }
      setLoginError('');
    },
    onError: (error) => {
      const message = error.response?.data?.message || error.message;
      setLoginError(message);
    },
  });

  return (
    <div>
      <h2>Login Page</h2>
      <Formik
        initialValues={{ name: user?.name || '', password: '' }}
        validationSchema={validationSchema}
        enableReinitialize={true} // Enable reinitialization
        onSubmit={(values, { setSubmitting }) => {
          loginMutation.mutate(values); // Trigger the mutation with form values
          setSubmitting(false);
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <div>
              <label htmlFor="name">Name:</label>
              <StyledInput type="text" name="name" />
              <ErrorMessage name="name" component={ErrorText} />
            </div>
            <div>
              <label htmlFor="password">Password:</label>
              <StyledInput type="password" name="password" />
              <ErrorMessage name="password" component={ErrorText} />
            </div>
            <StyledButton type="submit" disabled={isSubmitting || loginMutation.isLoading}>
              {isSubmitting || loginMutation.isLoading ? 'Logging in...' : 'Login'}
            </StyledButton>
            <MessageContainer>
              {loginError && <ErrorText>{loginError}</ErrorText>}
              {userError && <ErrorText>{userError.message}</ErrorText>}
            </MessageContainer>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default OtherPage;
