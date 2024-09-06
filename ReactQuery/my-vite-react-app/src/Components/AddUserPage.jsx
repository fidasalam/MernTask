import React,{useState} from 'react';
import axios from 'axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { showNotification } from './utils/notifications';
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

function AddUserPage() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState(''); 
  // Define the validation schema using Yup
  const validationSchema = Yup.object({
    name: Yup.string().required('Name is required'),
    email: Yup.string().email('Invalid email address').required('Email is required'),
    phoneNumber: Yup.string()
      .required('Phone number is required')
      .matches(/^[0-9]{10}$/, 'Phone number must be exactly 10 digits'),
    password: Yup.string()
      .min(5, 'Password must be at least 5 characters')
      .required('Password is required'),
  });

  // Define the mutation function
  const mutation = useMutation({
    mutationFn: async (newUser) => {
      const response = await axios.post('http://localhost:3000/api/users', newUser);
      const { user } = response.data;
      localStorage.setItem('userId', user.id);
      return response.data;
    },
    onSuccess: () => {
      setSuccessMessage('User added successfully!');
      
      // showNotification('User added successfully!');
      queryClient.invalidateQueries({ queryKey: ['users'] });
      navigate('/'); // Redirect to the home page
    },
    onError: (error) => {
      // Extract the error message from the response
      const message = error.response?.data?.message || error.message;
      setErrorMessage(message); // Set the error message
    },
  });

  return (
    <div>
      <h2>Sign Up</h2>
      <Formik
        initialValues={{
          name: '',
          email: '',
          phoneNumber: '',
          password: '',
        }}
        validationSchema={validationSchema}
        validateOnChange={true} // Validate on change
        validateOnBlur={true} // Validate on blur
        onSubmit={(values, { setSubmitting, resetForm }) => {
          mutation.mutate(values); // Trigger the mutation with form values
          setSubmitting(false);
          resetForm(); // Clear form on success
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <div>
              <label htmlFor="name">Name:</label>
              <Field type="text" name="name" autoFocus />
              <ErrorMessage name="name" component={ErrorText} />
            </div>
            <div>
              <label htmlFor="email">Email:</label>
              <Field type="email" name="email" />
              <ErrorMessage name="email" component={ErrorText} />
            </div>
            <div>
              <label htmlFor="phoneNumber">Phone Number:</label>
              <Field type="text" name="phoneNumber" />
              <ErrorMessage name="phoneNumber" component={ErrorText} />
            </div>
            <div>
              <label htmlFor="password">Password:</label>
              <Field type="password" name="password" />
              <ErrorMessage name="password" component={ErrorText} />
            </div>
            <button type="submit" disabled={isSubmitting || mutation.isLoading}>
              {isSubmitting || mutation.isLoading ? 'Adding user...' : 'Add User'}
            </button>
            <MessageContainer>
            {errorMessage &&  <ErrorText> {errorMessage}</ErrorText>}
            {successMessage && <SuccessText>User added successfully!</SuccessText>}
            </MessageContainer>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default AddUserPage;
