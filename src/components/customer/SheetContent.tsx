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

const cubes = [
  { name: "Moto", imageUri: require("@/assets/icons/bike.png") },
  { name: "Auto", imageUri: require("@/assets/icons/auto.png") },
  { name: "Auto Económico", imageUri: require("@/assets/icons/cab.png") },
  { name: "Paquete", imageUri: require("@/assets/icons/parcel.png") },
  { name: "Auto Premium", imageUri: require("@/assets/icons/cab_premium.png") },
];

const useBannersByCity = () => {
  type citiesType = string[] | string | undefined;
  const [banners, setBanners] = useState<Banners[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const {location} = useUserStore()

  const getBannersByCity = async () => {
    
    const strCity = location?.address || "";
    const partesCity = strCity.split(/\s*,\s*/);
    const city = partesCity[partesCity.length - 2];
    setLoading(true);
    try {
      const response = await axios.post(`${BASE_URL}/banner/by-city`, { cities: [city.toString()] });
      setBanners(response.data.banners);
    } catch (err) {
      console.error("Error al obtener banners por ciudad:", err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  return { banners, loading, error, location, getBannersByCity };
};

const SheetContent = () => {
  const { banners, getBannersByCity, location } = useBannersByCity();
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

  const handlePressBanner = (link: string) => {
    if (link) {
      Linking.openURL(link).catch((err) => console.error("Error al abrir el link:", err));
    }
  };

  return (
    <View style={{ height: "100%" }}>
      <TouchableOpacity style={uiStyles.searchBarContainer} onPress={() => router.navigate("/customer/selectlocations")}>
        <Ionicons name='search-outline' size={RFValue(16)} color="black" />
        <CustomText fontFamily='Medium' fontSize={11}>¿A dónde quieres ir?</CustomText>
      </TouchableOpacity>

      <View style={commonStyles.flexRowBetween}>
        <CustomText fontFamily='Medium' fontSize={11}>Explora</CustomText>
        <TouchableOpacity style={commonStyles.flexRow} onPress={() => router.navigate("/customer/selectlocations")}>
          <CustomText fontFamily='Regular' fontSize={10}>Ver Todo</CustomText>
          <Ionicons name='chevron-forward' size={RFValue(14)} color="black" />
        </TouchableOpacity>
      </View>

      <View style={uiStyles.cubes}>
        {cubes?.slice(0, 4).map((item, index) => (
          <TouchableOpacity key={index} style={uiStyles.cubeContainer} onPress={() => router.navigate("/customer/selectlocations")}>
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
    backgroundColor: '#fff',
    marginVertical: 10,
  },
  bannerTitle: {
    fontFamily: 'Bold',
    fontSize: 18,
    color: 'black',
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
    color: 'black',
    textAlign: 'center',
  },
});

export default SheetContent;
