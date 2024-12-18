import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Pressable } from 'react-native';
import { actions, RichEditor, RichToolbar } from 'react-native-pell-rich-editor';
import { Feather, MaterialIcons } from '@expo/vector-icons';
import { Colors } from '@/app/constants/colors';
import { Input } from '../../../common/Input';
import { Button } from '@/app/components/common/Button';

interface Template {
  id: string;
  content: string;
  title: string;
}

const TOKENS = [
  { label: 'Customer Name', value: '{{CUSTOMER_NAME}}' },
  { label: 'Project Address', value: '{{PROJECT_ADDRESS}}' },
  { label: 'Quote Date', value: '{{QUOTE_DATE}}' },
  { label: 'Quote Number', value: '{{QUOTE_NUMBER}}' },
  { label: 'Total Amount', value: '{{TOTAL_AMOUNT}}' },
];

export function IntroductionPage() {
  const [editorContent, setEditorContent] = useState('');
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [introTitle, setIntroTitle] = useState('Introduction');
  const [showTokens, setShowTokens] = useState(false);
  const editorRef = useRef<RichEditor>(null);
  const tokenButtonRef = useRef<View>(null);
  
  const handleSaveTemplate = () => {
    // Implement save template logic
    if (editorContent) {
      const newTemplate: Template = {
        id: Date.now().toString(),
        content: editorContent,
        title: `Template ${Date.now()}`
      };
      // Save to storage or state management
      console.log('Saving template:', newTemplate);
    }
  };

  const handleViewTemplates = () => {
    // Implement view templates logic
    console.log('Viewing templates');
  };

  const insertToken = (token: string) => {
    editorRef.current?.insertHTML(token);
    setShowTokens(false);
  };

  return (
    <Pressable style={styles.container} onPress={() => setShowTokens(false)}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          {isEditingTitle ? (
            <Input
              value={introTitle}
              onChangeText={setIntroTitle}
              onBlur={() => setIsEditingTitle(false)}
              autoFocus
              style={styles.titleInput}
            />
          ) : (
            <>
              <Text style={styles.title}>{introTitle}</Text>
              <TouchableOpacity onPress={() => setIsEditingTitle(true)}>
                <Feather name="edit-2" size={16} color={Colors.primary} />
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>

      <View style={styles.templatesRow}>
        <Text style={styles.savedTemplatesText}>You have saved templates.</Text>
        <TouchableOpacity onPress={handleViewTemplates}>
          <Text style={styles.link}>View templates</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.editorContainer}>
        <View style={styles.toolbarContainer}>
          <View style={styles.tokenContainer} ref={tokenButtonRef}>
            <Pressable 
              style={styles.tokenButton}
              onPress={(e) => {
                e.stopPropagation();
                setShowTokens(!showTokens);
              }}
            >
              <MaterialIcons 
                name={showTokens ? "expand-less" : "expand-more"} 
                size={24} 
                color={Colors.black} 
              />
              <Text style={styles.tokenButtonText}>Insert Token</Text>
            </Pressable>
            {showTokens && (
              <View style={styles.tokenDropdown}>
                {TOKENS.map((token, index) => (
                  <Pressable
                    key={index}
                    style={styles.tokenItem}
                    onPress={(e) => {
                      e.stopPropagation();
                      insertToken(token.value);
                    }}
                  >
                    <Text style={styles.tokenText}>{token.label}</Text>
                  </Pressable>
                ))}
              </View>
            )}
          </View>
          <RichToolbar
            editor={editorRef}
            actions={[
              actions.setBold,
              actions.setItalic,
              actions.setUnderline,
              actions.insertBulletsList,
              actions.insertOrderedList,
              actions.setStrikethrough,
              actions.blockquote
            ]}
            selectedIconTint={Colors.primary}
            disabledTextTint={Colors.black}
            iconTint={Colors.black}
            style={styles.toolbar}
            iconContainerStyle={styles.toolbarIcon}
          />
        </View>
        
        <RichEditor
          ref={editorRef}
          onChange={setEditorContent}
          placeholder="Start typing your introduction..."
          style={styles.editor}
          initialFocus={false}
          useContainer={true}
          initialHeight={400}
          editorStyle={{
            backgroundColor: '#fff',
            contentCSSText: 'font-size: 16px; min-height: 200px;'
          }}
          disabled={false}
        />
      </View>

      <View style={styles.buttonContainer}>
        <Button 
          label="Save as template"
          onPress={handleSaveTemplate}
          variant="primary"
          size="small"
        />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  titleInput: {
    flex: 1,
    fontSize: 24,
    fontWeight: 'bold',
  },
  templatesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 20,
  },
  savedTemplatesText: {
    color: Colors.black,
  },
  link: {
    color: '#6366f1',
  },
  editorContainer: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    overflow: 'hidden',
  },
  toolbarContainer: {
    flexDirection: 'row',
    backgroundColor: '#f9fafb',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  toolbar: {
    flex: 1,
    backgroundColor: 'transparent',
    alignItems: 'flex-start',
  },
  toolbarIcon: {
    justifyContent: 'flex-start',
  },
  tokenContainer: {
    borderRightWidth: 1,
    borderRightColor: '#e5e7eb',
    position: 'relative',
  },
  tokenButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    gap: 4,
  },
  tokenButtonText: {
    color: Colors.black,
    fontSize: 14,
  },
  tokenDropdown: {
    position: 'absolute',
    top: '100%',
    left: 0,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 4,
    width: 200,
    zIndex: 1000,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  tokenItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  tokenText: {
    fontSize: 14,
    color: Colors.black,
  },
  editor: {
    flex: 1,
    padding: 12,
  },
  buttonContainer: {
    marginTop: 16,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  }
});