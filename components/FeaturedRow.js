import { View, Text, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import * as Icons from "react-native-heroicons/outline";
import RestaurantCard from './RestaurantCard';
import sanityCLient from '../sanity';

const FeaturedRow = ({ id, title, description }) => {

    const [restaurants, setRestaurants] = useState([]);

    useEffect(() => {
        sanityCLient.fetch(`
            *[_type == "featured" && _id == $id] {
                ...,
                restaurants[]-> {
                    ...,
                    dishes[]->,
                    type-> {
                        name
                    }
                },
            }[0]
        `, { id }).then(data => {
            setRestaurants(data?.restaurants);
        });
    }, []);

    return (
        <View>
            <View className="mt-4 flex-row items-center justify-between px-4">
                <Text className="font-bold text-lg">{title}</Text>
                <Icons.ArrowRightIcon color="#00CCBB"/>
            </View>

            <Text className="text-xs text-gray-500 px-4">{description}</Text>
            
            <ScrollView
                horizontal 
                contentContainerStyle={{
                    paddingHorizontal: 15,
                }}
                className="pt-4" 
                showsHorizontalScrollIndicator={false}
            >
                {/* RestaurandCards... */}
                {restaurants?.map((restaurant) => (
                    <RestaurantCard 
                        key={restaurant._id}
                        id={restaurant._id}
                        imgUrl={restaurant.image}
                        title={restaurant.name}
                        rating={restaurant.rating}
                        genre={restaurant.type?.name}
                        address={restaurant.adress}
                        short_description={restaurant.short_description}
                        dishes={restaurant.dishes}
                        long={restaurant.long}
                        lat={restaurant.lat}
                    />
                ))}
            </ScrollView>
        </View>
    )
}

export default FeaturedRow