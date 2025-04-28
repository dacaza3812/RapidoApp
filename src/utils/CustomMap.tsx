import { useUserStore } from "@/store/userStore"

export const customMapStyle = [
  {
    "featureType": "administrative.land_parcel",
    "elementType": "labels",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "labels.text",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "poi.business",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "labels.icon",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "road.local",
    "elementType": "labels",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "transit",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  }
]

const ListOfRegion = [
   {
    name: "Pinar del Rio",
    latitude: 22.4124409,
    longitude: -83.7339696,
    latitudeDelta: 0.5,
    longitudeDelta: 0.5,
  },
   {
    name: "Artemisa",
    latitude: 22.7543853,
    longitude: -83.024653,
    latitudeDelta: 0.5,
    longitudeDelta: 0.5,
  },
  {
    name: "Havana",
    latitude: 23.0591519,
    longitude: -82.4441138,
    latitudeDelta: 0.5,
    longitudeDelta: 0.5,
  },
  {
    name: "Mayabeque",
    latitude: 22.8251554,
    longitude: -82.3598366,
    latitudeDelta: 0.5,
    longitudeDelta: 0.5,
  }
]

export const calcInitialRegion = () => {
  const { user } = useUserStore()
  const finallCity = ListOfRegion.find(e => e.name == user.user_metadata.province)
  return user.user_metadata.province

}

export const tunasIntialRegion = {
  latitude: 21.8955318,
  longitude: -79.4665393,
  latitudeDelta: 0.01,
  longitudeDelta: 0.01,
}
// 20.962636656524953, -76.96067947257785