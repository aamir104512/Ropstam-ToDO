import React, {useState} from 'react';
import {
  View,
  TextInput,
  Button,
  Switch,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {_retrieveObject, _setData} from '../utils/AsyncStorageHelper';
import {COLORS, SIZES} from '../constants';
import DateTimePicker from '@react-native-community/datetimepicker';

const AddTask = ({navigation}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || dueDate;
    setShowDatePicker(false);
    setDueDate(currentDate);
  };

  const showDatepicker = () => {
    setShowDatePicker(true);
  };

  const saveTask = async () => {
    try {
      const newTask = {
        id: Date.now().toString(),
        title,
        dueDate,
        description,
        completed: false,
      };

      const existingTasks = (await _retrieveObject('tasks')) || [];
      existingTasks.unshift(newTask);

      await _setData('tasks', existingTasks);
      navigation.goBack();
    } catch (error) {
      console.error('Error saving task:', error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={{alignItems: 'center'}}>
        <Text
          style={{color: COLORS.black, fontSize: SIZES.h2, fontWeight: 'bold'}}>
          Add a Task
        </Text>
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.inputTitle}>Task Title</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Task Title"
          placeholderTextColor="#999"
          value={title}
          onChangeText={setTitle}
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.inputTitle}>Due Date</Text>
        <TouchableOpacity
          style={styles.datePickerButton}
          onPress={showDatepicker}>
          <Text style={styles.datePickerButtonText}>
            {dueDate.toDateString()}
          </Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            testID="dateTimePicker"
            value={dueDate}
            mode="date"
            is24Hour={true}
            display="default"
            onChange={handleDateChange}
          />
        )}
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.inputTitle}>Description</Text>
        <TextInput
          style={[styles.input, styles.descriptionInput]}
          placeholder="Enter Description"
          placeholderTextColor="#999"
          value={description}
          onChangeText={setDescription}
          textAlignVertical="top"
          multiline
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={saveTask}>
        <Text style={styles.buttonText}>Save Task</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  inputContainer: {
    marginBottom: 10,
  },
  inputTitle: {
    marginBottom: 5,
    color: '#333',
    fontSize: SIZES.h4,
    fontWeight: 'bold',
  },
  input: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    color: COLORS.black,
  },
  descriptionInput: {
    height: 100,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  reminderText: {
    color: '#333',
  },
  button: {
    backgroundColor: COLORS.darkBlue,
    paddingVertical: 12,
    borderRadius: 4,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  datePickerButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  datePickerButtonText: {
    fontSize: 16,
    color: '#333',
  },
});

export default AddTask;
