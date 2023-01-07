import { View, Text, Image, ScrollView } from 'react-native'
import React, { useLayoutEffect, useState, useEffect } from 'react'
import { useNavigation } from '@react-navigation/native'
import { SafeAreaView } from 'react-native-safe-area-context'
import * as Icons from "react-native-heroicons/outline";
import { TextInput } from 'react-native-gesture-handler';
import Categories from '../components/Categories';
import FeaturedRow from '../components/FeaturedRow';
import sanityClient from '../sanity';

const HomeScreen = () => {

    const navigation = useNavigation();
    const [featuredCategories, setFeaturedCategories] = useState([]);

    useLayoutEffect(() => {
        navigation.setOptions({
            // Remover o header
            headerShown: false,
        })
    }, [])

    useEffect(() => {
        sanityClient.fetch(`
            *[_type == "featured"] {
                ...,
                restaurant[]->{
                    ...,
                    dish[]->
                }
            }
        `).then(data => {
            setFeaturedCategories(data);
        })
    }, [])

    return (
        <SafeAreaView className="bg-white pt-5">
            {/* Header */}
            <View className="flex-row pb-3 items-center mx-4 space-x-2">
                <Image 
                    source={{ uri: 'https://links.papareact.com/wru' }}
                    className="h-7 w-7 bg-gray-300 p-4 rounded-full"
                />

                <View className="flex-1">
                    <Text className="font-bold text-gray-400 text-xs">Deliver Now!</Text>
                    <Text className="font-bold text-xl">
                        Current Location
                        <Icons.ChevronDownIcon size={20} color="#00CCBB"/>
                    </Text>
                </View>

                <Icons.UserIcon size={35} color="#00BBCC" />
            </View>

            {/* Search */}
            <View className="flex-row items-center space-x-2 pb-2 mx-4">
                <View className="flex-row flex-1 space-x-2 bg-gray-200 p-3 items-center rounded-md">
                    <Icons.MagnifyingGlassIcon color="gray" size={20}/>
                    <TextInput placeholder='Restaurants and cuisines' keyboardType='default'/>
                </View>
                <Icons.AdjustmentsVerticalIcon color="#00CCBB" />
            </View>

            {/* Body */}
            <ScrollView className="bg-gray-100"
                contentContainerStyle={{
                    paddingBottom: 150,
                }}
            >
                {/* Categories */}
                <Categories />

                {/* Featured */}

                {featuredCategories?.map(category => (
                    <FeaturedRow
                        key={category._id}
                        id={category._id}
                        title={category.name}
                        description={category.short_description}
                    />
                ))}
            </ScrollView>

        </SafeAreaView>
    )
}

export default HomeScreen