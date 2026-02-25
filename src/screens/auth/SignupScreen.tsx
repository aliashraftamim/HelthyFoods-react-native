import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { RootStackParamList } from '../../navigation/types';
import Auth from '../shared/Auth/Auth';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const SignupScreen = () => {
  const navigation = useNavigation<NavigationProp>();

  return (
    <Auth
      heading="Create Account"
      subHeading="Sign up to get started"
      fields={[
        { name: 'name', placeholder: 'Enter Your Full Name' },
        {
          name: 'email',
          placeholder: 'Enter Your Email Address',
          keyboardType: 'email-address',
        },
        {
          name: 'password',
          placeholder: 'Enter Your Password',
          secureTextEntry: true,
        },
        {
          name: 'confirmPassword',
          placeholder: 'Confirm Your Password',
          secureTextEntry: true,
        },
      ]}
      submitLabel="Sign Up"
      onSubmit={values => {
        navigation.navigate('Home');
        if (values.password !== values.confirmPassword) {
          console.log('Passwords do not match!');
          return;
        }
        console.log('Signup Submit →', values);
        // API call here
      }}
      onValuesChange={values => {
        console.log('Live Values →', values);
      }}
      footerText="Already have an account?"
      footerActionLabel="SignIn"
      onFooterAction={() => navigation.navigate('SignIn')}
    />
  );
};

export default SignupScreen;
