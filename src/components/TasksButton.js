import {View, Text, TouchableOpacity, Image} from 'react-native';
import React from 'react';
import {COLORS, SIZES} from '../constants';

export default function TasksButton({
  Title,
  Tasks,
  Icon,
  BackgroundColor,
  IconColor,
  onPress,
}) {
  return (
    <View style={{paddingHorizontal: SIZES.padding}}>
      <TouchableOpacity
        onPress={onPress}
        style={{
          padding: SIZES.radius,
          backgroundColor: BackgroundColor,
          borderRadius: SIZES.radius,
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <View
          style={{
            height: 45,
            width: 45,
            borderRadius: 50,
            backgroundColor: IconColor,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Image
            source={Icon}
            resizeMode="contain"
            style={{height: 15, width: 15, tintColor: 'white'}}
          />
        </View>

        <View style={{paddingLeft: SIZES.radius}}>
          <Text
            style={{
              color: COLORS.black,
              fontSize: SIZES.h3,
              fontWeight: 'bold',
            }}>
            {Title}
          </Text>
          <Text style={{color: COLORS.black, fontSize: SIZES.h4}}>{Tasks}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}
