import {
  View,
  Text,
  SafeAreaView,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {COLORS, SIZES} from '../constants';
import TasksButton from '../components/TasksButton';
import {
  _clearData,
  _retrieveData,
  _retrieveObject,
} from '../utils/AsyncStorageHelper';
import {useIsFocused} from '@react-navigation/native';
import moment from 'moment';

export default function HomeScreen({navigation, route}) {
  const focused = useIsFocused();
  const [allTasks, setAllTasks] = useState([]);
  const [incompleteTasks, setIncompleteTasks] = useState([]);
  const [completed, setCompleted] = useState([]);

  const [name, setName] = useState(null);

  const getName = async () => {
    try {
      // Retrieve name from AsyncStorage
      const name = await _retrieveObject('name');
      setName(name);
    } catch (error) {
      console.error('Error retrieving name:', error);
      return [];
    }
  };

  const getAllTasks = async () => {
    try {
      // Retrieve tasks from AsyncStorage
      const tasks = await _retrieveObject('tasks');
      const incomplete = tasks?.filter(item => item?.completed == false);
      const complete = tasks?.filter(item => item?.completed == true);
      setIncompleteTasks(incomplete);
      setCompleted(complete);
      setAllTasks(tasks);
    } catch (error) {
      console.error('Error retrieving tasks:', error);
      return [];
    }
  };

  useEffect(() => {
    getName();
    getAllTasks();
  }, [focused]);

  const formatDueDate = dueDate => {
    const parsedDate = moment(dueDate);

    const formattedDate = parsedDate.format('ddd, MMM D YYYY');

    return formattedDate;
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      {/* Header Section */}
      <View
        style={{
          margin: SIZES.padding,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <View
            style={{
              height: 60,
              width: 60,
              borderWidth: 1,
              borderRadius: 50,
              alignItems: 'center',
              justifyContent: 'center',
              borderColor: COLORS.lightGray,
            }}>
            <Image
              source={require('../assets/icons/User.png')}
              resizeMode="contain"
              style={{height: 40, width: 40}}
            />
          </View>

          <View style={{paddingLeft: SIZES.base}}>
            <Text
              style={{
                color: COLORS.black,
                fontSize: SIZES.h3,
                fontWeight: 'bold',
              }}>
              Hi, {name}
            </Text>
            <Text
              style={{
                color: COLORS.gray,
                fontSize: SIZES.h4,
              }}>
              Your daily adventure starts now
            </Text>
          </View>
        </View>

        <TouchableOpacity
          onPress={() => {
            Alert.alert(
              'Logout',
              'Are you sure you want to logout?',
              [
                {
                  text: 'Cancel',
                  style: 'cancel',
                },
                {
                  text: 'OK',
                  onPress: async () => {
                    await _clearData();
                    navigation.replace('Welcome');
                  },
                },
              ],
              {cancelable: true},
            );
          }}>
          <Image
            source={require('../assets/icons/logout.png')}
            resizeMode="contain"
            style={{height: 40, width: 40}}
          />
        </TouchableOpacity>
      </View>

      <ScrollView>
        {/* Task Buttons */}
        <TasksButton
          Icon={require('../assets/icons/AllTasks.png')}
          BackgroundColor={COLORS.allTasks}
          IconColor={COLORS.iconBlue}
          Title={'All Tasks'}
          Tasks={`${allTasks?.length ?? 0} tasks`}
          onPress={() => navigation.navigate('Tasks', {tasks: allTasks})}
        />
        <View style={{marginTop: 10}}>
          <TasksButton
            Icon={require('../assets/icons/IncompleteTasks.png')}
            BackgroundColor={COLORS.incomplete}
            IconColor={COLORS.iconYellow}
            Title={'Incomplete Tasks'}
            Tasks={`${incompleteTasks?.length ?? 0} tasks`}
            onPress={() =>
              navigation.navigate('Tasks', {tasks: incompleteTasks})
            }
          />
        </View>
        <View style={{marginTop: 10}}>
          <TasksButton
            Icon={require('../assets/icons/Completed.png')}
            BackgroundColor={COLORS.complete}
            IconColor={COLORS.iconGreen}
            Title={'Completed Tasks'}
            Tasks={`${completed?.length ?? 0} tasks`}
            onPress={() => navigation.navigate('Tasks', {tasks: completed})}
          />
        </View>

        {/* Recent Tasks */}
        {allTasks?.length > 0 && (
          <>
            <View style={{padding: SIZES.padding}}>
              <Text
                style={{
                  color: COLORS.black,
                  fontSize: SIZES.h3,
                  fontWeight: 'bold',
                }}>
                Recent Tasks
              </Text>

              {allTasks?.slice(0, 4).map((item, index) => {
                return (
                  <View style={{marginTop: 10}} key={item?.id}>
                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate('TaskDetails', {taskId: item?.id})
                      }
                      style={{
                        padding: SIZES.radius,
                        backgroundColor: 'white',
                        borderRadius: SIZES.radius,
                        flexDirection: 'row',
                        alignItems: 'center',
                        borderWidth: 1,
                        borderColor: COLORS.lightGray,
                      }}>
                      <View style={{flex: 1}}>
                        <Text
                          style={{
                            color: COLORS.black,
                            fontSize: SIZES.h3,
                            fontWeight: 'bold',
                          }}>
                          {item?.title}
                        </Text>
                        <Text
                          style={{color: COLORS.black, fontSize: SIZES.h4}}
                          numberOfLines={1}>
                          {item?.description}
                        </Text>
                        <Text
                          style={{
                            color: COLORS.lightRed,
                            fontSize: SIZES.body4,
                            marginTop: 5,
                          }}>
                          Due Date: {formatDueDate(item?.dueDate)}
                        </Text>
                        <Text
                          style={{
                            color: item.completed
                              ? COLORS.lightGreen
                              : COLORS.lightRed,
                            fontSize: SIZES.body4,
                            marginTop: 5,
                            fontWeight: 'bold',
                          }}>
                          Status: {item.completed ? 'Completed' : 'Incomplete'}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                );
              })}
            </View>
          </>
        )}
      </ScrollView>

      <TouchableOpacity
        onPress={() => navigation.navigate('AddTask')}
        style={{
          width: 60,
          height: 60,
          backgroundColor: '#007bff',
          borderRadius: 30,
          justifyContent: 'center',
          alignItems: 'center',
          position: 'absolute',
          bottom: 20,
          right: 20,
          elevation: 5,
          shadowColor: '#000',
          shadowOffset: {width: 0, height: 2},
          shadowOpacity: 0.5,
          shadowRadius: 3,
        }}>
        <Text style={{fontSize: 24, color: '#fff', fontWeight: 'bold'}}>+</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
