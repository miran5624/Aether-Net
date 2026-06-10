import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, KeyboardAvoidingView, Platform, Keyboard, PermissionsAndroid, Alert } from 'react-native';
import Voice, { SpeechResultsEvent, SpeechErrorEvent } from '@react-native-voice/voice';
import { searchProtocols, getSeverityColor } from '../services/EmergencyAI/VectorSearch';
import { detectImmediateThreat, formatTimestamp } from '../services/EmergencyAI/Triage';
import { Protocol } from '../services/EmergencyAI/protocols';

interface Message {
  id: string;
  role: 'user' | 'bot' | 'protocol';
  text?: string;
  protocol?: Protocol;
  score?: number;
  timestamp: string;
}

interface Props {
  onClose: () => void;
}

const CATEGORIES = [
  'Burns', 'Bleeding', 'Heart', 'Choking', 'Fracture',
  'Drowning', 'Snake', 'Fire', 'Flood', 'Poisoning',
  'Shock', 'Seizure', 'Stroke'
];

export const ChatbotScreen: React.FC<Props> = ({ onClose }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const [isListening, setIsListening] = useState(false);
  const [voiceAvailable, setVoiceAvailable] = useState(false);
  
  useEffect(() => {
    // Initial greeting
    setMessages([
      {
        id: Date.now().toString(),
        role: 'bot',
        text: "I am AetherNet's offline emergency assistant. I work without internet and only provide verified first aid protocols.\n\nDescribe the emergency in plain words. For example:\n• 'person is not breathing'\n• 'severe bleeding from leg'\n• 'building is on fire'\n• 'someone was bitten by a snake'",
        timestamp: formatTimestamp()
      }
    ]);

    Voice.isAvailable().then((available) => {
      setVoiceAvailable(Platform.OS === 'android' ? true : !!available);
    }).catch(() => {
      setVoiceAvailable(Platform.OS === 'android');
    });

    Voice.onSpeechResults = (e: SpeechResultsEvent) => {
      if (e.value && e.value.length > 0) {
        setInputText(e.value[0]);
      }
    };

    Voice.onSpeechEnd = () => {
      setIsListening(false);
      setTimeout(() => {
        setInputText(prev => {
          if (prev.trim().length > 0) {
            handleSend(prev);
          }
          return prev;
        });
      }, 300);
    };

    Voice.onSpeechError = (e: SpeechErrorEvent) => {
      console.log('Voice error:', e.error);
      setIsListening(false);
      if (e.error?.message !== '7/No match') { // Ignore no match error when user doesn't speak
        Alert.alert('Voice Error', `onSpeechError: ${e.error?.message || JSON.stringify(e.error)}`);
      }
    };

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  const toggleVoiceInput = async () => {
    if (isListening) {
      await Voice.stop();
      setIsListening(false);
      return;
    }

    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        {
          title: 'Microphone Permission',
          message: 'Emergency AI needs microphone to understand your voice',
          buttonPositive: 'Allow',
        }
      );
      if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
        Alert.alert('Permission Denied', 'Microphone permission is required for voice input.');
        return;
      }
    }

    try {
      setInputText('');
      await Voice.start('en-US', {
        EXTRA_OFFLINE_ONLY: true // Try to force offline recognition for Android 9+
      });
      setIsListening(true);
    } catch (e: any) {
      console.log('Voice start error:', e);
      Alert.alert('Voice Start Error', e?.message || JSON.stringify(e));
      setIsListening(false);
    }
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const handleSend = (query: string = inputText) => {
    if (!query.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: query.trim(),
      timestamp: formatTimestamp()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    Keyboard.dismiss();
    scrollToBottom();

    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      processQuery(query.trim());
      scrollToBottom();
    }, 400);
  };

  const processQuery = (query: string) => {
    const immediateThreat = detectImmediateThreat(query);
    const newMessages: Message[] = [];
    const timestamp = formatTimestamp();

    if (immediateThreat) {
      newMessages.push({
        id: Date.now().toString() + '_threat_bot',
        role: 'bot',
        text: "⚠️ IMMEDIATE THREAT DETECTED. Follow these steps NOW:",
        timestamp
      });
      newMessages.push({
        id: Date.now().toString() + '_threat_protocol',
        role: 'protocol',
        protocol: immediateThreat,
        score: 1.0,
        timestamp
      });
    } else {
      const results = searchProtocols(query, 3);

      if (results.length > 0 && results[0].score > 0.20) {
        newMessages.push({
          id: Date.now().toString() + '_res1_bot',
          role: 'bot',
          text: "I found a matching protocol:",
          timestamp
        });
        newMessages.push({
          id: Date.now().toString() + '_res1_protocol',
          role: 'protocol',
          protocol: results[0].protocol,
          score: results[0].score,
          timestamp
        });
      } else {
        newMessages.push({
          id: Date.now().toString() + '_no_match',
          role: 'bot',
          text: "I couldn't match that to a specific protocol. Try describing: what happened, what the person looks like now, where they are hurt. Or type a category: Burns, Bleeding, Choking, Heart, Breathing, Fracture, Poison, Disaster.",
          timestamp
        });
      }
    }

    setMessages(prev => [...prev, ...newMessages]);
  };

  const renderProtocolCard = (protocol: Protocol, score?: number) => {
    const severityColor = getSeverityColor(protocol.severity);

    return (
      <View style={[styles.protocolCard, { borderColor: severityColor }]}>
        <View style={[styles.protocolHeader, { backgroundColor: severityColor }]}>
          <Text style={styles.severityBadge}>
            {protocol.severity === 'CRITICAL' ? '⚠ CRITICAL' :
              protocol.severity === 'URGENT' ? '⚡ URGENT' : '✓ STABLE'}
          </Text>
        </View>

        <View style={styles.protocolBody}>
          <Text style={styles.protocolTitle}>{protocol.title}</Text>

          {protocol.timeCritical && (
            <View style={styles.timeCriticalBanner}>
              <Text style={styles.timeCriticalText}>⏱ TIME CRITICAL — Act immediately</Text>
            </View>
          )}

          <Text style={styles.sectionTitle}>STEPS:</Text>
          {protocol.steps.map((step, index) => (
            <Text key={index} style={styles.stepText}>{`${index + 1}. ${step}`}</Text>
          ))}

          {protocol.doNot && protocol.doNot.length > 0 && (
            <>
              <Text style={[styles.sectionTitle, { color: '#ff4444', marginTop: 15 }]}>DO NOT:</Text>
              {protocol.doNot.map((item, index) => (
                <Text key={index} style={styles.doNotText}>{`✗ ${item}`}</Text>
              ))}
            </>
          )}

          {score !== undefined && (
            <Text style={styles.scoreText}>
              Match confidence: {Math.round(score * 100)}%
            </Text>
          )}
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={onClose} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>⚕ EMERGENCY AI</Text>
          <Text style={styles.headerSubtitle}>Offline · Verified Protocols Only</Text>
        </View>
      </View>

      <ScrollView
        ref={scrollViewRef}
        style={styles.messageList}
        contentContainerStyle={styles.messageListContent}
        keyboardShouldPersistTaps="handled"
      >
        {messages.map((msg) => (
          <View key={msg.id} style={styles.messageWrapper}>
            {msg.role === 'user' ? (
              <View style={styles.userBubble}>
                <Text style={styles.userText}>{msg.text}</Text>
                <Text style={styles.timestampRight}>{msg.timestamp}</Text>
              </View>
            ) : msg.role === 'bot' ? (
              <View style={styles.botBubble}>
                <Text style={styles.botText}>{msg.text}</Text>
                <Text style={styles.timestampLeft}>{msg.timestamp}</Text>
              </View>
            ) : (
              msg.protocol && renderProtocolCard(msg.protocol, msg.score)
            )}
          </View>
        ))}
        {isTyping && (
          <View style={styles.botBubble}>
            <Text style={styles.botText}>Searching protocols...</Text>
          </View>
        )}
      </ScrollView>

      <View style={styles.inputContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll} contentContainerStyle={{ paddingHorizontal: 10 }}>
          {CATEGORIES.map(cat => (
            <TouchableOpacity key={cat} style={styles.categoryPill} onPress={() => handleSend(cat)}>
              <Text style={styles.categoryText}>{cat}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          padding: 10,
          backgroundColor: '#0f0f0f',
          borderTopWidth: 1,
          borderTopColor: '#222222',
          gap: 8,
        }}>
          {voiceAvailable && (
            <TouchableOpacity
              onPress={toggleVoiceInput}
              style={{
                width: 44,
                height: 44,
                borderRadius: 22,
                backgroundColor: isListening ? '#ff4444' : '#1a1a1a',
                borderWidth: 1,
                borderColor: isListening ? '#ff4444' : '#333333',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Text style={{ fontSize: 20, includeFontPadding: false, textAlignVertical: 'center' }}>
                {isListening ? '⏹' : '🎙'}
              </Text>
            </TouchableOpacity>
          )}

          <TextInput
            style={{
              flex: 1,
              backgroundColor: '#1a1a1a',
              borderWidth: 1,
              borderColor: isListening ? '#ff4444' : '#333333',
              borderRadius: 22,
              paddingHorizontal: 16,
              paddingVertical: 10,
              color: '#ffffff',
              fontSize: 15,
            }}
            value={inputText}
            onChangeText={setInputText}
            placeholder={isListening ? '🎙 Listening...' : 'Describe the emergency...'}
            placeholderTextColor={isListening ? '#ff6666' : '#555555'}
            multiline={false}
            returnKeyType="send"
            onSubmitEditing={() => handleSend()}
          />

          <TouchableOpacity
            onPress={() => handleSend()}
            style={{
              width: 44,
              height: 44,
              borderRadius: 22,
              backgroundColor: '#003311',
              borderWidth: 1,
              borderColor: '#00ff41',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Text style={{ color: '#00ff41', fontSize: 20, fontWeight: 'bold', includeFontPadding: false, textAlignVertical: 'center', marginTop: -2 }}>→</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0a0a0a',
    paddingTop: 40,
    paddingBottom: 15,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#222',
  },
  backButton: {
    marginRight: 15,
  },
  backButtonText: {
    color: '#00ff41',
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerTitleContainer: {
    flex: 1,
  },
  headerTitle: {
    color: '#00ff41',
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    color: '#666666',
    fontSize: 12,
  },
  messageList: {
    flex: 1,
  },
  messageListContent: {
    padding: 15,
    paddingBottom: 20,
  },
  messageWrapper: {
    marginBottom: 15,
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: '#1a3a1a',
    borderWidth: 1,
    borderColor: '#00ff41',
    borderRadius: 12,
    padding: 12,
    maxWidth: '80%',
  },
  userText: {
    color: '#ffffff',
    fontSize: 16,
  },
  botBubble: {
    alignSelf: 'flex-start',
    backgroundColor: '#111111',
    borderWidth: 1,
    borderColor: '#333333',
    borderRadius: 12,
    padding: 12,
    maxWidth: '80%',
  },
  botText: {
    color: '#cccccc',
    fontSize: 16,
    lineHeight: 22,
  },
  timestampRight: {
    color: '#666',
    fontSize: 10,
    textAlign: 'right',
    marginTop: 5,
  },
  timestampLeft: {
    color: '#666',
    fontSize: 10,
    textAlign: 'left',
    marginTop: 5,
  },
  protocolCard: {
    width: '100%',
    borderWidth: 1,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#111111',
    marginVertical: 5,
  },
  protocolHeader: {
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  severityBadge: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  protocolBody: {
    padding: 15,
  },
  protocolTitle: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  timeCriticalBanner: {
    backgroundColor: 'rgba(255, 68, 68, 0.2)',
    borderLeftWidth: 3,
    borderLeftColor: '#ff4444',
    padding: 8,
    marginBottom: 15,
  },
  timeCriticalText: {
    color: '#ff4444',
    fontWeight: 'bold',
    fontSize: 12,
  },
  sectionTitle: {
    color: '#aaaaaa',
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: 5,
  },
  stepText: {
    color: '#eeeeee',
    fontSize: 15,
    marginBottom: 8,
    lineHeight: 22,
  },
  doNotText: {
    color: '#ff8888',
    fontSize: 15,
    marginBottom: 8,
    lineHeight: 22,
  },
  scoreText: {
    color: '#666666',
    fontSize: 10,
    marginTop: 15,
    textAlign: 'right',
  },
  inputContainer: {
    backgroundColor: '#0a0a0a',
    borderTopWidth: 1,
    borderTopColor: '#222',
    paddingBottom: Platform.OS === 'ios' ? 20 : 10,
  },
  categoryScroll: {
    paddingVertical: 10,
  },
  categoryPill: {
    backgroundColor: '#222',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#333',
  },
  categoryText: {
    color: '#ccc',
    fontSize: 14,
  },
  inputRow: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    alignItems: 'center',
    paddingTop: 5,
  },
  textInput: {
    flex: 1,
    backgroundColor: '#111',
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    color: '#fff',
    fontSize: 16,
    maxHeight: 100,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#1a3a1a',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
    borderWidth: 1,
    borderColor: '#00ff41',
  },
  sendButtonText: {
    color: '#00ff41',
    fontSize: 20,
    fontWeight: 'bold',
    includeFontPadding: false,
    textAlignVertical: 'center',
    marginTop: -2,
  },
});
