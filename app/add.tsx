import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Stack, useRouter } from "expo-router";
import { Heart, Save, X } from "lucide-react-native";
import * as Haptics from "expo-haptics";

// Create a simple TagInput component since the imported one is causing issues
const TagInput = () => {
  const [tags, setTags] = useState(["example", "gpt"]);
  const [inputValue, setInputValue] = useState("");

  const addTag = (tag) => {
    if (tag.trim() !== "" && !tags.includes(tag.trim())) {
      setTags([...tags, tag.trim()]);
      setInputValue("");
    }
  };

  const removeTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  return (
    <View className="mb-4">
      <TextInput
        className="border border-gray-300 rounded-lg p-3 text-base bg-gray-50 mb-2"
        placeholder="Add tags (press space to add)"
        value={inputValue}
        onChangeText={setInputValue}
        onKeyPress={({ nativeEvent }) => {
          if (nativeEvent.key === " ") {
            addTag(inputValue);
          }
        }}
        onSubmitEditing={() => addTag(inputValue)}
      />
      <View className="flex-row flex-wrap">
        {tags.map((tag, index) => (
          <TouchableOpacity
            key={index}
            className="bg-blue-100 rounded-full px-3 py-1 mr-2 mb-2 flex-row items-center"
            onPress={() => removeTag(tag)}
          >
            <Text className="text-blue-800 mr-1">{tag}</Text>
            <Text className="text-blue-800 font-bold">×</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default function AddPromptScreen() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isFavorite, setIsFavorite] = useState(false);

  // Handle save prompt
  const handleSave = () => {
    // This would save the prompt to AsyncStorage
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    router.back();
  };

  // Handle cancel
  const handleCancel = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.back();
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-white"
    >
      <Stack.Screen
        options={{
          title: "Add New Prompt",
          headerRight: () => (
            <TouchableOpacity onPress={handleSave} className="p-2">
              <Save size={24} color="#0284c7" />
            </TouchableOpacity>
          ),
          headerLeft: () => (
            <TouchableOpacity onPress={handleCancel} className="p-2">
              <X size={24} color="#64748b" />
            </TouchableOpacity>
          ),
        }}
      />

      <ScrollView className="flex-1 px-4 pt-4">
        {/* Title Input */}
        <View className="mb-4">
          <Text className="text-lg font-semibold mb-2 text-gray-700">
            Title
          </Text>
          <TextInput
            className="border border-gray-300 rounded-lg p-3 text-base bg-gray-50"
            placeholder="Enter prompt title"
            value={title}
            onChangeText={setTitle}
          />
        </View>

        {/* Content Input */}
        <View className="mb-4">
          <Text className="text-lg font-semibold mb-2 text-gray-700">
            Content
          </Text>
          <TextInput
            className="border border-gray-300 rounded-lg p-3 text-base bg-gray-50"
            placeholder="Enter your prompt content here..."
            value={content}
            onChangeText={setContent}
            multiline
            numberOfLines={8}
            textAlignVertical="top"
          />
        </View>

        {/* Tags Input */}
        <View className="mb-4">
          <Text className="text-lg font-semibold mb-2 text-gray-700">Tags</Text>
          <TagInput />
        </View>

        {/* Favorite Toggle */}
        <TouchableOpacity
          className="flex-row items-center mb-8 p-2"
          onPress={() => setIsFavorite(!isFavorite)}
        >
          <Heart
            size={24}
            color={isFavorite ? "#ef4444" : "#d1d5db"}
            fill={isFavorite ? "#ef4444" : "none"}
          />
          <Text className="ml-2 text-base text-gray-700">
            {isFavorite ? "Remove from favorites" : "Add to favorites"}
          </Text>
        </TouchableOpacity>

        {/* Save Button */}
        <TouchableOpacity
          className="bg-blue-500 py-4 px-6 rounded-lg mb-8"
          onPress={handleSave}
        >
          <Text className="text-white text-center text-lg font-semibold">
            Save Prompt
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
