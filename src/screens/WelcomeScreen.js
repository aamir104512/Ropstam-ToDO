import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {_setData} from '../utils/AsyncStorageHelper';

const WelcomeScreen = ({navigation}) => {
  const [name, setName] = useState('');

  const handleNext = async () => {
    console.log('Next button pressed: ', name);
    await _setData('name', name);
    navigation.replace('HomeScreen', {name: name});
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Ropstam ToDo</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your name to continue"
        placeholderTextColor="#aaa"
        value={name}
        onChangeText={setName}
      />
      <TouchableOpacity
        style={[styles.button, {backgroundColor: name ? '#007bff' : 'grey'}]}
        onPress={handleNext}
        disabled={!name}>
        <Text style={styles.buttonText}>Next</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
    color: 'black',
  },
  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 20,
    fontSize: 16,
    color: '#333',
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#007bff',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
});

export default WelcomeScreen;
