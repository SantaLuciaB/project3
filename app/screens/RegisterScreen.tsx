import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, ActivityIndicator, TouchableOpacity, SafeAreaView, Alert, Image } from 'react-native';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { FIREBASE_AUTH } from '../../FirebaseConfig';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { signOut } from 'firebase/auth';


type Props = {
  navigation: NativeStackNavigationProp<any>;
}

const RegisterScreen = ({ navigation }: Props) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const auth = FIREBASE_AUTH;

  const register = async () => {
    if (!email || !password) {
      Alert.alert('Please fill in all fields.');
      return;
    }

    setLoading(true);
    try {
      const response = await createUserWithEmailAndPassword(auth, email, password);
      console.log(response);
      if (response) {
        const currentUser = auth.currentUser;
        if (currentUser) {
          await sendEmailVerification(currentUser);
          Alert.alert('Success', 'Verification email sent. Please check your inbox.');
          navigation.navigate('List'); // Accesează pagina List.tsx după înregistrare cu succes
        } else {
          Alert.alert('Error', 'User not authenticated.');
        }
      }
    } catch (error: any) {
      console.log(error);
      Alert.alert('Error', 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <Image source={require('../../assets/signup.png')} style={styles.image} resizeMode='contain' />
      {/* <Text style={styles.title}>Register</Text> */}
      <View style={styles.inputView}>
        <TextInput
          value={email}
          style={styles.input}
          placeholder='Email'
          autoCapitalize="none"
          onChangeText={(text) => setEmail(text)}
        />
        <TextInput
          secureTextEntry={true}
          value={password}
          style={styles.input}
          placeholder='Parola'
          autoCapitalize="none"
          onChangeText={(text) => setPassword(text)}
        />
      </View>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={register}
            style={[styles.button, { backgroundColor: '#D6CDEA' }]}
          >
            <Text style={styles.buttonText}>Înregistrare</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={[styles.button, { backgroundColor: '#D6CDEA' }]}
          >
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    height: 160,
    width: 170,
},
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    textAlign: 'center',
    paddingVertical: 40,
    color: 'red',
  },
  inputView: {
    width: '100%',
    paddingHorizontal: 40,
    marginBottom: 20,
  },
  input: {
    height: 50,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderRadius: 4,
    marginBottom: 15,
    backgroundColor: 'white',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  button: {
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default RegisterScreen;
