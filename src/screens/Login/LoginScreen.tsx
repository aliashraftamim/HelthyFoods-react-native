import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { RootStackParamList } from '../../navigation/types';
import { formStyles } from '../../styles/FormStyles';
import Auth from '../shared/Auth/Auth';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const LoginScreen = () => {
  const [remember, setRemember] = useState(false);
  const navigation = useNavigation<NavigationProp>();

  // inputs আর submit button এর মাঝে যা দেখাবে
  const rememberAndForgot = (
    <View style={formStyles.bottomContainer}>
      <View style={formStyles.rememberContainer}>
        <TouchableOpacity
          style={[formStyles.checkbox, remember && formStyles.checkboxChecked]}
          onPress={() => setRemember(!remember)}
        >
          {remember && <Text style={formStyles.checkmark}>✓</Text>}
        </TouchableOpacity>
        <Text style={formStyles.rememberText}>Keep me signed in</Text>
      </View>

      <Text
        style={formStyles.linkText}
        onPress={() => navigation.navigate('ForgotPassword')}
      >
        Forgot Password
      </Text>
    </View>
  );

  // submit button এর নিচে social login section
  const socialLogin = (
    <>
      <View style={{ alignItems: 'center', marginVertical: 16 }}>
        <Text>---------------- or Continue with ----------------</Text>
      </View>
      <View style={{ width: '100%', alignItems: 'center' }}>
        <TouchableOpacity
          style={formStyles.socialLoginButton}
          onPress={() => console.log('Google pressed')}
        >
          <Text style={formStyles.socialLoginButtonText}>Google</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={formStyles.socialLoginButton}
          onPress={() => console.log('Apple pressed')}
        >
          <Text style={formStyles.socialLoginButtonText}>Apple</Text>
        </TouchableOpacity>
      </View>
    </>
  );

  return (
    <Auth
      heading="Welcome Back"
      subHeading="Login to your account"
      fields={[
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
      ]}
      submitLabel="Submit"
      onSubmit={values => {
        console.log('Login Submit →', values);
        // API call here
      }}
      onValuesChange={values => {
        console.log('Live Values →', values); // 👈 console এ real-time দেখবে
      }}
      middleContent={rememberAndForgot} // 👈 remember me + forgot password
      bottomContent={socialLogin} // 👈 social login buttons
      footerText="Don't have an account?"
      footerActionLabel="Sign Up"
      onFooterAction={() => navigation.navigate('Signup')}
    />
  );
};

export default LoginScreen;
