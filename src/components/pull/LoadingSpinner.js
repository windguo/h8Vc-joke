import React, {Component} from "react";
import {Dimensions, ActivityIndicator,View, Text} from "react-native";
const {width, height} = Dimensions.get('window');
export default class LoadingSpinner extends Component {

    static defaultProps = {
        width: width,
        height: height,
        spinnerColor: 'white',
        textColor: 'white',
        text: '努力加载中...',
        backgroundColor:'transparent'
    };
    render() {
        if(this.props.type==='normal'){
            return (
                <View style={{width:width,justifyContent:'center', alignItems:'center'}}>
                    <View style={{width:140,height:50,borderRadius:10,backgroundColor:'black',opacity: 0.75,flexDirection:'row',justifyContent: 'center', alignItems: 'center'}}>
                        <ActivityIndicator color={this.props.spinnerColor}/>
                        <Text note style={{color: this.props.textColor,marginLeft:5}}>{this.props.text}</Text>
                    </View>
                </View>
            )
        }else if(this.props.type==='bottom'){
            return (
                    <View style={{width:width,height:50,borderRadius:10,backgroundColor:'red',flexDirection:'row',justifyContent: 'center', alignItems: 'center'}}>
                        <ActivityIndicator color={this.props.spinnerColor}/>
                        <Text note style={{color: this.props.textColor}}>{this.props.text}</Text>
                    </View>
            )
        }else if(this.props.type==='allLoaded'){
            return (<View style={styles.allLoaded}><Text style={styles.statusText}>没有更多数据了</Text></View>)
        } else if(this.props.type==='home'){
            return (
                <ActivityIndicator color={'#FF6347'}/>
            );

        }else{
            return (
                <View style={{
                    position:'absolute',
                    top:0,
                    left:0,
                    right:0,
                    bottom: 0,
                    width: this.props.width,
                    height: this.props.height,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor:this.props.backgroundColor}}>
                    <View style={{width:140,height:50,borderRadius:10,
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                        opacity: 0.75,
                        backgroundColor:'black'}}>
                        <ActivityIndicator color={this.props.spinnerColor}/>
                        <Text note style={{marginLeft:8,color: this.props.textColor}}>{this.props.text}</Text>
                    </View>
                </View>
            );
        }

    }
}

const styles = {
    allLoaded:{
        marginLeft: 10,
        marginRight: 10,
        justifyContent:'center',
        alignItems:'center',
        height:50,
        backgroundColor:'red',
    },
    statusText:{
        backgroundColor:'transparent',
        fontSize:13,
        color:'red',
    }
};
