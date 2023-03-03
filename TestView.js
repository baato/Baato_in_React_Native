import React from "react";
import {View, Text,StyleSheet} from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingBottom: 22,
        backgroundColor: "#FFFFFF"
    },
    itemTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        padding: 10,
    },
    itemSub: {
        fontSize: 12,
        fontWeight: 'normal',
        padding: 10,
        marginBottom: 10
    },
    separator: {
        flex: 1,
        borderWidth: 1,
        borderColor: 'grey'
    }

});
const TestView = () => {
    return(
        <View style = {styles.container}>
            <Text style = {styles.itemTitle}>"Hello KTM"</Text>
            <Text style = {styles.itemSub}>"This is the address detail and can have a large text."</Text>
        </View>
    )
}
export default TestView;