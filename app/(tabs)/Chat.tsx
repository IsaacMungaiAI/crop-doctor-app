import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import { Picker } from '@react-native-picker/picker';
import { Image } from 'react-native';
import getGeminiResponse from '../libs/gemini';


type Message = {
  id: number;
  sender: 'user' | 'bot';
  text: string;
  imageUri?: string
};


export default function ChatScreen() {

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const [selectedModel, setSelectedModel] = useState<'maize' | 'bean'>('maize');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [chatContext, setChatContext] = useState<string | null>(null);




  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now(),
      sender: 'user',
      text: input.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');

    setIsTyping(true);

    const botTextReply = await getGeminiResponse(
      chatContext ? `${chatContext}\n\nUser: ${userMessage.text}` : userMessage.text
    );


    setTimeout(() => {
      const botReply: Message = {
        id: Date.now() + 1,
        sender: 'bot',
        text: botTextReply,
      };

      setMessages((prev) => [...prev, botReply]);
      setIsTyping(false);
    }, 1500);
  };

  // Function to handle image upload
  const handleImageUpload = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;

      const imageMessage: Message = {
        id: Date.now(),
        sender: 'user',
        text: 'Image uploaded',
        imageUri: uri,
      };

      setMessages((prev) => [...prev, imageMessage]);
      scrollViewRef.current?.scrollToEnd({ animated: true });

      setIsAnalyzing(true);


      await sendToBackend(uri, selectedModel);
    }
  }




  // function to handle sending the image to the backend
  const sendToBackend = async (uri: string, modelType: string) => {
    setIsTyping(true);
    const formData = new FormData();
    formData.append('file', {
      uri,
      name: 'plant.jpg',
      type: 'image/jpeg',
    } as any);
    formData.append('model_type', modelType);

    try {
      const response = await axios.post('http://192.168.0.103:8000/predict', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const { predicted_class_name, gemini_explanation } = response.data;
      console.log(response.data)
      setChatContext(`The crop is diagnosed with ${predicted_class_name}.`);
      const botMessage: Message = {
        id: Date.now() + 2,
        sender: 'bot',
        text: `🌿 Disease: ${predicted_class_name}\n 🌱 Description and Prevention: ${gemini_explanation}`,
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error(error);
      const errorMessage: Message = {
        id: Date.now() + 3,
        sender: 'bot',
        text: "Failed to analyze the image. Please try again.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
      setIsAnalyzing(false);
    }
  };
  const generateBotResponse = (text: string) => {
    // Replace with real AI response logic (e.g., Supabase function, external API)
    if (text.toLowerCase().includes('yellow leaves')) {
      return "Yellowing leaves could be a sign of nutrient deficiency, especially nitrogen.";
    }
    return "I'm analyzing that... Please ensure you describe the symptoms clearly.";
  };

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages, isTyping]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 25}
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>AI Crop Assistant</Text>
      </View>

      <View style={{ paddingHorizontal: 16, paddingVertical: 5, backgroundColor: '#fff' }}>
        <Text style={{ fontSize: 14, color: '#444', marginBottom: 4 }}>Select crop type:</Text>
        <View style={{
          borderWidth: 1,
          borderColor: '#ccc',
          borderRadius: 10,
          overflow: 'hidden',
        }}>
          <Picker
            selectedValue={selectedModel}
            onValueChange={(itemValue) => setSelectedModel(itemValue)}
            style={{ height: 50 }}

          // optional, helps on Android
          >
            <Picker.Item label="Select a crop..." value="" enabled={false} />
            <Picker.Item label="Maize" value="maize" />
            <Picker.Item label="Bean" value="bean" />
          </Picker>
        </View>
      </View>

      <ScrollView
        ref={scrollViewRef}
        style={styles.chatContainer}
        contentContainerStyle={{ paddingBottom: 80 }}
      >
        {messages.map((msg) => (
          <View
            key={msg.id}
            style={[
              styles.message,
              msg.sender === 'user' ? styles.userMessage : styles.botMessage,
            ]}
          >
            {msg.imageUri ? (
              <Image
                source={{ uri: msg.imageUri }}
                style={{ width: 200, height: 200, borderRadius: 10, marginBottom: 5 }}
              />
            ) : null}
            <Text style={styles.messageText}>{msg.text}</Text>

          </View>
        ))}

        {isAnalyzing && (
          <View style={[styles.message, styles.botMessage, { flexDirection: 'row', alignItems: 'center' }]}>
            <ActivityIndicator size="small" color="#555" style={{ marginRight: 8 }} />
            <Text style={styles.typingText}>Analyzing image...</Text>
          </View>
        )}


        {isTyping && (
          <View style={[styles.message, styles.botMessage]}>
            <ActivityIndicator size="small" color="#555" />
            <Text style={styles.typingText}>AI is typing...</Text>
          </View>
        )}
      </ScrollView>

      <View style={styles.inputContainer}>

        <TouchableOpacity onPress={handleImageUpload} style={styles.uploadButton}>
          <Ionicons name="image-outline" size={24} color="#4CAF50" />
        </TouchableOpacity>


        <TextInput
          style={styles.input}
          placeholder="Type your crop concern..."
          value={input}
          onChangeText={setInput}
        />
        <TouchableOpacity onPress={handleSend} style={styles.sendButton}>
          <Ionicons name="send" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F8FA',
  },
  header: {
    paddingTop: 50,
    paddingBottom: 15,
    backgroundColor: '#4CAF50',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  chatContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  message: {
    marginVertical: 6,
    maxWidth: '80%',
    borderRadius: 12,
    padding: 12,
  },
  userMessage: {
    backgroundColor: '#DCF8C6',
    alignSelf: 'flex-end',
  },
  botMessage: {
    backgroundColor: '#E1E8ED',
    alignSelf: 'flex-start',
  },
  messageText: {
    fontSize: 15,
    color: '#333',
  },
  typingText: {
    marginTop: 5,
    fontSize: 13,
    color: '#888',
  },
  inputContainer: {
    position: 'absolute',
    bottom: 0,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    paddingHorizontal: 10,
    paddingVertical: 10,
    alignItems: 'center',
    width: '100%',
    //borderTopWidth: 1,
    //borderColor: '#fff',
  },
  uploadButton: {
    marginRight: 8,
  },

  input: {
    flex: 1,
    backgroundColor: '#E0E0E0',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 14,
  },
  sendButton: {
    marginLeft: 10,
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 20,
  },
});

