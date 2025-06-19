import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { X } from "lucide-react-native";

interface TagInputProps {
  tags: string[];
  onTagsChange: (tags: string[]) => void;
  existingTags?: string[];
  placeholder?: string;
}

const TagInput = ({
  tags = [],
  onTagsChange = () => {},
  existingTags = [
    "React",
    "JavaScript",
    "TypeScript",
    "Mobile",
    "Web",
    "AI",
    "Prompt",
  ],
  placeholder = "Add tags...",
}: TagInputProps) => {
  const [inputValue, setInputValue] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    if (inputValue.trim()) {
      const filtered = existingTags.filter(
        (tag) =>
          tag.toLowerCase().includes(inputValue.toLowerCase()) &&
          !tags.includes(tag),
      );
      setSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [inputValue, existingTags, tags]);

  const handleAddTag = (tag: string) => {
    if (tag.trim() && !tags.includes(tag)) {
      onTagsChange([...tags, tag]);
      setInputValue("");
      setShowSuggestions(false);
    }
  };

  const handleRemoveTag = (index: number) => {
    const newTags = [...tags];
    newTags.splice(index, 1);
    onTagsChange(newTags);
  };

  const handleKeyPress = (e: any) => {
    if (e.nativeEvent.key === "Enter" && inputValue.trim()) {
      handleAddTag(inputValue.trim());
    }
  };

  return (
    <View className="bg-white p-4 rounded-lg border border-gray-200 w-full">
      <Text className="text-base font-medium mb-2 text-gray-800">Tags</Text>

      {/* Tags display */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="mb-2 flex-row flex-wrap"
      >
        {tags.map((tag, index) => (
          <TouchableOpacity
            key={index}
            className="bg-blue-100 rounded-full px-3 py-1 mr-2 mb-2 flex-row items-center"
            onPress={() => handleRemoveTag(index)}
          >
            <Text className="text-blue-800 mr-1">{tag}</Text>
            <X size={14} color="#1e40af" />
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Tag input */}
      <View className="relative">
        <TextInput
          className="border border-gray-300 rounded-md px-3 py-2 w-full"
          value={inputValue}
          onChangeText={setInputValue}
          placeholder={placeholder}
          onKeyPress={handleKeyPress}
          onSubmitEditing={() => handleAddTag(inputValue)}
          onFocus={() => setShowSuggestions(inputValue.trim().length > 0)}
        />

        {/* Autocomplete suggestions */}
        {showSuggestions && (
          <View className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-md mt-1 z-10 max-h-40">
            <ScrollView>
              {suggestions.map((suggestion, index) => (
                <TouchableOpacity
                  key={index}
                  className="px-3 py-2 border-b border-gray-100"
                  onPress={() => {
                    handleAddTag(suggestion);
                    setShowSuggestions(false);
                  }}
                >
                  <Text>{suggestion}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}
      </View>
    </View>
  );
};

export default TagInput;
