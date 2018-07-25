import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

import Svg,{
    Path,
} from 'react-native-svg';

export default class CircleGraph extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    render() {
        let size = this.props.size;
        if (!size)
            size = 58;
        let diameter = size - 4;
        let circumference = 3.14159 * diameter;
        let radius = diameter / 2;
        let M = size / 2,
        level = this.props.level ? this.props.level : '0',
        color = 'rgba(51, 82, 103, 1)';
        switch (level.split('.')[0]) {
            case 'A1':
                color = '#F39421';
            break;
            case 'A2':
                color = '#E0761E';
            break;
            case 'B1':
                color = '#5B9BD5';
            break;
            case 'B2':
                color = '#3C6EC8';
            break;
            case 'C1':
                color = '#92D050';
            break;
            case 'C2':
                color = '#70AD47';
            break;
        }
        return (
            <View style={{
                justifyContent: 'center',
                alignItems: 'center',
            }}>
                <Svg width={size} height={size} viewbox={ "0 0 " + size + " " + size }>
                    <Path
                        stroke="#D8D8D8"
                        fill="none"
                        strokeWidth = "5"
                        strokeLinecap="round"
                        strokeDasharray={ circumference + ", " + circumference }
                        d={ "M" + M + " 2.0845 a " + radius + " " + radius + " 0 0 1 0 " + diameter + " a " + radius + " " + radius  + " 0 0 1 0 -" + diameter}
                    />
                </Svg>
                <Svg style={{
                    position: 'absolute',
                    top: 0,
                    left: 0
                }} width={size} height={size} viewbox={ "0 0 " + size + " " + size }>
                    <Path
                        stroke={color}
                        fill="none"
                        strokeWidth = "4"
                        strokeLinecap="round"
                        strokeDasharray={ (circumference * (this.props.porcentage * .01)) + ', ' + circumference }
                        d={ "M" + M + " 2.0845 a " + radius + " " + radius + " 0 0 1 0 " + diameter + " a " + radius + " " + radius  + " 0 0 1 0 -" + diameter}
                    />
                </Svg>
                <Text style={[{
                        color: 'rgba(0,0,0,0.54)',
                        fontFamily: "EuphemiaUCAS",
                        fontSize: 14,
                        lineHeight: 24,
                        position: 'absolute',
                        top: '50%',
                        left: 0,
                        marginTop: -12,
                        textAlign: 'center',
                        width: '100%'
                }, this.props.textStyle]}>{ level }</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({});
