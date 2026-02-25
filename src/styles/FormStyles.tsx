import { StyleSheet } from 'react-native';

export const formStyles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#59a016',
  },
  input: {
    height: 50,
    width: '80%',
    marginVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    padding: 10,
    backgroundColor: '#fff',
  },
  rememberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderWidth: 2,
    borderColor: '#000',
    borderRadius: 4,
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#000',
  },
  checkmark: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  rememberText: {
    fontSize: 14,
    color: '#333',
  },
  button: {
    width: '80%',
    height: 50,
    marginVertical: 15,
    borderRadius: 8,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },

  socialLoginButton: {
    width: '100%',
    height: 50,
    marginVertical: 8,
    borderRadius: 8,
    backgroundColor: '#e6e6e6',
    boxShadow: '2px 5px 5px 2px rgba(0, 0, 0, 0.164)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  socialContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-end',
  },

  socialLoginButtonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '800',
  },

  socialButtonIcon: {
    width: 22,
    height: 22,
    marginRight: 10,
    resizeMode: 'contain',
  },

  bottomContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
  },

  linkText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
  },
});
