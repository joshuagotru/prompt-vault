import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Link, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Search, Plus, ChevronDown } from "lucide-react-native";
import PromptCard from "../components/PromptCard";

type Prompt = {
  id: string;
  title: string;
  content: string;
  tags: string[];
  isFavorite: boolean;
  createdAt: string;
  updatedAt: string;
};

export default function HomeScreen() {
  const router = useRouter();
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("newest");
  const [showSortOptions, setShowSortOptions] = useState(false);

  useEffect(() => {
    loadPrompts();
  }, []);

  const loadPrompts = async () => {
    try {
      const promptsData = await AsyncStorage.getItem("prompts");
      if (promptsData) {
        setPrompts(JSON.parse(promptsData));
      } else {
        // Set some sample data for demonstration
        const samplePrompts: Prompt[] = [
          {
            id: "1",
            title: "Creative Writing Assistant",
            content:
              "I want you to act as a creative writing assistant who helps me brainstorm engaging story ideas...",
            tags: ["writing", "creative"],
            isFavorite: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          {
            id: "2",
            title: "Code Reviewer",
            content:
              "Act as a senior developer reviewing my code. Provide feedback on best practices, potential bugs...",
            tags: ["coding", "review"],
            isFavorite: false,
            createdAt: new Date(Date.now() - 86400000).toISOString(),
            updatedAt: new Date(Date.now() - 86400000).toISOString(),
          },
          {
            id: "3",
            title: "Travel Planner",
            content:
              "I want you to act as a travel planner for my upcoming trip to [destination]...",
            tags: ["travel", "planning"],
            isFavorite: true,
            createdAt: new Date(Date.now() - 172800000).toISOString(),
            updatedAt: new Date(Date.now() - 172800000).toISOString(),
          },
        ];
        await AsyncStorage.setItem("prompts", JSON.stringify(samplePrompts));
        setPrompts(samplePrompts);
      }
    } catch (error) {
      console.error("Failed to load prompts:", error);
    }
  };

  const toggleFavorite = async (id: string) => {
    const updatedPrompts = prompts.map((prompt) => {
      if (prompt.id === id) {
        return { ...prompt, isFavorite: !prompt.isFavorite };
      }
      return prompt;
    });

    setPrompts(updatedPrompts);
    try {
      await AsyncStorage.setItem("prompts", JSON.stringify(updatedPrompts));
    } catch (error) {
      console.error("Failed to update favorite status:", error);
    }
  };

  const filteredPrompts = prompts.filter((prompt) => {
    const matchesSearch =
      prompt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prompt.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prompt.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase()),
      );

    return matchesSearch;
  });

  const sortedPrompts = [...filteredPrompts].sort((a, b) => {
    if (sortOption === "newest") {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    } else if (sortOption === "oldest") {
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    } else if (sortOption === "favorites") {
      return Number(b.isFavorite) - Number(a.isFavorite);
    }
    return 0;
  });

  return (
    <View className="flex-1 bg-gray-100">
      <StatusBar style="auto" />

      {/* Header */}
      <View className="bg-blue-500 pt-12 pb-4 px-4">
        <Text className="text-2xl font-bold text-white mb-4">
          Prompt Manager
        </Text>

        {/* Search Bar */}
        <View className="flex-row items-center bg-white rounded-lg px-3 py-2">
          <Search size={20} color="#6b7280" />
          <TextInput
            className="flex-1 ml-2 text-base"
            placeholder="Search prompts..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Sort Options */}
        <View className="mt-3">
          <TouchableOpacity
            className="flex-row items-center"
            onPress={() => setShowSortOptions(!showSortOptions)}
          >
            <Text className="text-white mr-1">Sort by: {sortOption}</Text>
            <ChevronDown size={16} color="white" />
          </TouchableOpacity>

          {showSortOptions && (
            <View className="bg-white rounded-md mt-1 absolute top-6 left-0 z-10 w-40 shadow-md">
              <TouchableOpacity
                className="px-4 py-2 border-b border-gray-200"
                onPress={() => {
                  setSortOption("newest");
                  setShowSortOptions(false);
                }}
              >
                <Text>Newest</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="px-4 py-2 border-b border-gray-200"
                onPress={() => {
                  setSortOption("oldest");
                  setShowSortOptions(false);
                }}
              >
                <Text>Oldest</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="px-4 py-2"
                onPress={() => {
                  setSortOption("favorites");
                  setShowSortOptions(false);
                }}
              >
                <Text>Favorites</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>

      {/* Prompt List */}
      <ScrollView className="flex-1 px-4 pt-4">
        {sortedPrompts.length > 0 ? (
          sortedPrompts.map((prompt) => (
            <PromptCard
              key={prompt.id}
              prompt={prompt}
              onToggleFavorite={() => toggleFavorite(prompt.id)}
              onPress={() =>
                router.push({
                  pathname: "/edit",
                  params: { id: prompt.id },
                })
              }
            />
          ))
        ) : (
          <View className="flex-1 items-center justify-center py-20">
            <Text className="text-gray-500 text-lg">No prompts found</Text>
            <Text className="text-gray-400 mt-2">
              Add your first prompt using the + button
            </Text>
          </View>
        )}
        <View className="h-20" />
      </ScrollView>

      {/* Floating Action Button */}
      <Link href="/add" asChild>
        <TouchableOpacity className="absolute bottom-6 right-6 bg-blue-500 w-14 h-14 rounded-full items-center justify-center shadow-lg">
          <Plus size={24} color="white" />
        </TouchableOpacity>
      </Link>
    </View>
  );
}
