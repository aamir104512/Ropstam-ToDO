import React, {useState, useEffect} from 'react';
import {
  View,
  TextInput,
  Button,
  Switch,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {_retrieveObject, _setData} from '../utils/AsyncStorageHelper';
import {COLORS, SIZES} from '../constants';
import DateTimePicker from '@react-native-community/datetimepicker';

const TaskDetails = ({navigation, route}) => {
  const [task, setTask] = useState(null);
  const [editable, setEditable] = useState(false);
  const [editedTask, setEditedTask] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const {taskId} = route?.params;
    setLoading(true);
    fetchTask(taskId);
  }, []);

  const fetchTask = async taskId => {
    try {
      const tasks = await _retrieveObject('tasks');
      const task = tasks.find(t => t.id === taskId);
      setTask(task);
      setEditedTask({...task});
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error('Error fetching task:', error);
    }
  };

  const handleEditSave = () => {
    if (editable) {
      // Save edited task
      saveEditedTask();
    }
    setEditable(!editable);
  };

  const saveEditedTask = async () => {
    try {
      const tasks = await _retrieveObject('tasks');
      const updatedTasks = tasks.map(t => {
        if (t.id === editedTask.id) {
          return editedTask;
        }
        return t;
      });
      await _setData('tasks', updatedTasks);
    } catch (error) {
      console.error('Error saving edited task:', error);
    }
  };

  const markAsCompleted = async () => {
    try {
      const tasks = await _retrieveObject('tasks');
      const updatedTasks = tasks.map(t => {
        if (t.id === editedTask.id) {
          return {...t, completed: true};
        }
        return t;
      });
      await _setData('tasks', updatedTasks);
      navigation.goBack();
    } catch (error) {
      console.error('Error marking task as completed:', error);
    }
  };

  const deleteTask = async () => {
    try {
      const tasks = await _retrieveObject('tasks');
      const updatedTasks = tasks.filter(t => t.id !== editedTask.id);
      await _setData('tasks', updatedTasks);
      navigation.navigate('HomeScreen');
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || editedTask.dueDate;
    setShowDatePicker(false);
    setEditedTask({...editedTask, dueDate: currentDate});
  };

  const showDatepicker = () => {
    setShowDatePicker(true);
  };

  const handleInputChange = (value, field) => {
    setEditedTask({...editedTask, [field]: value});
  };

  if (loading) {
    return (
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <ActivityIndicator color={'blue'} size={'large'} />
      </View>
    );
  } else {
    return (
      <ScrollView style={styles.container}>
        {task && (
          <>
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text
                style={{
                  color: COLORS.black,
                  fontSize: SIZES.h2,
                  fontWeight: 'bold',
                }}>
                Task Details
              </Text>
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.inputTitle}>Task Title</Text>
              <TextInput
                style={[styles.input, !editable && styles.disabledInput]}
                placeholder="Enter Task Title"
                placeholderTextColor="#999"
                value={editedTask?.title}
                onChangeText={value => handleInputChange(value, 'title')}
                editable={editable}
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.inputTitle}>Due Date</Text>
              <TouchableOpacity
                disabled={!editable}
                style={[
                  styles.datePickerButton,
                  !editable && styles.disabledInput,
                ]}
                onPress={editable ? showDatepicker : null}>
                <Text style={styles.datePickerButtonText}>
                  {editable
                    ? editedTask?.dueDate &&
                      new Date(editedTask.dueDate).toDateString()
                    : task?.dueDate && new Date(task.dueDate).toDateString()}
                </Text>
              </TouchableOpacity>

              {showDatePicker && (
                <DateTimePicker
                  testID="dateTimePicker"
                  value={
                    editable
                      ? new Date(editedTask?.dueDate)
                      : new Date(task?.dueDate)
                  }
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
                style={[
                  styles.input,
                  styles.descriptionInput,
                  !editable && styles.disabledInput,
                ]}
                placeholder="Enter Description"
                placeholderTextColor="#999"
                value={editedTask?.description}
                onChangeText={value => handleInputChange(value, 'description')}
                textAlignVertical="top"
                multiline
                editable={editable}
              />
            </View>

            <TouchableOpacity style={styles.button} onPress={handleEditSave}>
              <Text style={styles.buttonText}>
                {editable ? 'Save' : 'Edit'}
              </Text>
            </TouchableOpacity>

            {!task.completed && (
              <TouchableOpacity
                style={[
                  styles.button,
                  {backgroundColor: COLORS.lightGreen, marginTop: 10},
                ]}
                onPress={markAsCompleted}>
                <Text style={styles.buttonText}>Mark as Completed</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={[
                styles.button,
                {backgroundColor: COLORS.lightRed, marginTop: 10},
              ]}
              onPress={() =>
                Alert.alert(
                  'Delete Task',
                  'Are you sure you want to delete this task?',
                  [
                    {
                      text: 'Cancel',
                      onPress: () => console.log('Cancel Pressed'),
                      style: 'cancel',
                    },
                    {text: 'Delete', onPress: deleteTask},
                  ],
                  {cancelable: true},
                )
              }>
              <Text style={styles.buttonText}>Delete Task</Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    );
  }
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
    color: COLORS.black,
    fontSize: SIZES.h4,
    fontWeight: 'bold',
  },
  input: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: COLORS.gray,
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
    color: COLORS.black,
  },
  button: {
    backgroundColor: COLORS.darkBlue,
    paddingVertical: 12,
    borderRadius: 4,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  datePickerButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: COLORS.gray,
    borderRadius: 5,
  },
  datePickerButtonText: {
    fontSize: 16,
    color: COLORS.black,
  },
  disabledInput: {
    backgroundColor: COLORS.lightGray3,
  },
});

export default TaskDetails;
