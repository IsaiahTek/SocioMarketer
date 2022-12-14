import React, {useState, useEffect} from 'react';
import { StatusBar, Text, TouchableHighlight, TextInput, ToastAndroid, View, ScrollView, useColorScheme, Alert, Linking} from 'react-native';
import { MMKVLoader, useMMKVStorage } from "react-native-mmkv-storage"
import Clipboard from '@react-native-clipboard/clipboard';

import { Link, NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator()

const storage = new MMKVLoader().initialize()

const styles = {
    common:{marginVertical:20},
    input:{borderRadius:8, paddingVertical:15, paddingHorizontal:20, fontSize:18, elevation:5},
    linkHeader:{flexDirection:"row", justifyContent:"space-between", alignItems:"center"},
    link:{paddingHorizontal:20, paddingVertical:10, borderRadius:2, elevation:5},
    linkTextBox:{backgroundColor:"#F0F0F011", elevation:1, color:"gray", paddingHorizontal:15, paddingVertical:15},
    button:{padding:20, paddingVertical:15, borderRadius:99, elevation:10},
    buttonText:{textAlign:"center", color:"white", fontWeight:"600"}

}

const App = () => {
    return (
        <NavigationContainer>
            <StatusBar backgroundColor="red" />
            <Stack.Navigator
                screenOptions={{
                    headerStyle:{
                        backgroundColor:"red",
                        color:"white"
                    },
                    headerTintColor:"white",
                    headerTitleStyle:{
                        fontWeight:"bold"
                    }
                }} >
                <Stack.Screen name="home" options={{headerShown:false}} component={AppTools}
                />
                <Stack.Screen name="message-link-creator" options={{title:"Direct Message Link Creator"}} component={DM_LinkCreator} />
                <Stack.Screen name='email-link-creator' options={{title:"Email Link Creator"}} component={EmailLinkCreator} />
                <Stack.Screen name='profile' options={{title:"Profile"}} component={SettingsPage} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default App;

const InputView = (props)=>{
    const dayNightMode = useColorScheme();
    return(
        <View style={styles.common}>
            <Text style={{color:Colors[dayNightMode].bgText}}>{props.title}</Text>
            <TextInput multiline={props.multiline} numberOfLines={props.numberOfLines} style={[styles.input, props.style,{backgroundColor:Colors[dayNightMode].inputBackground, color:Colors[dayNightMode].inputColor}]} value={props.value} keyboardType={props.keyboardType} placeholder={props.placeholder} onChangeText={(number)=>props.setAction(number)} placeholderTextColor="gray" />
        </View>
    )
}

const Colors = {
    dark:{
        backgroundColor:"#270000",
        inputBackground:"#FF000044",
        inputColor:"#CCCCCC",
        bgText:"#AAAAAA",
        brandText:"orange"
    },
    light:{
        backgroundColor:"white",
        inputBackground:"white",
        inputColor:"#111111",
        bgText:"#333333",
        brandText:"brown"
    }
}
const AppTools = ({navigation, route})=>{
    const dayNightMode = useColorScheme();
    return(
        <View style={[{flex:1, justifyContent:"center", alignItems:"center", backgroundColor:Colors[dayNightMode].backgroundColor}]}>
            <View style={[{marginHorizontal:20, maxWidth:400}, styles.common]}>
                <Text style={{fontSize:44, color:"red", fontWeight:"bold", textAlign:"center"}}>
                    SocioMarketer
                </Text>
                <Text style={{fontSize:12, fontStyle:"italic", textAlign:"center", color:Colors[dayNightMode].brandText, marginBottom:20}}>Be in control of your digital marketing with zero experience</Text>
                <Text style={{fontSize:20, textAlign:"center", color:Colors[dayNightMode].bgText}}>Make your customers send you a direct message across all of your favourite social media platforms and more</Text>
            </View>
            <TouchableHighlight style={[styles.common, styles.button, {backgroundColor:"white", paddingHorizontal:60}]} onPress={()=>navigation.navigate("profile")}>
                <Text style={[styles.buttonText, {fontSize:16, color:"red"}]}>My Profile</Text>
            </TouchableHighlight>
            <TouchableHighlight style={[styles.common, styles.button, {backgroundColor:"red", paddingHorizontal:60}]} onPress={()=>navigation.navigate("message-link-creator")}>
                <Text style={[styles.buttonText, {fontSize:16}]}>DM Link Creator</Text>
            </TouchableHighlight>

            <TouchableHighlight style={[styles.common, styles.button, {backgroundColor:"white", paddingHorizontal:60}]} onPress={()=>navigation.navigate("email-link-creator")}>
                <Text style={[styles.buttonText, {fontSize:16, color:"#DD0000"}]}>Email Link Creator</Text>
            </TouchableHighlight>

        </View>
    )
}

const DM_LinkCreator = ({navigation, props})=>{
    
    const [message, setMessage] = useMMKVStorage("message", storage, "")
    const [encodedMessage, setEncodedMessage] = useMMKVStorage("encodedMessage", storage, "")

    const [whatsappNumber] = useMMKVStorage("whatsappNumber", storage, "")
    const [twitterID] = useMMKVStorage("twetterID", storage, "")
    const [instagramUsername] = useMMKVStorage("instagramUsername", storage, "")
    const [facebookPageName] = useMMKVStorage("facebookPageName", storage, "")
    
    const twitterDMLink = `https://twitter.com/messages/compose?recipient_id=${encodeURIComponent(twitterID)}&text=${encodedMessage}`
    
    const formattedWA_Number = whatsappNumber.toString().startsWith("0")?"234"+whatsappNumber.substring(1):whatsappNumber
    const whatsappDMLink = `https://wa.me/${encodeURIComponent(formattedWA_Number)}?text=${encodedMessage}`

    const instagramDMLink = `https://ig.me/m/${encodeURIComponent(instagramUsername)}`

    const facebookDMLink = `http://m.me/${encodeURIComponent(facebookPageName)}`

    const setClipboardTextAndNotify = (link, notification, paramForCheckingAvailability) => {
        if(paramForCheckingAvailability.length){
            Clipboard.setString(link)
            ToastAndroid.show(notification, ToastAndroid.SHORT)
        }else{
            Alert.alert(
                "Missing Parameter",
                "You need to set the value to be used for this feature in Profile",
                [
                    {text:"Set", onPress:()=>navigation.navigate("profile")},
                    {text:""},
                    {text:"Cancel"}
                ]
            )
        }
    }

    const openLink = (url, linkCoreParam)=>{
        const isSupportedLink = Linking.canOpenURL(url)
        if(isSupportedLink){
            if(linkCoreParam.length){
                Linking.openURL(url)
            }else{
                Alert.alert(
                    "Missing Parameter",
                    "You need to set the value to be used for this feature in Profile",
                    [
                        {text:"Set", onPress:()=>navigation.navigate("profile")},
                        {text:""},
                        {text:"Cancel", style:"cancel"}
                    ]
                )
            }
        }else{
            Alert.alert(
                "Link Error",
                "please enter safe and appropriate characters",
                [
                    {text:"OK",},
                    {text:""},
                    {text:"Cancel"}
                ]
            )
        }
    }

    
    const setMessageAndEncodedMessage = (message)=>{
        setMessage(message)
        setEncodedMessage(encodeURIComponent(message))
    }

    const DM_Link = ({link, linkCoreParam})=>(
        <View style={styles.linkTextBox}>
            <TouchableHighlight onPress={()=>openLink(link, linkCoreParam)}>
                <Text style={{color:"gray"}}>{encodeURIComponent(link)}</Text>
            </TouchableHighlight>
        </View>
    )
    const dayNightMode = useColorScheme();

    return(
        <View style={{flex:1, backgroundColor:Colors
            [dayNightMode].backgroundColor}}>
            <ScrollView>
                <View style={{paddingHorizontal:20, paddingVertical:20}}>
                    <View>
                        <Text style={{color:"gray"}}>starter message</Text>
                        <TextInput
                            placeholder="Enter message here" 
                            placeholderTextColor="gray"
                            multiline={true} 
                            numberOfLines={5}
                            value={message}
                            style={[styles.input, {backgroundColor:Colors[dayNightMode].inputBackground, color:Colors[dayNightMode].inputColor, marginBottom:60}]} 
                            onChangeText={newVal=> setMessageAndEncodedMessage(newVal)} />
                    </View>
                    <View style={styles.common}>
                        <View style={styles.linkHeader}>
                            <Text style={{color:"gray"}}>WhatsApp Link</Text>
                            <TouchableHighlight style={[styles.link, {backgroundColor:"#11772D"}]} onPress={()=>{setClipboardTextAndNotify(whatsappDMLink, "WhatsApp link copied!", whatsappNumber)}} >
                                <Text style={styles.buttonText}>Copy</Text>
                            </TouchableHighlight>
                        </View>

                        <DM_Link link={whatsappDMLink} linkCoreParam={whatsappNumber} />

                    </View>

                    <View style={styles.common}>
                        <View style={styles.linkHeader}>
                            <Text style={{color:"gray"}}>Twitter Link</Text>
                            <TouchableHighlight style={[styles.link, {backgroundColor:"#000080"}]} onPress={()=>{setClipboardTextAndNotify(twitterDMLink, "Twitter link copied!", twitterID)}}>
                                <Text style={styles.buttonText}>Copy</Text>
                            </TouchableHighlight>
                        </View>

                        <DM_Link link={twitterDMLink} linkCoreParam={twitterID} />

                    </View>

                    <View style={styles.common}>
                        <View style={styles.linkHeader}>
                            <Text style={{color:"gray"}}>Instagram Link</Text>
                            <TouchableHighlight style={[styles.link, {backgroundColor:"purple"}]} onPress={()=>{setClipboardTextAndNotify(instagramDMLink, "Instagram link copied!", instagramUsername)}} >
                                <Text style={styles.buttonText}>Copy</Text>
                            </TouchableHighlight>
                        </View>

                        <DM_Link link={instagramDMLink} linkCoreParam={instagramUsername} />

                    </View>

                    <View style={styles.common}>
                        <View style={styles.linkHeader}>
                            <Text style={{color:"gray"}}>Facebook Link</Text>
                            <TouchableHighlight style={[styles.link, {backgroundColor:"blue"}]} onPress={()=>{setClipboardTextAndNotify(facebookDMLink, "Facebook link copied!", facebookPageName)}}>
                                <Text style={styles.buttonText}>Copy</Text>
                            </TouchableHighlight>
                        </View>
                        
                        <DM_Link link={facebookDMLink} linkCoreParam={facebookPageName} />
                        
                    </View>
                </View>
            </ScrollView>
        </View>
    )
}

const EmailLinkCreator = (props)=>{
    const [email, setEmail] = useMMKVStorage("email", storage, "")
    const [cc, setCc] = useMMKVStorage("cc", storage, "")
    const [bcc, setBcc] = useMMKVStorage("bcc", storage, "")
    const [subject, setSubject] = useMMKVStorage("subject", storage, "")
    const [emailBody, setEmailBody] = useMMKVStorage("emailBody", storage, "")
    const dayNightMode = useColorScheme();

    const emailLink = `mailto:${email}?cc${cc}&bcc${bcc}&subject${subject}&body${emailBody}`

    const setClipboardTextAndNotify = ()=>{
        if(email.length){
            Clipboard.setString(encodeURI(emailLink))
            ToastAndroid.show("Email link copied!", ToastAndroid.SHORT)
        }else{
            alert("Enter your email address")
        }
    }
    return(
        <View style={{flex:1, backgroundColor:Colors
            [dayNightMode].backgroundColor}}>
            <ScrollView>
                <View style={{paddingHorizontal:20, paddingVertical:20}}>
                    <InputView title="Your email address" placeholder="e.g mailman@domain.com" keyboardType="email-pad" value={email} setAction={setEmail} />
                    <InputView title="CC [optional]" placeholder="second@dom.com" keyboardType="email-pad" value={cc} setAction={setCc} />
                    <InputView title="BCC [optional]" placeholder="third@dom.com" keyboardType="email-pad" value={bcc} setAction={setBcc} />
                    <InputView title="Subject [optional]" placeholder="Title of mail" keyboardType="default" value={subject} setAction={setSubject} />
                    <InputView multiline={true} numberOfLines={5} title="Message [optional]" placeholder="Enter your mail here" keyboardType="default" value={emailBody} setAction={setEmailBody} />
                    <TouchableHighlight style={[styles.common, styles.button, {backgroundColor:"#FF0000"}]} onPress={()=>{setClipboardTextAndNotify()}}>
                        <Text style={[styles.buttonText, {color:"white"}]}>Copy Email Link</Text>
                    </TouchableHighlight>
                </View>
            </ScrollView>
        </View>
    )
}

const SettingsPage = ({navigation}) => {
    // 
    const [whatsappNumber, setWhatsAppNumber] = useMMKVStorage("whatsappNumber", storage, "")
    const [twitterID, setTwitterID] = useMMKVStorage("twetterID", storage, "")
    const [instagramUsername, setInstagramUsername] = useMMKVStorage("instagramUsername", storage, "")
    const [facebookPageName, setFacebookPageName] = useMMKVStorage("facebookPageName", storage, "")
    const [email, setEmail] = useMMKVStorage("email", storage, "")
    const dayNightMode = useColorScheme();
    return(
        <View style={{flex:1, backgroundColor:Colors[dayNightMode].backgroundColor}}>
            <ScrollView>
                <View style={{paddingHorizontal:20, paddingVertical:20}}>
                    <InputView title="Your WhatsApp Number" placeholder="e.g 2347079574758" keyboardType="phone-pad" value={whatsappNumber} setAction={setWhatsAppNumber} />
                    <InputView title="Instagram username" placeholder="IG handle" keyboardType="default" value={instagramUsername} setAction={setInstagramUsername} />
                    <InputView title="Twitter ID" placeholder="e.g 39238474" keyboardType="phone-pad" value={twitterID} setAction={setTwitterID} />
                    <InputView title="Facebook Page username" placeholder="FB Page username" keyboardType="default" value={facebookPageName} setAction={setFacebookPageName} />
                    <InputView title="Enter your email address" placeholder="e.g johndoe@wmail.com" keyboardType="default" value={email} setAction={setEmail} />
                    <TouchableHighlight style={[styles.button, styles.common,{backgroundColor:"red", paddingHorizontal:60}]} onPress={()=>navigation.navigate("message-link-creator")}>
                        <Text style={[styles.buttonText, {fontSize:18}]}>Direct Message Link Creator</Text>
                    </TouchableHighlight>
                </View>
            </ScrollView>
        </View>
    )
}