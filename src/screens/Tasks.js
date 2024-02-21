import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Button,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {COLORS, SIZES} from '../constants';
import moment from 'moment';

export default function Tasks({navigation, route}) {
  const {tasks: initialTasks} = route.params;
  const [tasks, setTasks] = useState(initialTasks ?? []);
  const [sortedByDueDate, setSortedByDueDate] = useState(false);
  console.log('Taskssss: ', initialTasks);

  useEffect(() => {
    sortTasksByDueDate();
  }, []);

  const sortTasksByDueDate = () => {
    const sortedTasks = [...tasks].sort((a, b) => {
      return new Date(a.dueDate) - new Date(b.dueDate);
    });
    setTasks(sortedTasks);
    setSortedByDueDate(true);
  };

  const formatDueDate = dueDate => {
    const parsedDate = moment(dueDate);
    const formattedDate = parsedDate.format('ddd, MMM D YYYY');
    return formattedDate;
  };

  const toggleSortByDueDate = () => {
    if (sortedByDueDate) {
      setTasks([...tasks].reverse());
    } else {
      sortTasksByDueDate();
    }
    setSortedByDueDate(!sortedByDueDate);
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          paddingTop: SIZES.padding,
          paddingBottom: 10,
        }}>
        <Text
          style={{color: COLORS.black, fontSize: SIZES.h2, fontWeight: 'bold'}}>
          Your ToDo's
        </Text>
      </View>

      {initialTasks == null || initialTasks?.length == 0 ? (
        <View style={{alignItems: 'center', justifyContent: 'center'}}>
          <Text style={{color: COLORS.lightRed, fontWeight: 'bold'}}>
            No Tasks to View
          </Text>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={{flex: 1, paddingHorizontal: SIZES.padding}}>
          <Button
            title={
              sortedByDueDate
                ? 'Sort by Due Date (Oldest First)'
                : 'Sort by Due Date (Newest First)'
            }
            onPress={toggleSortByDueDate}
          />
          {tasks?.map((item, index) => {
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
                    elevation: 3,
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
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
