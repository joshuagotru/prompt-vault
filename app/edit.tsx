import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, Alert } from "react-native";
import { TextInput } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Heart, ArrowLeft, Trash2 } from "lucide-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface Prompt {
  id: string;
  title: string;
  content: string;
  tags: string[];
  isFavorite: boolean;
  createdAt: string;
  updatedAt: string;
}

// Simple tag input implementation since we can't import the component
const TagInput = ({ tags = [], onTagsChange = () => {} }) => {
  const [inputValue, setInputValue] = useState("");

  const handleAddTag = () => {
    if (inputValue.trim() !== "" && !tags.includes(inputValue.trim())) {
      const newTags = [...tags, inputValue.trim()];
      onTagsChange(newTags);
      setInputValue("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    const newTags = tags.filter((tag) => tag !== tagToRemove);
    onTagsChange(newTags);
  };

  return (
    <View className="mb-2">
      <View className="flex-row items-center mb-2">
        <TextInput
          className="flex-1 border border-gray-300 rounded-md p-2 mr-2 bg-white"
          value={inputValue}
          onChangeText={setInputValue}
          placeholder="Add a tag"
          onSubmitEditing={handleAddTag}
        />
        <TouchableOpacity
          onPress={handleAddTag}
          className="px-3 py-2 bg-blue-500 rounded-md"
        >
          <Text className="text-white">Add</Text>
        </TouchableOpacity>
      </View>
      <View className="flex-row flex-wrap">
        {tags.map((tag, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => handleRemoveTag(tag)}
            className="bg-gray-200 rounded-full px-3 py-1 mr-2 mb-2 flex-row items-center"
          >
            <Text className="text-gray-800">{tag}</Text>
            <Text className="ml-1 text-gray-600">×</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default function EditScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const [prompt, setPrompt] = useState<Prompt>({
    id: id || "default-id",
    title: "",
    content: "",
    tags: [],
    isFavorite: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadPrompt = async () => {
      try {
        if (id) {
          const storedPrompts = await AsyncStorage.getItem("prompts");
          if (storedPrompts) {
            const prompts: Prompt[] = JSON.parse(storedPrompts);
            const foundPrompt = prompts.find((p) => p.id === id);
            if (foundPrompt) {
              setPrompt(foundPrompt);
            }
          }
        }
      } catch (error) {
        console.error("Failed to load prompt:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPrompt();
  }, [id]);

  const handleSave = async () => {
    try {
      const updatedPrompt = {
        ...prompt,
        updatedAt: new Date().toISOString(),
      };

      const storedPrompts = await AsyncStorage.getItem("prompts");
      let prompts: Prompt[] = storedPrompts ? JSON.parse(storedPrompts) : [];

      const index = prompts.findIndex((p) => p.id === id);
      if (index !== -1) {
        prompts[index] = updatedPrompt;
      } else {
        prompts.push(updatedPrompt);
      }

      await AsyncStorage.setItem("prompts", JSON.stringify(prompts));
      router.back();
    } catch (error) {
      console.error("Failed to save prompt:", error);
      Alert.alert("Error", "Failed to save prompt");
    }
  };

  const handleDelete = () => {
    Alert.alert(
      "Delete Prompt",
      "Are you sure you want to delete this prompt?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const storedPrompts = await AsyncStorage.getItem("prompts");
              if (storedPrompts) {
                let prompts: Prompt[] = JSON.parse(storedPrompts);
                prompts = prompts.filter((p) => p.id !== id);
                await AsyncStorage.setItem("prompts", JSON.stringify(prompts));
              }
              router.back();
            } catch (error) {
              console.error("Failed to delete prompt:", error);
              Alert.alert("Error", "Failed to delete prompt");
            }
          },
        },
      ],
    );
  };

  const toggleFavorite = () => {
    setPrompt((prev) => ({
      ...prev,
      isFavorite: !prev.isFavorite,
    }));
  };

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center justify-between p-4 border-b border-gray-200">
        <TouchableOpacity onPress={() => router.back()} className="p-2">
          <ArrowLeft size={24} color="#000" />
        </TouchableOpacity>
        <Text className="text-xl font-bold">Edit Prompt</Text>
        <TouchableOpacity
          onPress={handleSave}
          className="px-4 py-2 bg-blue-500 rounded-md"
        >
          <Text className="text-white font-medium">Save</Text>
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1 p-4">
        {/* Title Input */}
        <View className="mb-4">
          <Text className="text-sm font-medium mb-1 text-gray-700">Title</Text>
          <TextInput
            className="border border-gray-300 rounded-md p-3 bg-white"
            value={prompt.title}
            onChangeText={(text) =>
              setPrompt((prev) => ({ ...prev, title: text }))
            }
            placeholder="Enter prompt title"
          />
        </View>

        {/* Content Input */}
        <View className="mb-4">
          <Text className="text-sm font-medium mb-1 text-gray-700">
            Content
          </Text>
          <TextInput
            className="border border-gray-300 rounded-md p-3 bg-white h-40"
            value={prompt.content}
            onChangeText={(text) =>
              setPrompt((prev) => ({ ...prev, content: text }))
            }
            placeholder="Enter prompt content"
            multiline
            textAlignVertical="top"
          />
        </View>

        {/* Tags Input */}
        <View className="mb-4">
          <Text className="text-sm font-medium mb-1 text-gray-700">Tags</Text>
          <TagInput
            tags={prompt.tags}
            onTagsChange={(tags) => setPrompt((prev) => ({ ...prev, tags }))}
          />
        </View>

        {/* Favorite Toggle */}
        <TouchableOpacity
          onPress={toggleFavorite}
          className="flex-row items-center mb-6 p-2"
        >
          <Heart
            size={24}
            color={prompt.isFavorite ? "#f43f5e" : "#d1d5db"}
            fill={prompt.isFavorite ? "#f43f5e" : "none"}
          />
          <Text className="ml-2 text-gray-700">
            {prompt.isFavorite ? "Remove from favorites" : "Add to favorites"}
          </Text>
        </TouchableOpacity>

        {/* Delete Button */}
        <TouchableOpacity
          onPress={handleDelete}
          className="flex-row items-center justify-center p-3 bg-red-100 rounded-md mt-6"
        >
          <Trash2 size={20} color="#ef4444" />
          <Text className="ml-2 text-red-600 font-medium">Delete Prompt</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
