import { StyleSheet } from 'react-native';

export const authStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#f0f0f0',
  },
  heading: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
    color: '#111',
  },
  subHeading: {
    fontSize: 18,
    color: '#666',
    marginBottom: 24,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 24,
  },
  input: {
    borderWidth: 2,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 14,
    fontSize: 15,
    marginBottom: 16,
    color: '#111',
    backgroundColor: '#fff',
  },
  inputActive: {
    borderColor: '#000',
    borderWidth: 2,
    shadowColor: '#000',
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 3,
  },
  button: {
    backgroundColor: '#101010',
    borderRadius: 10,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  footerText: {
    color: '#666',
    fontSize: 14,
  },
  footerAction: {
    color: '#4F46E5',
    fontSize: 14,
    fontWeight: '600',
  },
});
