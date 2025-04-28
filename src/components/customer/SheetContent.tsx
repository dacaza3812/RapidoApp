import { View, Text, TouchableOpacity, Image, Linking, StyleSheet, Dimensions, ScrollView } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { uiStyles } from '@/styles/uiStyles';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { RFValue } from 'react-native-responsive-fontsize';
import CustomText from '../shared/CustomText';
import { commonStyles } from '@/styles/commonStyles';
import axios from 'axios';
import { BASE_URL } from '@/service/config';
import { Banners } from '@/utils/types';
import { useUserStore } from '@/store/userStore';
import { Colors } from '@/utils/Constants';
import { useBannersByCity } from '@/service/useBannersByCity';
import { customEvent, onAppCompleteRideAndBeginCheckout, onSelectitem } from '@/lib/events';

export const cubes = [
  { name: "Moto", imageUri: require("@/assets/icons/bike.png") },
  { name: "Auto", imageUri: require("@/assets/icons/auto.png") },
  { name: "Auto Económico", imageUri: require("@/assets/icons/cab.png") },
  { name: "Paquete", imageUri: require("@/assets/icons/parcel.png") },
  { name: "Auto Premium", imageUri: require("@/assets/icons/cab_premium.png") },
];



const SheetContent = () => {
  const { banners, getBannersByCity, location, provincy } = useBannersByCity();
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const { width: screenWidth } = Dimensions.get('window');
  useEffect(() => {
    getBannersByCity();
  }, [location]);

  // Auto-scroll cada 5 segundos
  useEffect(() => {
    if (banners.length > 0) {
      const intervalId = setInterval(() => {
        const nextIndex = (currentBannerIndex + 1) % banners.length;
        setCurrentBannerIndex(nextIndex);
        scrollViewRef.current?.scrollTo({ x: nextIndex * screenWidth, animated: true });
      }, 5000);
      return () => clearInterval(intervalId);
    }
  }, [banners, currentBannerIndex, screenWidth]);

  // Actualiza el índice cuando el usuario hace swipe manual
  const handleMomentumScrollEnd = (event: any) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / screenWidth);
    setCurrentBannerIndex(index);
  };

  const handlePressBanner = async (link: string) => {
    if (link) {
      Linking.openURL(link).catch((err) => console.error("Error al abrir el link:", err));
      await customEvent({
        eventName: "banner_click",
        payload: {
          link: link,
          city: location?.address,
          province: provincy,
        },
      })
    }
  };
  type itemNavigation = {
    name: string;
    imageUri: any;
  }
  const handleNavigateCubes = async ( item : itemNavigation) => {
    await customEvent({
      eventName: "cubes_click",
      payload: {
        city: location?.address,
        province: provincy,
        item: item.name,
        imageUri: item.imageUri,
      },
    })

    await onAppCompleteRideAndBeginCheckout({
      coupon: "10%",
      value: 110,
      items: [
        {
          id: item.name,
          itemName: item.name,
          price: 0,
          vehicle: item.name,
          pickup: location?.address ?? "",
          drop: location?.address ?? "",
          captain: null,
        },
      ],
    })

    await onSelectitem({
      item: {
        item_list_name: "cubes",
        content_type: "Medio_de_transporte",
        item_list_id: item.name,
        items: [
          {
            item_name: item.name,
            item_id: item.name,
            item_brand: item.name,
            item_category: item.name,
          },
        ]
      }

    })
    router.navigate("/customer/selectlocations")
  }

  return (
    <View style={{ height: "100%" }}>
      <TouchableOpacity style={uiStyles.searchBarContainer} onPress={() => router.navigate("/customer/selectlocations")}>
        <Ionicons name='search-outline' size={RFValue(16)} color={Colors.text} />
        <CustomText fontFamily='Medium' fontSize={11} style={{ color: Colors.text }}>¿A dónde quieres ir?</CustomText>
      </TouchableOpacity>

      <View style={commonStyles.flexRowBetween}>
        <CustomText fontFamily='Medium' fontSize={11}>Explora</CustomText>
        <TouchableOpacity style={commonStyles.flexRow} onPress={() => router.navigate("/customer/selectlocations")}>
          <CustomText fontFamily='Regular' fontSize={10}>Ver Todo</CustomText>
          <Ionicons name='chevron-forward' size={RFValue(14)} color={Colors.text} />
        </TouchableOpacity>
      </View>

      <View style={uiStyles.cubes}>
        {cubes?.slice(0, 4).map((item, index) => (
          <TouchableOpacity key={index} style={uiStyles.cubeContainer} onPress={() => handleNavigateCubes(item)}>
            <View style={uiStyles.cubeIconContainer}>
              <Image source={item?.imageUri} style={uiStyles.cubeIcon} />
            </View>
            <CustomText fontFamily='Medium' fontSize={9.5} style={{ textAlign: "center" }}>
              {item?.name}
            </CustomText>
          </TouchableOpacity>
        ))}
      </View>

      {/* Carrusel de banners con swipe y auto-scroll */}
      <View style={[uiStyles.bannerContainer, { width: screenWidth, alignItems: 'center' }]}>
        {banners && banners.length > 0 ? (
          <ScrollView
            ref={scrollViewRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={handleMomentumScrollEnd}
            contentContainerStyle={{ alignItems: 'flex-start' }}
          >
            {banners.map((banner) => (
              <TouchableOpacity
                key={banner._id}
                onPress={() => handlePressBanner(banner.link)}
                activeOpacity={0.8}
                style={[styles.bannerCard, { width: screenWidth }]}
              >
                <Text style={styles.bannerTitle}>{banner.title}</Text>
                <Image
                  source={{
                    uri: banner.imageUrl.startsWith("http")
                      ? banner.imageUrl
                      : `${BASE_URL}/${banner.imageUrl.replace(/\\/g, '/')}`,
                  }}
                  style={styles.bannerImage}
                  resizeMode="contain"
                />
                <Text style={styles.bannerDescription}>{banner.description}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        ) : (
          <Image
            source={require("@/assets/icons/banner.gif")}
            style={styles.bannerImage}
            resizeMode="contain"
          />
        )}
      </View>
    </View>
  );
};

const { width: screenWidth } = Dimensions.get('window');

const styles = StyleSheet.create({
  bannerCard: {
    alignItems: 'center',
    justifyContent: 'center', // centra verticalmente el contenido
    padding: 10,
    overflow: 'hidden',
    backgroundColor: Colors.background,
    marginVertical: 10,
  },
  bannerTitle: {
    fontFamily: 'Bold',
    fontSize: 18,
    color: Colors.text,
    marginBottom: 5,
    textAlign: 'center',
  },
  bannerImage: {
    width: screenWidth * 0.9, // 90% del ancho de la pantalla
    height: screenWidth * 0.5, // tamaño fijo para la imagen
    marginBottom: 5,
  },
  bannerDescription: {
    fontFamily: 'Regular',
    fontSize: 14,
    color: Colors.text,
    textAlign: 'center',
  },
});

export default SheetContent;
