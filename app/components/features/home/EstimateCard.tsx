import { View, Text, StyleSheet, Image, TouchableOpacity, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors } from '@/app/constants/colors';
import { useState } from 'react';
import { router, useRouter } from 'expo-router';
import { Estimate } from '@/app/types/estimate';
import { getHouseImage } from '@/app/utils/houseImages';

interface EstimateCardProps {
  estimate: Estimate;
  index: number;
  onStatusChange?: (estimateId: string, newStatus: Estimate['status']) => Promise<void>;
}

export function EstimateCard({ estimate, index, onStatusChange }: EstimateCardProps) {
  const router = useRouter();
  const [isSyncing, setIsSyncing] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [currentStatus, setCurrentStatus] = useState<Estimate['status']>(estimate.status);

  const houseImage = getHouseImage(estimate.id);

  const handleStatusChange = async (newStatus: Estimate['status']) => {
    try {
      setIsSyncing(true);
      if (onStatusChange) {
        await onStatusChange(estimate.id, newStatus);
        setCurrentStatus(newStatus);
      }
      setShowStatusDropdown(false);
    } catch (error) {
      console.error('Failed to update status:', error);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleSync = async () => {
    setIsSyncing(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSyncing(false);
  };

  const handleCardPress = () => {
    router.push({
      pathname: '/estimate',
      params: { 
        estimateData: JSON.stringify(estimate),
        estimateId: estimate.id
      }
    });
  };

  const getStatusTextColor = (status: Estimate['status']) => {
    switch (status) {
      case 'provided':
        return '#B45309';
      case 'requested':
        return '#1E3A8A';
      case 'accepted':
        return '#166534';
      case 'completed':
        return '#047857';
      case 'revised':
        return '#9A3412';
      case 'cancelled':
        return '#B91C1C';
      default:
        return Colors.primary;
    }
  };

  return (
    <Pressable style={styles.card} onPress={handleCardPress}>
      <View style={styles.imageContainer}>
        <Image 
          source={houseImage}
          style={styles.houseImage}
          resizeMode="cover"
        />
      </View>
      
      <View style={styles.contentContainer}>
        <View style={styles.header}>
          <Text style={styles.customerName} numberOfLines={1}>{estimate.customerName}</Text>
        </View>

        <View style={styles.content}>
          <View style={styles.infoRow}>
            <MaterialIcons name="location-on" size={18} color={Colors.primary} />
            <Text style={styles.infoText} numberOfLines={2}>{estimate.address}</Text>
          </View>
          <View style={styles.infoRow}>
            <MaterialIcons name="event" size={18} color={Colors.primary} />
            <Text style={styles.infoText}>{estimate.date}</Text>
          </View>
        </View>

        <View style={styles.footer}>
          <TouchableOpacity 
            style={[styles.statusButton, styles[`status_${currentStatus}`]]}
            onPress={() => setShowStatusDropdown(!showStatusDropdown)}
          >
            <Text style={[styles.statusText, { color: getStatusTextColor(currentStatus) }]}>
              {currentStatus.replace('_', ' ').toUpperCase()}
            </Text>
            <MaterialIcons name="edit" size={16} color={getStatusTextColor(currentStatus)} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.syncButton, isSyncing && styles.syncButtonDisabled]}
            onPress={handleSync}
            disabled={isSyncing}
          >
            <MaterialIcons 
              name="upload" 
              size={18} 
              color={Colors.white}
              style={[isSyncing && styles.rotating]} 
            />
            <Text style={styles.syncButtonText}>
              {isSyncing ? 'Uploading...' : 'Upload'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {showStatusDropdown && (
        <View style={styles.dropdown}>
          {['provided', 'requested', 'accepted', 'completed', 'revised', 'cancelled'].map((s) => (
            <TouchableOpacity 
              key={s}
              style={[styles.dropdownItem, currentStatus === s && styles.dropdownItemActive]}
              onPress={() => handleStatusChange(s as Estimate['status'])}
            >
              <Text style={[styles.dropdownText, currentStatus === s && styles.dropdownTextActive]}>
                {s.replace('_', ' ').charAt(0).toUpperCase() + s.slice(1).replace('_', ' ')}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    width: '32%',
    height: 420,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    marginBottom: 24,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  imageContainer: {
    width: '100%',
    height: 200,
    position: 'relative',
  },
  houseImage: {
    width: '100%',
    height: '100%',
  },
  contentContainer: {
    padding: 16,
    flex: 1,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  customerName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.primary,
    flex: 1,
  },
  statusButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  status_provided: {
    backgroundColor: 'rgba(255, 243, 220, 0.95)',
    borderColor: '#FFB020',
  },
  status_requested: {
    backgroundColor: 'rgba(229, 231, 255, 0.95)',
    borderColor: '#4051B5',
  },
  status_accepted: {
    backgroundColor: 'rgba(220, 255, 231, 0.95)',
    borderColor: '#2E7D32',
  },
  status_completed: {
    backgroundColor: 'rgba(187, 247, 208, 0.95)',
    borderColor: '#059669',
  },
  status_revised: {
    backgroundColor: 'rgba(254, 226, 226, 0.95)',
    borderColor: '#EA580C',
  },
  status_cancelled: {
    backgroundColor: 'rgba(254, 202, 202, 0.95)',
    borderColor: '#DC2626',
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  editButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
  },
  content: {
    gap: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  infoText: {
    fontSize: 14,
    color: '#444',
    flex: 1,
    lineHeight: 20,
  },
  syncButton: {
    flex: 1,
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 12,
    gap: 8,
  },
  syncButtonDisabled: {
    opacity: 0.8,
  },
  syncButtonText: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: '600',
  },
  rotating: {
    transform: [{ rotate: '45deg' }],
  },
  dropdown: {
    position: 'absolute',
    bottom: 76,
    left: 16,
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 6,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
    zIndex: 1000,
    width: '45%',
  },
  dropdownItem: {
    padding: 10,
    borderRadius: 8,
  },
  dropdownItemActive: {
    backgroundColor: Colors.primary + '15',
  },
  dropdownText: {
    fontSize: 13,
    color: '#444',
    textAlign: 'center',
  },
  dropdownTextActive: {
    color: Colors.primary,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    marginTop: 16,
  },
});