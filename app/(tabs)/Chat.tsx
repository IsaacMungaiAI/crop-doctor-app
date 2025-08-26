import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, KeyboardAvoidingView, Platform, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import { Image } from 'react-native';
import getGeminiResponse from '../libs/gemini';
import Markdown from 'react-native-markdown-display';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import { useLocalSearchParams } from "expo-router";

type Message = {
  id: number;
  sender: 'user' | 'bot';
  text: string;
  imageUri?: string;
};

type ChatSession = {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: number;
};

export default function ChatScreen({ route }: any) {
  const { prediction, explanation } = useLocalSearchParams();

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const [selectedModel, setSelectedModel] = useState<'maize' | 'bean'>('maize');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [chatContext, setChatContext] = useState<string | null>(null);

  // Sessions state
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [sessionId, setSessionId] = useState(route?.params?.sessionId || '');
  const [viewMode, setViewMode] = useState<'list' | 'chat'>(prediction && explanation ? 'chat' : 'list');

  const STORAGE_KEY = sessionId ? `chat_session_${sessionId}` : '';

  // Load sessions
  useEffect(() => {
    const loadSessions = async () => {
      try {
        const stored = await AsyncStorage.getItem("chat_sessions_list");
        if (stored) setSessions(JSON.parse(stored));
      } catch (err) {
        console.error("Error loading sessions list:", err);
      }
    };
    loadSessions();
  }, []);

  // Load messages for session
  useEffect(() => {
    const loadMessages = async () => {
      if (!STORAGE_KEY) return;
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        setMessages(stored ? JSON.parse(stored) : []);
      } catch (err) {
        console.error("Error loading messages:", err);
      }
    };
    loadMessages();
  }, [sessionId]);

  // Save messages per session
  useEffect(() => {
    const saveMessages = async () => {
      if (!STORAGE_KEY || messages.length === 0) return;
      try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
        const lastMsg = messages[messages.length - 1].text;

        let newSessions = [...sessions];
        const idx = newSessions.findIndex(s => s.id === sessionId);

        if (idx >= 0) {
          newSessions[idx] = {
            ...newSessions[idx],
            lastMessage: lastMsg,
            timestamp: Date.now(),
          };
        } else {
          newSessions.push({
            id: sessionId,
            title: `Chat ${sessions.length + 1}`,
            lastMessage: lastMsg,
            timestamp: Date.now(),
          });
        }

        setSessions(newSessions);
        await AsyncStorage.setItem("chat_sessions_list", JSON.stringify(newSessions));
      } catch (err) {
        console.error("Error saving messages:", err);
      }
    };
    saveMessages();
  }, [messages]);

  useEffect(() => {
  if (prediction && explanation) {
    const newId = `session_${Date.now()}`;
    setSessionId(newId);
    setViewMode("chat");

    const initialBotMessage: Message = {
      id: Date.now(),
      sender: "bot",
      text: `🌿 Disease: ${prediction}\n\n🌱 Description and Prevention:\n${explanation}`,
    };

    // update state
    setMessages([initialBotMessage]);
    setChatContext(`The crop is diagnosed with ${prediction}.`);

    // 🔑 immediately persist session + messages
    const saveInitial = async () => {
      const key = `chat_session_${newId}`;
      await AsyncStorage.setItem(key, JSON.stringify([initialBotMessage]));

      const newSession: ChatSession = {
        id: newId,
        title: `Chat ${sessions.length + 1}`,
        lastMessage: initialBotMessage.text,
        timestamp: Date.now(),
      };

      const updatedSessions = [...sessions, newSession];
      setSessions(updatedSessions);
      await AsyncStorage.setItem("chat_sessions_list", JSON.stringify(updatedSessions));
    };
    saveInitial();
  }
}, [prediction, explanation]);



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

  const handleImageUpload = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
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
  };

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
      const response = await axios.post('https://crop-doctor-app-fastapi.onrender.com/predict', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const { predicted_class_name, gemini_explanation } = response.data;
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

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages, isTyping]);

  const loadSessions = async () => {
    const keys = await AsyncStorage.getAllKeys();
    const chatKeys = keys.filter((k) => k.startsWith("chat_session_"));
    const data: ChatSession[] = [];

    for (const key of chatKeys) {
      const stored = await AsyncStorage.getItem(key);
      const messages: Message[] = stored ? JSON.parse(stored) : [];
      const lastMessage = messages.length ? messages[messages.length - 1].text : "No messages yet";

      data.push({
        id: key.replace("chat_session_", ""),
        title: `Chat ${data.length + 1}`, // ✅ placeholder title
        lastMessage,
        timestamp: messages.length ? messages[messages.length - 1].id : Date.now(), // ✅ fallback
      });
    }

    setSessions(data);
  };


  const deleteSession = async (sessionId: string) => {
    await AsyncStorage.removeItem(`chat_session_${sessionId}`);
    loadSessions(); // refresh list
  };

  // 🔹 WhatsApp-like Home Screen
  if (viewMode === 'list') {
    return (
      <View style={{ flex: 1, backgroundColor: '#fff' }}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Chats</Text>
        </View>

        <ScrollView style={{ flex: 1 }}>
          {sessions
            .sort((a, b) => b.timestamp - a.timestamp)
            .map((s) => (
              <TouchableOpacity
                key={s.id}
                style={styles.chatItem}
                onPress={() => {
                  setSessionId(s.id);
                  setViewMode('chat');
                }}
                onLongPress={() => {
                  Alert.alert(
                    "Delete Chat",
                    "Are you sure you want to delete this chat?",
                    [
                      { text: "Cancel", style: "cancel" },
                      { text: "Delete", style: "destructive", onPress: () => deleteSession(s.id) },
                    ]
                  )
                }}
              >
                <Ionicons name="person-circle" size={48} color="#4CAF50" style={{ marginRight: 12 }} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.chatTitle}>{s.title}</Text>
                  <Text style={styles.chatPreview} numberOfLines={1}>
                    {s.lastMessage || 'No messages yet'}
                  </Text>
                </View>
                <Text style={styles.chatTime}>
                  {s.timestamp ? new Date(s.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                </Text>
              </TouchableOpacity>
            ))}
        </ScrollView>

        {/* Floating Button */}
        <TouchableOpacity
          style={styles.fab}
          onPress={() => {
            const newId = `session_${Date.now()}`;
            setSessionId(newId);
            setViewMode('chat');
          }}
        >
          <Ionicons name="chatbubble-ellipses" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
    );
  }

  // 🔹 Chat View
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 25}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setViewMode('list')} style={{ position: 'absolute', left: 10, top: 50 }}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>AI Crop Assistant</Text>
      </View>

      {/* 🔹 Crop picker (your existing code) */}
      <View style={{ paddingHorizontal: 16, paddingVertical: 5, backgroundColor: '#fff' }}>
        <Text style={{ fontSize: 14, color: '#444', marginBottom: 4 }}>Select crop type:</Text>
        <View
          style={{
            borderWidth: 1,
            borderColor: '#ccc',
            borderRadius: 10,
            overflow: 'hidden',
          }}
        >
          <Picker
            selectedValue={selectedModel}
            onValueChange={(itemValue) => setSelectedModel(itemValue)}
            style={{ height: 50 }}
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
            <Markdown style={markdownStyles}>{msg.text}</Markdown>
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
  container: { flex: 1, backgroundColor: '#F7F8FA' },
  header: {
    paddingTop: 50,
    paddingBottom: 15,
    backgroundColor: '#4CAF50',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
  },
  headerTitle: { fontSize: 18, fontWeight: '600', color: '#fff' },
  chatContainer: { flex: 1, paddingHorizontal: 16, paddingTop: 10 },
  message: { marginVertical: 6, maxWidth: '80%', borderRadius: 12, padding: 12 },
  userMessage: { backgroundColor: '#DCF8C6', alignSelf: 'flex-end' },
  botMessage: { backgroundColor: '#E1E8ED', alignSelf: 'flex-start' },
  typingText: { marginTop: 5, fontSize: 13, color: '#888' },
  inputContainer: {
    position: 'absolute',
    bottom: 0,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    paddingHorizontal: 10,
    paddingVertical: 10,
    alignItems: 'center',
    width: '100%',
  },
  uploadButton: { marginRight: 8 },
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
  // WhatsApp home styles
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  chatTitle: { fontSize: 16, fontWeight: '600', color: '#000' },
  chatPreview: { fontSize: 14, color: '#666', marginTop: 2 },
  chatTime: { fontSize: 12, color: '#999', marginLeft: 8 },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#4CAF50',
    borderRadius: 30,
    padding: 15,
    elevation: 4,
  },
});

export const markdownStyles = StyleSheet.create({
  body: { color: '#333', fontSize: 15, lineHeight: 22 },
  strong: { fontWeight: 'bold' },
  em: { fontStyle: 'italic' },
  bullet_list: { paddingLeft: 10 },
  list_item: { flexDirection: 'row', alignItems: 'flex-start' },
});

