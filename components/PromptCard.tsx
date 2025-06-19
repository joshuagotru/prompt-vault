import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { Heart } from "lucide-react-native";

interface Tag {
  id: string;
  name: string;
}

interface PromptCardProps {
  prompt?: {
    id: string;
    title: string;
    content: string;
    tags: string[];
    isFavorite: boolean;
    createdAt: string;
    updatedAt: string;
  };
  onToggleFavorite?: () => void;
  onPress?: () => void;
}

const PromptCard = ({
  prompt = {
    id: "prompt-1",
    title: "Sample Prompt Title",
    content:
      "This is a sample prompt content that demonstrates what a prompt might look like in the app. Tap to edit this prompt.",
    tags: ["writing", "creative"],
    isFavorite: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  onToggleFavorite = () => {},
  onPress = () => {},
}: PromptCardProps) => {
  // Format the date to a readable string
  const formattedDate = new Date(prompt.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  // Truncate content if it's too long
  const truncatedContent =
    prompt.content.length > 100
      ? `${prompt.content.substring(0, 100)}...`
      : prompt.content;

  const handleCardPress = () => {
    onPress();
  };

  const handleFavoritePress = (e: any) => {
    e.stopPropagation(); // Prevent card press event
    onToggleFavorite();
  };

  return (
    <TouchableOpacity
      onPress={handleCardPress}
      className="bg-white rounded-lg p-4 mb-3 shadow-sm border border-gray-100"
      activeOpacity={0.7}
    >
      <View className="flex-row justify-between items-start">
        <Text className="text-lg font-bold text-gray-800 flex-1 mr-2">
          {prompt.title}
        </Text>
        <TouchableOpacity
          onPress={handleFavoritePress}
          hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
        >
          <Heart
            size={20}
            color={prompt.isFavorite ? "#f43f5e" : "#d1d5db"}
            fill={prompt.isFavorite ? "#f43f5e" : "transparent"}
          />
        </TouchableOpacity>
      </View>

      <Text className="text-gray-600 mt-1 mb-2">{truncatedContent}</Text>

      <View className="flex-row justify-between items-center mt-2">
        <View className="flex-row flex-wrap">
          {prompt.tags.map((tag, index) => (
            <View
              key={index}
              className="bg-blue-100 rounded-full px-2 py-1 mr-2 mb-1"
            >
              <Text className="text-xs text-blue-800">#{tag}</Text>
            </View>
          ))}
        </View>
        <Text className="text-xs text-gray-400">{formattedDate}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default PromptCard;
