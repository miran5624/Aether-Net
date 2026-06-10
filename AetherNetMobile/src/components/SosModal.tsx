import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Modal, StyleSheet } from 'react-native';

interface SosModalProps {
  visible: boolean;
  onCancel: () => void;
  onConfirm: (description: string, type: string) => void;
}

const EMERGENCY_TYPES = [
  { id: 'medical', label: 'medical 🏥' },
  { id: 'rescue', label: 'rescue 🆘' },
  { id: 'fire', label: 'fire 🔥' },
  { id: 'flood', label: 'flood 🌊' }
];

export const SosModal: React.FC<SosModalProps> = ({ visible, onCancel, onConfirm }) => {
  const [description, setDescription] = useState('');
  const [selectedType, setSelectedType] = useState('medical');
  const charCount = description.length;

  const handleCancel = () => {
    setDescription('');
    setSelectedType('medical');
    onCancel();
  };

  const handleConfirm = () => {
    onConfirm(description.trim(), selectedType);
    setDescription('');
    setSelectedType('medical');
  };

  const getCounterColor = () => {
    if (charCount >= 200) return '#ff4444';
    if (charCount >= 180) return '#ffaa00';
    return '#00ff41';
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={handleCancel}
    >
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Text style={styles.title}>🆘 RAISE SOS</Text>
          <Text style={styles.subtitle}>Select emergency type</Text>

          <View style={styles.pillContainer}>
            {EMERGENCY_TYPES.map((type) => (
              <TouchableOpacity
                key={type.id}
                style={[
                  styles.pill,
                  selectedType === type.id ? styles.pillSelected : styles.pillUnselected
                ]}
                onPress={() => setSelectedType(type.id)}
              >
                <Text
                  style={
                    selectedType === type.id ? styles.pillTextSelected : styles.pillTextUnselected
                  }
                >
                  {type.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.descriptionLabel}>Description (optional)</Text>
          
          <TextInput
            style={styles.input}
            multiline={true}
            numberOfLines={4}
            maxLength={200}
            placeholder="Describe your emergency — injuries, people trapped, hazards..."
            placeholderTextColor="#555555"
            value={description}
            onChangeText={setDescription}
          />
          
          <Text style={[styles.counter, { color: getCounterColor() }]}>
            {charCount}/200
          </Text>

          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
              <Text style={styles.cancelButtonText}>CANCEL</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.raiseButton} onPress={handleConfirm}>
              <Text style={styles.raiseButtonText}>RAISE SOS 🆘</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.disclaimer}>
            This SOS will be relayed to all nearby devices via mesh network
          </Text>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: '90%',
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#00ff41',
    padding: 20,
  },
  title: {
    color: '#ff4444',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subtitle: {
    color: '#aaaaaa',
    fontSize: 12,
    marginBottom: 12,
  },
  pillContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  pill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  pillSelected: {
    backgroundColor: '#00ff41',
    borderColor: '#00ff41',
  },
  pillUnselected: {
    backgroundColor: 'transparent',
    borderColor: '#333',
  },
  pillTextSelected: {
    color: '#000000',
  },
  pillTextUnselected: {
    color: '#ffffff',
  },
  descriptionLabel: {
    color: '#aaaaaa',
    fontSize: 12,
    marginTop: 16,
    marginBottom: 4,
  },
  input: {
    backgroundColor: '#0d0d0d',
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 8,
    padding: 12,
    color: '#ffffff',
    fontSize: 14,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  counter: {
    textAlign: 'right',
    fontSize: 12,
    marginTop: 4,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  cancelButton: {
    width: '45%',
    backgroundColor: '#1a1a1a',
    borderWidth: 1,
    borderColor: '#555',
    padding: 14,
    borderRadius: 8,
  },
  cancelButtonText: {
    color: '#aaaaaa',
    textAlign: 'center',
  },
  raiseButton: {
    width: '45%',
    backgroundColor: '#ff2222',
    padding: 14,
    borderRadius: 8,
  },
  raiseButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  disclaimer: {
    color: '#555555',
    fontSize: 10,
    textAlign: 'center',
    marginTop: 8,
  }
});
