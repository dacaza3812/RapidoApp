import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  Image,
  Switch,
  Alert,
  TextInput,
  Modal,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useStoreStorage } from '@/store/storeStore';
import { useUserStore } from '@/store/userStore';
import CustomText from '@/components/shared/CustomText';
import CustomButton from '@/components/shared/CustomButton';
import {
  getMyStores,
  getStoreProducts,
  getStoreOrders,
  updateStore,
  toggleStoreStatus,
  Store,
  Product,
  Delivery,
} from '@/service/storeService';
import { logout } from '@/service/authService';
import { useWS } from '@/service/WSProvider';
import { resetAndNavigate } from '@/utils/Helpers';
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';

// Tab types
type TabType = 'info' | 'products' | 'orders';

const StoreHome = () => {
  const { disconnect } = useWS();
  const { user } = useUserStore();
  const {
    currentStore,
    stores,
    products,
    orders,
    setCurrentStore,
    setStores,
    setProducts,
    setOrders,
    updateStore: updateStoreInState,
    setIsLoading,
  } = useStoreStorage();

  const [activeTab, setActiveTab] = useState<TabType>('info');
  const [refreshing, setRefreshing] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingStore, setEditingStore] = useState<Partial<Store>>({});

  // Load initial data
  useEffect(() => {
    loadData();
  }, []);

  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      
      // Load stores
      const myStores = await getMyStores();
      setStores(myStores);
      
      if (myStores.length > 0 && !currentStore) {
        setCurrentStore(myStores[0]);
      }
      
      // Load products and orders if we have a store
      if (currentStore || myStores[0]) {
        const storeId = currentStore?._id || myStores[0]._id;
        
        const [storeProducts, storeOrders] = await Promise.all([
          getStoreProducts(storeId),
          getStoreOrders(storeId),
        ]);
        
        setProducts(storeProducts);
        setOrders(storeOrders);
      }
    } catch (error) {
      console.error('Error loading store data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [currentStore]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  }, [loadData]);

  const handleLogout = async () => {
    Alert.alert(
      'Cerrar sesión',
      '¿Estás seguro de que deseas cerrar sesión?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sí',
          onPress: async () => {
            await logout(disconnect);
          },
        },
      ]
    );
  };

  const handleToggleStoreStatus = async () => {
    if (!currentStore) return;
    
    try {
      const newStatus = !currentStore.isActive;
      await toggleStoreStatus(currentStore._id, newStatus);
      updateStoreInState(currentStore._id, { isActive: newStatus });
    } catch (error) {
      console.error('Error toggling store status:', error);
    }
  };

  const openEditModal = () => {
    if (!currentStore) return;
    setEditingStore({ ...currentStore });
    setEditModalVisible(true);
  };

  const saveStoreChanges = async () => {
    if (!currentStore || !editingStore) return;
    
    try {
      const updated = await updateStore(currentStore._id, editingStore);
      updateStoreInState(currentStore._id, updated);
      setEditModalVisible(false);
    } catch (error) {
      console.error('Error updating store:', error);
    }
  };

  // Render Tab Content
  const renderTabContent = () => {
    switch (activeTab) {
      case 'info':
        return <StoreInfoTab store={currentStore} onToggleStatus={handleToggleStoreStatus} onEdit={openEditModal} />;
      case 'products':
        return <ProductsTab products={products} storeId={currentStore?._id} onRefresh={loadData} />;
      case 'orders':
        return <OrdersTab orders={orders} />;
      default:
        return null;
    }
  };

  if (!currentStore && stores.length === 0) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
        <StatusBar style="dark" />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
          <MaterialIcons name="store" size={80} color="#ccc" />
          <CustomText variant="h5" fontFamily="Medium" style={{ marginTop: 20, textAlign: 'center' }}>
            No tienes ninguna tienda registrada
          </CustomText>
          <CustomText variant="h7" style={{ marginTop: 10, textAlign: 'center', color: '#666' }}>
            Contacta al soporte para crear tu tienda
          </CustomText>
          <CustomButton title="Cerrar sesión" onPress={handleLogout} style={{ marginTop: 30 }} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <StatusBar style="dark" />
      
      {/* Header */}
      <View style={{ padding: 16, borderBottomWidth: 1, borderBottomColor: '#eee' }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <View>
            <CustomText variant="h5" fontFamily="Bold">
              {currentStore?.name || 'Mi Tienda'}
            </CustomText>
            <CustomText variant="h8" style={{ color: currentStore?.isActive ? '#4CAF50' : '#F44336' }}>
              {currentStore?.isActive ? '🟢 Abierta' : '🔴 Cerrada'}
            </CustomText>
          </View>
          <TouchableOpacity onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={28} color="#666" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Tab Content */}
      <ScrollView
        style={{ flex: 1 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {renderTabContent()}
      </ScrollView>

      {/* Bottom Tab Bar - WhatsApp Style */}
      <View style={{ flexDirection: 'row', borderTopWidth: 1, borderTopColor: '#eee', backgroundColor: '#fff' }}>
        <TabButton
          active={activeTab === 'info'}
          onPress={() => setActiveTab('info')}
          icon={<Ionicons name="information-circle" size={24} color={activeTab === 'info' ? '#24A1DE' : '#666'} />}
          label="Info"
        />
        <TabButton
          active={activeTab === 'products'}
          onPress={() => setActiveTab('products')}
          icon={<FontAwesome5 name="box-open" size={22} color={activeTab === 'products' ? '#24A1DE' : '#666'} />}
          label="Productos"
          badge={products.length}
        />
        <TabButton
          active={activeTab === 'orders'}
          onPress={() => setActiveTab('orders')}
          icon={<MaterialIcons name="shopping-bag" size={24} color={activeTab === 'orders' ? '#24A1DE' : '#666'} />}
          label="Pedidos"
          badge={orders.filter(o => o.status === 'PENDING').length}
        />
      </View>

      {/* Edit Modal */}
      <Modal
        visible={editModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' }}>
          <View style={{ backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, maxHeight: '80%' }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <CustomText variant="h5" fontFamily="Bold">Editar Tienda</CustomText>
              <TouchableOpacity onPress={() => setEditModalVisible(false)}>
                <Ionicons name="close" size={28} color="#666" />
              </TouchableOpacity>
            </View>
            
            <ScrollView>
              <TextInput
                style={{ borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12, marginBottom: 12, fontSize: 16 }}
                placeholder="Nombre de la tienda"
                value={editingStore.name}
                onChangeText={(text) => setEditingStore({ ...editingStore, name: text })}
              />
              <TextInput
                style={{ borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12, marginBottom: 12, fontSize: 16, height: 80 }}
                placeholder="Descripción"
                multiline
                value={editingStore.description}
                onChangeText={(text) => setEditingStore({ ...editingStore, description: text })}
              />
              <TextInput
                style={{ borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12, marginBottom: 12, fontSize: 16 }}
                placeholder="Teléfono de contacto"
                value={editingStore.contact?.phone}
                onChangeText={(text) => setEditingStore({ ...editingStore, contact: { ...editingStore.contact, phone: text } })}
              />
              <TextInput
                style={{ borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12, marginBottom: 12, fontSize: 16 }}
                placeholder="Email"
                keyboardType="email-address"
                value={editingStore.contact?.email}
                onChangeText={(text) => setEditingStore({ ...editingStore, contact: { ...editingStore.contact, email: text } })}
              />
              
              <CustomButton title="Guardar cambios" onPress={saveStoreChanges} />
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

// Tab Button Component
const TabButton = ({
  active,
  onPress,
  icon,
  label,
  badge,
}: {
  active: boolean;
  onPress: () => void;
  icon: React.ReactNode;
  label: string;
  badge?: number;
}) => (
  <TouchableOpacity
    onPress={onPress}
    style={{
      flex: 1,
      alignItems: 'center',
      paddingVertical: 10,
      borderBottomWidth: active ? 3 : 0,
      borderBottomColor: '#24A1DE',
    }}
  >
    <View style={{ position: 'relative' }}>
      {icon}
      {badge !== undefined && badge > 0 && (
        <View
          style={{
            position: 'absolute',
            top: -8,
            right: -8,
            backgroundColor: '#F44336',
            borderRadius: 10,
            minWidth: 20,
            height: 20,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Text style={{ color: '#fff', fontSize: 12, fontWeight: 'bold' }}>
            {badge > 99 ? '99+' : badge}
          </Text>
        </View>
      )}
    </View>
    <Text style={{ fontSize: 12, marginTop: 4, color: active ? '#24A1DE' : '#666' }}>{label}</Text>
  </TouchableOpacity>
);

// Store Info Tab
const StoreInfoTab = ({
  store,
  onToggleStatus,
  onEdit,
}: {
  store: Store | null;
  onToggleStatus: () => void;
  onEdit: () => void;
}) => {
  if (!store) return null;

  return (
    <View style={{ padding: 16 }}>
      {/* Store Banner/Logo */}
      <View style={{ alignItems: 'center', marginBottom: 20 }}>
        <View
          style={{
            width: 120,
            height: 120,
            borderRadius: 60,
            backgroundColor: '#24A1DE',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 12,
          }}
        >
          <MaterialIcons name="store" size={60} color="#fff" />
        </View>
        <CustomText variant="h5" fontFamily="Bold">{store.name}</CustomText>
        <CustomText variant="h7" style={{ color: '#666', marginTop: 4 }}>{store.description || 'Sin descripción'}</CustomText>
      </View>

      {/* Status Toggle */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: 16,
          backgroundColor: '#f5f5f5',
          borderRadius: 12,
          marginBottom: 16,
        }}
      >
        <View>
          <CustomText variant="h6" fontFamily="Medium">Estado de la tienda</CustomText>
          <CustomText variant="h8" style={{ color: '#666' }}>
            {store.isActive ? 'Recibiendo pedidos' : 'No visible para clientes'}
          </CustomText>
        </View>
        <Switch value={store.isActive} onValueChange={onToggleStatus} trackColor={{ false: '#767577', true: '#81b0ff' }} thumbColor={store.isActive ? '#24A1DE' : '#f4f3f4'} />
      </View>

      {/* Info Cards */}
      <InfoCard icon={<MaterialIcons name="location-on" size={24} color="#24A1DE" />} title="Dirección" value={`${store.address.street}, ${store.address.city}`} />
      <InfoCard icon={<MaterialIcons name="phone" size={24} color="#24A1DE" />} title="Teléfono" value={store.contact.phone} />
      <InfoCard icon={<MaterialIcons name="email" size={24} color="#24A1DE" />} title="Email" value={store.contact.email} />
      <InfoCard icon={<MaterialIcons name="category" size={24} color="#24A1DE" />} title="Categorías" value={store.categories.join(', ')} />
      <InfoCard icon={<MaterialIcons name="local-shipping" size={24} color="#24A1DE" />} title="Radio de entrega" value={`${store.deliveryRadius / 1000} km`} />
      <InfoCard icon={<MaterialIcons name="attach-money" size={24} color="#24A1DE" />} title="Pedido mínimo" value={`$${store.minimumOrderAmount}`} />

      {/* Edit Button */}
      <CustomButton title="Editar información" onPress={onEdit} style={{ marginTop: 20 }} />
    </View>
  );
};

const InfoCard = ({ icon, title, value }: { icon: React.ReactNode; title: string; value: string }) => (
  <View style={{ flexDirection: 'row', alignItems: 'center', padding: 12, backgroundColor: '#f9f9f9', borderRadius: 8, marginBottom: 8 }}>
    {icon}
    <View style={{ marginLeft: 12, flex: 1 }}>
      <CustomText variant="h8" style={{ color: '#666' }}>{title}</CustomText>
      <CustomText variant="h7" fontFamily="Medium">{value}</CustomText>
    </View>
  </View>
);

// Products Tab
const ProductsTab = ({ products, storeId, onRefresh }: { products: Product[]; storeId?: string; onRefresh: () => void }) => {
  const [showAddModal, setShowAddModal] = useState(false);

  return (
    <View style={{ padding: 16 }}>
      {/* Header */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <CustomText variant="h6" fontFamily="Bold">{products.length} productos</CustomText>
        <TouchableOpacity
          onPress={() => setShowAddModal(true)}
          style={{ backgroundColor: '#24A1DE', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 }}
        >
          <Text style={{ color: '#fff', fontWeight: 'bold' }}>+ Agregar</Text>
        </TouchableOpacity>
      </View>

      {/* Products List */}
      {products.length === 0 ? (
        <View style={{ alignItems: 'center', paddingVertical: 40 }}>
          <MaterialIcons name="inventory" size={80} color="#ddd" />
          <CustomText variant="h6" style={{ marginTop: 16, color: '#666' }}>No tienes productos</CustomText>
          <CustomText variant="h8" style={{ marginTop: 8, color: '#999' }}>Agrega tu primer producto</CustomText>
        </View>
      ) : (
        products.map((product) => <ProductCard key={product._id} product={product} />)
      )}

      {/* Add Product Modal - Simplified */}
      <Modal visible={showAddModal} animationType="slide" transparent={true}>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' }}>
          <View style={{ backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20 }}>
            <CustomText variant="h5" fontFamily="Bold">Agregar Producto</CustomText>
            <CustomText variant="h7" style={{ marginTop: 8, color: '#666' }}>
              Funcionalidad completa en desarrollo
            </CustomText>
            <CustomButton title="Cerrar" onPress={() => setShowAddModal(false)} style={{ marginTop: 20 }} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const ProductCard = ({ product }: { product: Product }) => (
  <View
    style={{
      flexDirection: 'row',
      padding: 12,
      backgroundColor: '#fff',
      borderRadius: 12,
      marginBottom: 12,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    }}
  >
    {/* Product Image Placeholder */}
    <View
      style={{
        width: 80,
        height: 80,
        borderRadius: 8,
        backgroundColor: '#f0f0f0',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <MaterialIcons name="image" size={32} color="#ccc" />
    </View>

    {/* Product Info */}
    <View style={{ flex: 1, marginLeft: 12, justifyContent: 'center' }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <CustomText variant="h7" fontFamily="Bold" style={{ flex: 1 }}>
          {product.name}
        </CustomText>
        <CustomText variant="h7" fontFamily="Bold" style={{ color: '#24A1DE' }}>
          ${product.price}
        </CustomText>
      </View>
      
      <CustomText variant="h8" style={{ color: '#666', marginTop: 4 }} numberOfLines={2}>
        {product.description}
      </CustomText>

      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 8, alignItems: 'center' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <MaterialIcons
            name="inventory"
            size={16}
            color={product.inventory <= product.lowInventoryThreshold ? '#F44336' : '#4CAF50'}
          />
          <Text
            style={{
              marginLeft: 4,
              fontSize: 12,
              color: product.inventory <= product.lowInventoryThreshold ? '#F44336' : '#4CAF50',
            }}
          >
            {product.inventory} en stock
          </Text>
        </View>
        
        <View
          style={{
            backgroundColor: product.isAvailable ? '#E8F5E9' : '#FFEBEE',
            paddingHorizontal: 8,
            paddingVertical: 4,
            borderRadius: 4,
          }}
        >
          <Text style={{ fontSize: 11, color: product.isAvailable ? '#4CAF50' : '#F44336' }}>
            {product.isAvailable ? 'Activo' : 'Inactivo'}
          </Text>
        </View>
      </View>
    </View>
  </View>
);

// Orders Tab
const OrdersTab = ({ orders }: { orders: Delivery[] }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return '#FF9800';
      case 'ASSIGNED':
        return '#2196F3';
      case 'PICKED_UP':
        return '#9C27B0';
      case 'DELIVERED':
        return '#4CAF50';
      case 'CANCELLED':
        return '#F44336';
      default:
        return '#666';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'Pendiente';
      case 'ASSIGNED':
        return 'Asignado';
      case 'PICKED_UP':
        return 'Recogido';
      case 'DELIVERED':
        return 'Entregado';
      case 'CANCELLED':
        return 'Cancelado';
      default:
        return status;
    }
  };

  return (
    <View style={{ padding: 16 }}>
      {/* Stats */}
      <View style={{ flexDirection: 'row', marginBottom: 16 }}>
        <StatCard
          title="Pendientes"
          value={orders.filter((o) => o.status === 'PENDING').length}
          color="#FF9800"
        />
        <StatCard
          title="En camino"
          value={orders.filter((o) => ['ASSIGNED', 'PICKED_UP'].includes(o.status)).length}
          color="#2196F3"
        />
        <StatCard
          title="Entregados"
          value={orders.filter((o) => o.status === 'DELIVERED').length}
          color="#4CAF50"
        />
      </View>

      {/* Orders List */}
      {orders.length === 0 ? (
        <View style={{ alignItems: 'center', paddingVertical: 40 }}>
          <MaterialIcons name="shopping-basket" size={80} color="#ddd" />
          <CustomText variant="h6" style={{ marginTop: 16, color: '#666' }}>No hay pedidos</CustomText>
          <CustomText variant="h8" style={{ marginTop: 8, color: '#999' }}>Los pedidos aparecerán aquí</CustomText>
        </View>
      ) : (
        orders.map((order) => (
          <View
            key={order._id}
            style={{
              padding: 16,
              backgroundColor: '#fff',
              borderRadius: 12,
              marginBottom: 12,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 3,
            }}
          >
            {/* Order Header */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
              <View>
                <CustomText variant="h7" fontFamily="Bold">
                  #{order.orderNumber}
                </CustomText>
                <CustomText variant="h8" style={{ color: '#666' }}>
                  {new Date(order.createdAt).toLocaleDateString()}
                </CustomText>
              </View>
              <View
                style={{
                  backgroundColor: getStatusColor(order.status) + '20',
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  borderRadius: 16,
                }}
              >
                <Text style={{ color: getStatusColor(order.status), fontWeight: 'bold', fontSize: 12 }}>
                  {getStatusLabel(order.status)}
                </Text>
              </View>
            </View>

            {/* Customer Info */}
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
              <MaterialIcons name="person" size={20} color="#666" />
              <CustomText variant="h8" style={{ marginLeft: 8 }}>
                {order.customer?.profile?.name} {order.customer?.profile?.lastName}
              </CustomText>
            </View>

            {/* Items */}
            <View style={{ backgroundColor: '#f9f9f9', padding: 12, borderRadius: 8, marginBottom: 12 }}>
              {order.items.map((item, idx) => (
                <View key={idx} style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
                  <CustomText variant="h8">
                    {item.quantity}x {item.name}
                  </CustomText>
                  <CustomText variant="h8">${item.subtotal}</CustomText>
                </View>
              ))}
            </View>

            {/* Total */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 1, borderTopColor: '#eee', paddingTop: 12 }}>
              <CustomText variant="h7" fontFamily="Bold">
                Total
              </CustomText>
              <CustomText variant="h6" fontFamily="Bold" style={{ color: '#24A1DE' }}>
                ${order.pricing.total}
              </CustomText>
            </View>

            {/* OTP for verification */}
            {order.status !== 'DELIVERED' && order.status !== 'CANCELLED' && (
              <View style={{ marginTop: 12, padding: 8, backgroundColor: '#E3F2FD', borderRadius: 8, alignItems: 'center' }}>
                <CustomText variant="h8" style={{ color: '#1976D2' }}>
                  Código de verificación: <Text style={{ fontWeight: 'bold', fontSize: 16 }}>{order.otp}</Text>
                </CustomText>
              </View>
            )}
          </View>
        ))
      )}
    </View>
  );
};

const StatCard = ({ title, value, color }: { title: string; value: number; color: string }) => (
  <View style={{ flex: 1, backgroundColor: color + '15', padding: 12, borderRadius: 12, marginHorizontal: 4, alignItems: 'center' }}>
    <CustomText variant="h5" fontFamily="Bold" style={{ color }}>
      {value}
    </CustomText>
    <CustomText variant="h8" style={{ color: '#666', marginTop: 4 }}>
      {title}
    </CustomText>
  </View>
);

export default StoreHome;
