import { View, Text, StyleSheet, Modal, Pressable, TouchableOpacity } from 'react-native';
import { Colors } from '@/app/constants/colors';
import { MaterialIcons } from '@expo/vector-icons';
import { useState, useEffect } from 'react';
import { useTheme } from '@react-navigation/native';
import { Layouts } from '@/app/database/models/Layouts';
import { useHeaderStore } from '@/app/stores/headerStore';

interface ChangeLayoutDialogProps {
  visible: boolean;
  onClose: () => void;
  onSave: () => void;
}

type TabType = 'my' | 'shared';

interface LayoutItem {
  id: number;
  layout_name: string;
  is_active: boolean;
}

export function ChangeLayoutDialog({ visible, onClose, onSave }: ChangeLayoutDialogProps) {
  const theme = useTheme();
  const selectedCompanyId = useHeaderStore(state => state.selectedCompany);
  const companyLayouts = useHeaderStore(state => state.companyLayouts);
  const setCompanyLayout = useHeaderStore(state => state.setCompanyLayout);
  
  const [activeTab, setActiveTab] = useState<TabType>('my');
  const [selectedLayout, setSelectedLayout] = useState<LayoutItem | null>(null);
  const [myLayouts, setMyLayouts] = useState<LayoutItem[]>([]);
  const [sharedLayouts, setSharedLayouts] = useState<LayoutItem[]>([]);

  useEffect(() => {
    loadLayouts();
  }, [selectedCompanyId]);

  const loadLayouts = async () => {
    try {
      const layouts = await Layouts.getByCompanyId(selectedCompanyId);
      
      // Filter active layouts and separate into my and shared
      const activeLayouts = layouts.filter(layout => layout.is_active);
      
      const myLayoutsList = activeLayouts
        .filter(layout => !layout.is_shared)
        .map(layout => ({
          id: layout.id!,
          layout_name: layout.layout_name!,
          is_active: layout.is_active!
        }));

      const sharedLayoutsList = activeLayouts
        .filter(layout => layout.is_shared)
        .map(layout => ({
          id: layout.id!,
          layout_name: layout.layout_name!,
          is_active: layout.is_active!
        }));

      setMyLayouts(myLayoutsList);
      setSharedLayouts(sharedLayoutsList);

      // Set selected layout based on stored company layout
      const savedLayout = companyLayouts[selectedCompanyId];
      if (savedLayout) {
        const layoutToSelect = [...myLayoutsList, ...sharedLayoutsList]
          .find(l => l.id === savedLayout.layoutId);
        if (layoutToSelect) {
          setSelectedLayout(layoutToSelect);
          setActiveTab(myLayoutsList.some(l => l.id === layoutToSelect.id) ? 'my' : 'shared');
        }
      } else if (activeLayouts.length > 0) {
        // If no saved layout, select the first available layout
        const firstLayout = myLayoutsList[0] || sharedLayoutsList[0];
        setSelectedLayout(firstLayout);
        setActiveTab(myLayoutsList.includes(firstLayout) ? 'my' : 'shared');
      }
    } catch (error) {
      console.error('Error loading layouts:', error);
    }
  };

  const handleLayoutSelect = (layout: LayoutItem) => {
    setSelectedLayout(layout);
    setCompanyLayout(selectedCompanyId, layout.id, layout.layout_name);
  };

  const layouts = activeTab === 'my' ? myLayouts : sharedLayouts;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={[styles.container, { 
          backgroundColor: theme.colors.background,
          borderColor: theme.colors.border
        }]}>
          <View style={styles.header}>
            <View>
              <Text style={[styles.title, { color: theme.colors.text }]}>Change Layout</Text>
              <Text style={[styles.subtitle, { color: theme.colors.text }]}>
                Configure layout for this report
              </Text>
            </View>
            <Pressable onPress={onClose} style={styles.closeButton}>
              <MaterialIcons name="close" size={24} color="#666" />
            </Pressable>
          </View>

          <View style={styles.tabsContainer}>
            <TouchableOpacity 
              style={[styles.tab, activeTab === 'my' && styles.activeTab]}
              onPress={() => setActiveTab('my')}
            >
              <Text style={[styles.tabText, activeTab === 'my' && styles.activeTabText]}>
                My Layouts ({myLayouts.length})
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.tab, activeTab === 'shared' && styles.activeTab]}
              onPress={() => setActiveTab('shared')}
            >
              <Text style={[styles.tabText, activeTab === 'shared' && styles.activeTabText]}>
                Shared Layouts ({sharedLayouts.length})
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.layoutList}>
            {layouts.map((layout) => (
              <TouchableOpacity 
                key={layout.id}
                style={[
                  styles.layoutItem,
                  selectedLayout?.id === layout.id && styles.selectedLayout
                ]}
                onPress={() => handleLayoutSelect(layout)}
              >
                <Text style={styles.layoutName}>{layout.layout_name}</Text>
                {selectedLayout?.id === layout.id && (
                  <MaterialIcons name="check-circle" size={24} color={Colors.primary} />
                )}
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.footer}>
            <TouchableOpacity 
              style={styles.closeBtn} 
              onPress={onClose}
            >
              <Text style={styles.closeBtnText}>Close</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.saveBtn}
              onPress={onSave}
            >
              <Text style={styles.saveBtnText}>Save changes</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '10%',
  },
  container: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    width: '100%',
    maxWidth: 600,
    padding: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.black,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.gray[500],
  },
  closeButton: {
    padding: 4,
  },
  tabsContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray[200],
    marginBottom: 24,
  },
  tab: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    marginRight: 16,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: Colors.primary,
  },
  tabText: {
    fontSize: 16,
    color: Colors.gray[500],
  },
  activeTabText: {
    color: Colors.primary,
    fontWeight: '600',
  },
  layoutList: {
    gap: 12,
    marginBottom: 24,
  },
  layoutItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: Colors.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.gray[200],
  },
  selectedLayout: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary + '08', // 3% opacity
  },
  layoutName: {
    fontSize: 16,
    color: Colors.black,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 8,
  },
  closeBtn: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  closeBtnText: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  saveBtn: {
    backgroundColor: Colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  saveBtnText: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: '600',
  },
}); 