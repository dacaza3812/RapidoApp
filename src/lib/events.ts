// events.ts
import analytics from '@react-native-firebase/analytics';

type AppEvents = {
  eventName: string;
  payload?: Record<string, any>;
};

export const customEvent = async ({ eventName, payload }: AppEvents) => {
  try {
    await analytics().logEvent(eventName, payload);
  } catch (error) {
    console.error("Error al enviar el evento:", error);
  }
};

export const onCustomScreenView = async (screenName: string, screenClass: string) => {
  try {
    await analytics().logScreenView({
      screen_name: screenName,
      screen_class: screenClass,
    });
  } catch (error) {
    console.error("Error al enviar el evento:", error);
  }
}

export const onUserLogin = async (phone: string, role: string) =>{
  try {
    await analytics().logLogin({
      method: 'phone',
    })
    await analytics().logEvent('login', {
      method: 'phone',
      phone: `+53${phone}`,
      role: role
    });
    await analytics().initiateOnDeviceConversionMeasurementWithPhoneNumber(`+53${phone}`)
  } catch (error) {
    console.log(error);
  }
}

export const onAppOpen = async () => {
  try {
    await analytics().logAppOpen();
  } catch (error) {
    console.log(error);
  }
}

export const onAddPaymentInfo = async ({paymentMethod, value}: {paymentMethod: string, value: number}) => {
  try {
    await analytics().logAddPaymentInfo({
      currency: "CUP",
      payment_type: paymentMethod,
      coupon: "10%",
      value: value,
    });
  } catch (error) {
    console.log(error);
  }
}
type AppCompleteRideAndBeginCheckout ={
  coupon: string;
  value: number;
  items: Array<{id: string; itemName: string; price: number; vehicle: string; pickup: string; drop: string; captain: any}>;
}
export const onAppCompleteRideAndBeginCheckout = async ({coupon, value, items}: AppCompleteRideAndBeginCheckout) => {
  try {
    await analytics().logPurchase({
      coupon,
      currency: "CUP",
      value,
      items
    })
  } catch (error) {
    console.log(error);
    
  }
}
interface Item {
  item_brand: string; // Marca del ítem
  item_id: string;    // ID del ítem
  item_name: string;  // Nombre del ítem
  item_category: string; // Categoría del ítem
}

interface ItemList {
  item_list_id: string;      // ID de la lista
  item_list_name: string;    // Nombre de la lista
  items: Item[];             // Array de ítems
  content_type: string;      // Tipo de contenido (puede estar vacío)
}

export const onSelectitem = async ({item}: {item:ItemList}) => {
  try {
    await analytics().logSelectItem({
      item_list_id: item.item_list_id,
      item_list_name: item.item_list_name,
      items: [{
        item_brand: item.items[0].item_brand,
        item_id: item.items[0].item_id,
        item_name: item.items[0].item_name,
        item_category: item.items[0].item_category,
      }],
      content_type: item.content_type,
    });
  } catch (error) {
    console.log(error);
    
  }
}
