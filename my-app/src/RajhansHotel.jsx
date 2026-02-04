import React, { useState, useEffect, useRef } from 'react';
import { placeOrder } from './services/orderService';
import { ShoppingCart, MapPin, Clock, ChevronRight, Phone, Star, Search, Plus, Minus, Trash2, Check, X, User, Utensils } from 'lucide-react';
import AdminLogin from "./AdminLogin";
import AdminPage from "./AdminPage";
import { CheckCircle, QrCode, Copy, ArrowLeft, Coffee } from 'lucide-react';


export default function RajhansHotel() {
  // Moved useRef to component level (was incorrectly placed outside)
  const receiptRef = useRef(null);
  
  const [currentPage, setCurrentPage] = useState('landing');
  const [isAdmin, setIsAdmin] = useState(false);
  const [rating, setRating] = useState(0);
  
  // landing, login, menu, cart, confirmation, status, payment, receipt
  const [tableNumber, setTableNumber] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [userName, setUserName] = useState('');
  const [userPhone, setUserPhone] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [cart, setCart] = useState([]);
  const [orderNotes, setOrderNotes] = useState('');
  const [orderStatus, setOrderStatus] = useState('received'); // received, preparing, ready, delivered
  const [orderTime, setOrderTime] = useState(null);

  const [showPaymentGateway, setShowPaymentGateway] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState('pending');
  const [upiId, setUpiId] = useState('');
  const [copied, setCopied] = useState(false);
  const [showCashSuccess, setShowCashSuccess] = useState(false);

  // Menu items database
  const menuItems = [
    { id: 1, name: 'Butter Chicken', price: 299, category: 'North Indian', image: 'photo-1603894584373-5ac82b2ae398', description: 'Creamy tomato-based curry with tender chicken' },
    { id: 2, name: 'Paneer Tikka Masala', price: 249, category: 'North Indian', image: 'photo-1631452180519-c014fe946bc7', description: 'Grilled cottage cheese in rich masala gravy' },
    { id: 3, name: 'Biryani Special', price: 279, category: 'Rice', image: 'photo-1563379091339-03b21ab4a4f8', description: 'Fragrant basmati rice with aromatic spices' },
    { id: 4, name: 'Masala Dosa', price: 129, category: 'South Indian', image: 'photo-1668236543090-82eba5ee5976', description: 'Crispy rice crepe with spiced potato filling' },
    { id: 5, name: 'Dal Tadka', price: 179, category: 'Main Course', image: 'photo-1546833999-b9f581a1996d', description: 'Tempered yellow lentils with aromatic spices' },
    { id: 6, name: 'Tandoori Roti', price: 25, category: 'Breads', image: 'photo-1619453712992-273a6c1f5c6e', description: 'Fresh whole wheat flatbread from tandoor' },
    { id: 7, name: 'Veg Pulao', price: 199, category: 'Rice', image: 'photo-1596797038530-2c107229654b', description: 'Fragrant rice with mixed vegetables' },
    { id: 8, name: 'Gulab Jamun', price: 89, category: 'Desserts', image: 'photo-1590301157890-4810ed352733', description: 'Sweet dumplings soaked in rose syrup' },
    { id: 9, name: 'Chicken Tikka', price: 259, category: 'North Indian', image: 'photo-1599487488170-d11ec9c172f0', description: 'Marinated grilled chicken chunks' },
    { id: 10, name: 'Palak Paneer', price: 229, category: 'North Indian', image: 'photo-1601050690597-df0568f70950', description: 'Cottage cheese in spinach gravy' },
    { id: 11, name: 'Samosa', price: 40, category: 'Starters', image: 'photo-1601050690532-da0c5fefc0d8', description: 'Crispy pastry with spiced potato filling' },
    { id: 12, name: 'Chole Bhature', price: 159, category: 'North Indian', image: 'photo-1626074353765-517a681e40be', description: 'Spiced chickpeas with fried bread' },
    { id: 13, name: 'Paneer Tikka', price: 189, category: 'North Indian', image: 'photo-1631452180519-c014fe946bc7', description: 'Grilled cottage cheese with spices' },
    { id: 14, name: 'Biryani', price: 199, category: 'North Indian', image: 'photo-1563379091339-03b21ab4a4f8', description: 'Fragrant rice with aromatic spices' },
    { id: 15, name: 'Masala Dosa', price: 129, category: 'South Indian', image: 'photo-1668236543090-82eba5ee5976', description: 'Crispy crepe with potato filling' },
    { id: 16, name: 'Idli Sambar', price: 99, category: 'South Indian', image: 'photo-1589301760014-d929f3979dbc', description: 'Steamed rice cakes with lentil soup' },
    { id: 17, name: 'Vada Pav', price: 79, category: 'Street Food', image: 'photo-1606491956689-2ea866880c84', description: 'Spiced potato fritter in bun' },
    { id: 18, name: 'Pani Puri', price: 69, category: 'Street Food', image: 'photo-1601050690597-df0568f70950', description: 'Crispy shells with tangy water' },
    { id: 19, name: 'Samosa', price: 49, category: 'Street Food', image: 'photo-1601050690117-d26d14d4a49e', description: 'Crispy pastry with spiced filling' },
    { id: 20, name: 'Chicken Tikka', price: 219, category: 'North Indian', image: 'photo-1599487488170-d11ec9c172f0', description: 'Grilled marinated chicken chunks' },
    { id: 21, name: 'Dal Makhani', price: 169, category: 'North Indian', image: 'photo-1546833998-877b37c2e5c6', description: 'Creamy black lentils with butter' },
    { id: 22, name: 'Rogan Josh', price: 249, category: 'North Indian', image: 'photo-1565557623262-b51c2513a641', description: 'Aromatic lamb curry with spices' },
    { id: 23, name: 'Uttapam', price: 139, category: 'South Indian', image: 'photo-1630383249896-424e482df921', description: 'Thick rice pancake with toppings' },
    { id: 24, name: 'Medu Vada', price: 89, category: 'South Indian', image: 'photo-1576402187878-974f70c890a5', description: 'Crispy lentil donuts' },
    { id: 25, name: 'Pav Bhaji', price: 149, category: 'Street Food', image: 'photo-1606491956391-e4aa0b46dd76', description: 'Mashed vegetables with buttered bread' },
    { id: 26, name: 'Aloo Tikki', price: 59, category: 'Street Food', image: 'photo-1626132647523-66f5bf380027', description: 'Crispy potato patties' },
    { id: 27, name: 'Gulab Jamun', price: 79, category: 'Desserts', image: 'photo-1590301157890-4810ed352733', description: 'Sweet milk dumplings in syrup' },
    { id: 28, name: 'Ras Malai', price: 99, category: 'Desserts', image: 'photo-1615887563209-86ac2a10fe85', description: 'Cottage cheese in sweet milk' },
    { id: 29, name: 'Jalebi', price: 69, category: 'Desserts', image: 'photo-1590683408881-b4952ce3a660', description: 'Crispy sweet pretzel spirals' },
    { id: 30, name: 'Kulfi', price: 89, category: 'Desserts', image: 'photo-1582067199796-bba5acdcc843', description: 'Traditional Indian ice cream' }
  ];

  const categories = ['All', 'North Indian', 'South Indian', 'Rice', 'Breads', 'Starters', 'Main Course', 'Desserts', 'Street Food'];

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const table = params.get('table') || '';
    setTableNumber(table);
    setIsLoading(false);
  }, []);

  // Scroll to section function
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Filter menu items
  const filteredItems = menuItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Cart functions
  const addToCart = (item) => {
    const existingItem = cart.find(cartItem => cartItem.id === item.id);
    if (existingItem) {
      setCart(cart.map(cartItem => 
        cartItem.id === item.id 
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      ));
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
  };

  const removeFromCart = (itemId) => {
    setCart(cart.filter(item => item.id !== itemId));
  };

  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity === 0) {
      removeFromCart(itemId);
    } else {
      setCart(cart.map(item => 
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      ));
    }
  };

  const getTotalPrice = () => {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const handleStartOrdering = () => {
    if (!tableNumber) {
      alert('Please enter your table number');
      return;
    }
    setCurrentPage('login');
  };

  const handleLogin = () => {
    if (!userName || !userPhone) {
      alert('Please enter your name and phone number');
      return;
    }
    if (userPhone.length !== 10) {
      alert('Please enter a valid 10-digit phone number');
      return;
    }
    setCurrentPage('menu');
  };

  const handleAdminLogin = (username, password) => {
    const adminUser = "admin";
    const adminPass = "1234";

    if (username === adminUser && password === adminPass) {
      setIsAdmin(true);
      setCurrentPage('adminPage');
    } else {
      alert("Invalid Admin Credentials!");
    }
  };

  const handlePlaceOrder = () => {
    if (cart.length === 0) {
      alert('Your cart is empty');
      return;
    }
    setCurrentPage('confirmation');
  };

  const handleConfirmOrder = async () => {
    console.log("HANDLE STARTED");
    try {
      const orderTotal = getTotalPrice() + Math.round(getTotalPrice() * 0.05);

      console.log("TOTAL:", orderTotal);
      console.log("USER:", userPhone, "TABLE:", tableNumber);

      // Comment out Firebase call if it's causing issues - uncomment when ready
      // await placeOrder(userPhone, tableNumber, cart, orderTotal);

      console.log("ORDER CONFIRMED!");

      setOrderTime(new Date());
      setOrderStatus('received');
      setCurrentPage('status');
      console.log("PAGE SET TO STATUS");

      // Simulate order progression
      setTimeout(() => setOrderStatus('preparing'), 3000);
      setTimeout(() => setOrderStatus('ready'), 8000);

    } catch (error) {
      console.error("ORDER ERROR:", error);
      alert("Order failed! Try again.");
    }
  };

  const handlePayment = () => {
    setCurrentPage('payment');
  };

  const handlePaymentComplete = () => {
    setCurrentPage('receipt');
  };

  // Payment gateway functions
  const merchantUPI = 'restaurant@paytm';

  const handlePaymentClick = () => {
    setShowPaymentGateway(true);
    setPaymentStatus('pending');
  };

  const handleUPISubmit = () => {
    if (!upiId) return;
    
    setPaymentStatus('processing');
    
    setTimeout(() => {
      setPaymentStatus('success');
    }, 3000);
  };

  const handleCopyUPI = () => {
    navigator.clipboard.writeText(merchantUPI);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePaymentClose = () => {
    setShowPaymentGateway(false);
    setPaymentStatus('pending');
    setUpiId('');
  };

  const handlePaymentSuccess = () => {
    setShowPaymentGateway(false);
    setPaymentStatus('pending');
    setUpiId('');
    setCurrentPage('menu');
    setCart([]);
  };

  const handleCashPayment = () => {
    setShowCashSuccess(true);
  };

  const handleCashSuccessClose = () => {
    setShowCashSuccess(false);
    setCurrentPage('menu');
    setCart([]);
  };

  const handleViewFullMenu = () => {
    if (!tableNumber) {
      alert('Please enter your table number first');
      return;
    }
    setCurrentPage('login');
  };
  
  // Function to download bill
  const downloadReceiptPDF = async () => {
    const element = receiptRef.current;
    if (!element) {
      alert('Receipt not found. Please try again.');
      return;
    }

    try {
      // Show loading state
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false
      });

      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      
      // Generate filename with timestamp
      const timestamp = new Date().toISOString().slice(0, 10);
      pdf.save(`Rajhans_Receipt_${timestamp}.pdf`);
    } catch (error) {
      console.error('PDF generation error:', error);
      alert('Failed to generate PDF. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-900 via-red-900 to-amber-900 flex items-center justify-center">
        <div className="text-amber-300 text-xl">Loading...</div>
      </div>
    );
  }

  // ADMIN LOGIN PAGE
  if (currentPage === 'adminLogin') {
    return <AdminLogin 
      setCurrentPage={setCurrentPage} 
      handleAdminLogin={handleAdminLogin}
    />;
  }

  // ADMIN DASHBOARD PAGE
  if (currentPage === 'adminPage') {
    return <AdminPage setCurrentPage={setCurrentPage} />;
  }

  // LOGIN PAGE
  if (currentPage === 'login') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <button 
            onClick={() => setCurrentPage('landing')}
            className="flex items-center gap-2 text-gray-400 hover:text-amber-400 mb-8 transition"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>

          <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm border border-amber-600/30 rounded-2xl p-8 space-y-6 shadow-2xl">
            <div className="text-center space-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-amber-600 to-orange-600 rounded-full flex items-center justify-center font-bold text-2xl mx-auto">
                RH
              </div>
              <h2 className="text-2xl font-bold">Welcome to Rajhans Hotel</h2>
              <p className="text-gray-400 text-sm">Please enter your details to continue</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-400 font-medium block mb-2">Table Number</label>
                <input 
                  type="text"
                  value={tableNumber}
                  disabled
                  className="w-full bg-black/50 border border-gray-600 rounded-xl px-4 py-3 text-lg text-center text-amber-400 font-bold"
                />
              </div>

              <div>
                <label className="text-sm text-gray-400 font-medium block mb-2">Your Name</label>
                <input 
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full bg-black/50 border border-amber-600/50 rounded-xl px-4 py-3 focus:outline-none focus:border-amber-400 transition"
                />
              </div>

              <div>
                <label className="text-sm text-gray-400 font-medium block mb-2">Phone Number</label>
                <input 
                  type="tel"
                  value={userPhone}
                  onChange={(e) => setUserPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  placeholder="10-digit mobile number"
                  className="w-full bg-black/50 border border-amber-600/50 rounded-xl px-4 py-3 focus:outline-none focus:border-amber-400 transition"
                />
              </div>

              <button 
                onClick={handleLogin}
                className="w-full bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 hover:from-amber-500 hover:via-orange-500 hover:to-red-500 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-orange-600/30"
              >
                Continue to Menu
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // MENU PAGE
  if (currentPage === 'menu') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white pb-24">
        {/* Header */}
        <header className="sticky top-0 z-50 bg-black/90 backdrop-blur-md border-b border-amber-600/20">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-3">
                <button onClick={() => setCurrentPage('landing')} className="text-gray-400 hover:text-amber-400">
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
                    RAJHANS HOTEL
                  </h1>
                  <p className="text-xs text-gray-400">Table {tableNumber} • {userName}</p>
                </div>
              </div>
              <button 
                onClick={() => setCurrentPage('cart')}
                className="relative bg-gradient-to-r from-amber-600 to-orange-600 p-3 rounded-full"
              >
                <ShoppingCart className="w-5 h-5" />
                {cart.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {cart.length}
                  </span>
                )}
              </button>
            </div>

            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for dishes..."
                className="w-full bg-black/50 border border-amber-600/30 rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-amber-400 transition"
              />
            </div>
          </div>
        </header>

        {/* Categories */}
        <div className="sticky top-[140px] z-40 bg-black/80 backdrop-blur-sm border-b border-gray-800 px-4 py-3 overflow-x-auto">
          <div className="flex gap-2 min-w-max">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition whitespace-nowrap ${
                  selectedCategory === category
                    ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white'
                    : 'bg-gray-800 text-gray-400 hover:text-white'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Menu Items */}
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredItems.map(item => {
              const cartItem = cart.find(c => c.id === item.id);
              const quantity = cartItem ? cartItem.quantity : 0;

              return (
                <div key={item.id} className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 border border-gray-700 rounded-xl overflow-hidden hover:border-amber-600/50 transition-all shadow-lg">
                  <div className="relative h-48 bg-gray-800 overflow-hidden">
                    <img 
                      src={`https://images.unsplash.com/${item.image}?w=400&h=300&fit=crop`}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4 space-y-3">
                    <div>
                      <h3 className="font-semibold text-lg text-white">{item.name}</h3>
                      <p className="text-xs text-gray-400 mt-1">{item.description}</p>
                      <span className="inline-block text-xs text-amber-400 mt-1">{item.category}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xl font-bold text-amber-400">₹{item.price}</span>
                      {quantity === 0 ? (
                        <button 
                          onClick={() => addToCart(item)}
                          className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold px-6 py-2 rounded-lg transition shadow-lg flex items-center gap-2"
                        >
                          <Plus className="w-4 h-4" />
                          Add
                        </button>
                      ) : (
                        <div className="flex items-center gap-3 bg-gradient-to-r from-amber-600 to-orange-600 rounded-lg px-2 py-1">
                          <button 
                            onClick={() => updateQuantity(item.id, quantity - 1)}
                            className="text-white font-bold p-1 hover:bg-white/20 rounded"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="text-white font-bold min-w-[20px] text-center">{quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, quantity + 1)}
                            className="text-white font-bold p-1 hover:bg-white/20 rounded"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Floating Cart Button */}
        {cart.length > 0 && (
          <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black via-black to-transparent">
            <button 
              onClick={() => setCurrentPage('cart')}
              className="w-full max-w-7xl mx-auto bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 text-white font-bold py-4 rounded-xl shadow-lg flex items-center justify-between px-6"
            >
              <span className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5" />
                {cart.length} {cart.length === 1 ? 'item' : 'items'}
              </span>
              <span className="flex items-center gap-2">
                ₹{getTotalPrice()}
                <ChevronRight className="w-5 h-5" />
              </span>
            </button>
          </div>
        )}
      </div>
    );
  }

  // CART PAGE
  if (currentPage === 'cart') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
        <header className="sticky top-0 z-50 bg-black/90 backdrop-blur-md border-b border-amber-600/20 px-4 py-4">
          <div className="flex items-center gap-3">
            <button onClick={() => setCurrentPage('menu')} className="text-gray-400 hover:text-amber-400">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-xl font-bold">Your Cart</h1>
              <p className="text-xs text-gray-400">Table {tableNumber}</p>
            </div>
          </div>
        </header>

        <div className="max-w-4xl mx-auto p-4 space-y-4">
          {cart.length === 0 ? (
            <div className="text-center py-20">
              <ShoppingCart className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 text-lg">Your cart is empty</p>
              <button 
                onClick={() => setCurrentPage('menu')}
                className="mt-4 bg-gradient-to-r from-amber-600 to-orange-600 text-white font-bold px-6 py-3 rounded-lg"
              >
                Browse Menu
              </button>
            </div>
          ) : (
            <>
              {cart.map(item => (
                <div key={item.id} className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 border border-gray-700 rounded-xl p-4 flex gap-4">
                  <img 
                    src={`https://images.unsplash.com/${item.image}?w=100&h=100&fit=crop`}
                    alt={item.name}
                    className="w-20 h-20 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold">{item.name}</h3>
                    <p className="text-sm text-gray-400">{item.category}</p>
                    <p className="text-lg font-bold text-amber-400 mt-1">₹{item.price}</p>
                  </div>
                  <div className="flex flex-col items-end justify-between">
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                    <div className="flex items-center gap-3 bg-gradient-to-r from-amber-600 to-orange-600 rounded-lg px-2 py-1">
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="text-white font-bold p-1"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="text-white font-bold min-w-[20px] text-center">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="text-white font-bold p-1"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 border border-amber-600/30 rounded-xl p-6 space-y-4">
                <h3 className="font-semibold text-lg">Order Summary</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Subtotal</span>
                    <span>₹{getTotalPrice()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">GST (5%)</span>
                    <span>₹{Math.round(getTotalPrice() * 0.05)}</span>
                  </div>
                  <div className="border-t border-gray-700 pt-2 flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-amber-400">₹{getTotalPrice() + Math.round(getTotalPrice() * 0.05)}</span>
                  </div>
                </div>
              </div>

              <button 
                onClick={() => setCurrentPage('menu')}
                className="w-full bg-gray-800 hover:bg-gray-700 text-white font-semibold py-3 rounded-xl transition"
              >
                Add More Items
              </button>

              <button 
                onClick={handlePlaceOrder}
                className="w-full bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 hover:from-amber-500 hover:via-orange-500 hover:to-red-500 text-white font-bold py-4 rounded-xl shadow-lg"
              >
                Place Order
              </button>
            </>
          )}
        </div>
      </div>
    );
  }

  // ORDER CONFIRMATION PAGE
  if (currentPage === 'confirmation') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
        <header className="sticky top-0 z-50 bg-black/90 backdrop-blur-md border-b border-amber-600/20 px-4 py-4">
          <div className="flex items-center gap-3">
            <button onClick={() => setCurrentPage('cart')} className="text-gray-400 hover:text-amber-400">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-bold">Confirm Order</h1>
          </div>
        </header>

        <div className="max-w-4xl mx-auto p-4 space-y-6">
          <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 border border-amber-600/30 rounded-xl p-6">
            <h2 className="text-lg font-bold mb-4">Order Details</h2>
            <div className="space-y-2 text-sm mb-4">
              <div className="flex justify-between">
                <span className="text-gray-400">Table Number</span>
                <span className="font-bold">{tableNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Customer Name</span>
                <span>{userName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Phone Number</span>
                <span>{userPhone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Prep Time</span>
                <span className="text-amber-400">15-20 mins</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 border border-gray-700 rounded-xl p-6">
            <h2 className="text-lg font-bold mb-4">Items Ordered</h2>
            <div className="space-y-3">
              {cart.map(item => (
                <div key={item.id} className="flex justify-between items-center">
                  <div className="flex gap-3">
                    <span className="text-amber-400 font-bold">{item.quantity}x</span>
                    <span>{item.name}</span>
                  </div>
                  <span className="font-semibold">₹{item.price * item.quantity}</span>
                </div>
              ))}
              <div className="border-t border-gray-700 pt-3 flex justify-between text-lg font-bold">
                <span>Total Amount</span>
                <span className="text-amber-400">₹{getTotalPrice() + Math.round(getTotalPrice() * 0.05)}</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 border border-gray-700 rounded-xl p-6">
            <label className="text-sm text-gray-400 font-medium block mb-2">Special Instructions (Optional)</label>
            <textarea 
              value={orderNotes}
              onChange={(e) => setOrderNotes(e.target.value)}
              placeholder="e.g., No onions, Extra spicy, etc."
              rows={3}
              className="w-full bg-black/50 border border-amber-600/30 rounded-xl px-4 py-3 focus:outline-none focus:border-amber-400 transition resize-none"
            />
          </div>

          <div className="flex gap-4 mt-6">
            <button
              className="flex-1 bg-gray-800 hover:bg-gray-700 text-white font-semibold py-4 rounded-xl transition"
              onClick={() => setCurrentPage('cart')}
            >
              Edit Order
            </button>

            <button
              onClick={handleConfirmOrder}
              className="flex-1 bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 hover:from-amber-500 hover:via-orange-500 hover:to-red-500 text-white font-bold py-4 rounded-xl shadow-lg"
            >
              Confirm & Send to Kitchen
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ORDER STATUS PAGE
  if (currentPage === 'status') {
    const statusSteps = [
      { key: 'received', label: 'Order Received', icon: Check },
      { key: 'preparing', label: 'Preparing', icon: Utensils },
      { key: 'ready', label: 'Ready to Serve', icon: Check },
      { key: 'delivered', label: 'Delivered', icon: Check },
    ];

    const currentStepIndex = statusSteps.findIndex(step => step.key === orderStatus);

    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
        <header className="sticky top-0 z-50 bg-black/90 backdrop-blur-md border-b border-amber-600/20 px-4 py-4">
          <h1 className="text-xl font-bold text-center">Order Status</h1>
        </header>

        <div className="max-w-4xl mx-auto p-4 space-y-6">
          <div className="bg-gradient-to-br from-amber-600/20 to-orange-600/20 border border-amber-600/30 rounded-xl p-6 text-center">
            <div className="text-5xl mb-4">🍽️</div>
            <h2 className="text-2xl font-bold mb-2">Your order is {orderStatus === 'received' ? 'received' : orderStatus === 'preparing' ? 'being prepared' : 'ready'}!</h2>
            <p className="text-gray-400">Table {tableNumber} • Order #{Math.floor(Math.random() * 1000)}</p>
          </div>

          {/* Status Timeline */}
          <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 border border-gray-700 rounded-xl p-6">
            <div className="space-y-4">
              {statusSteps.map((step, index) => {
                const isComplete = index <= currentStepIndex;
                const isCurrent = index === currentStepIndex;
                const Icon = step.icon;

                return (
                  <div key={step.key} className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition ${
                      isComplete 
                        ? 'bg-gradient-to-br from-amber-600 to-orange-600 border-amber-600' 
                        : 'bg-gray-800 border-gray-600'
                    }`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <p className={`font-semibold ${isCurrent ? 'text-amber-400' : isComplete ? 'text-white' : 'text-gray-500'}`}>
                        {step.label}
                      </p>
                      {isCurrent && (
                        <p className="text-sm text-gray-400">In progress...</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Order Items */}
          <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 border border-gray-700 rounded-xl p-6">
            <h3 className="font-bold mb-4">Your Items</h3>
            <div className="space-y-2">
              {cart.map(item => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span>{item.quantity}x {item.name}</span>
                  <span>₹{item.price * item.quantity}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Estimated Time */}
          <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 border border-amber-600/30 rounded-xl p-6 text-center">
            <Clock className="w-8 h-8 text-amber-400 mx-auto mb-2" />
            <p className="text-sm text-gray-400 mb-1">Estimated Time</p>
            <p className="text-2xl font-bold text-amber-400">15-20 mins</p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button className="w-full bg-gray-800 hover:bg-gray-700 text-white font-semibold py-3 rounded-xl transition">
              Call Waiter for Support
            </button>
            
            {orderStatus === 'ready' && (
              <button 
                onClick={handlePayment}
                className="w-full bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 hover:from-amber-500 hover:via-orange-500 hover:to-red-500 text-white font-bold py-4 rounded-xl shadow-lg"
              >
                Proceed to Payment
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Cash Payment Success Screen
  if (showCashSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center p-4">
        <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 border border-gray-700 rounded-xl p-8 max-w-md w-full text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-green-500/20 rounded-full p-6">
              <CheckCircle className="w-24 h-24 text-green-400" />
            </div>
          </div>
          
          <h2 className="text-3xl font-bold text-white mb-4">Thank You!</h2>
          <p className="text-xl text-gray-300 mb-6">Visit Again</p>
          
          <div className="bg-gradient-to-r from-amber-600/20 to-orange-600/20 border border-amber-600/30 rounded-xl p-4 mb-6">
            <p className="text-gray-400 text-sm mb-1">Order Total</p>
            <p className="text-2xl font-bold text-amber-400">
              ₹{getTotalPrice() + Math.round(getTotalPrice() * 0.05)}
            </p>
          </div>
          
          <p className="text-gray-400 text-sm mb-8">
            Your order has been confirmed. Please pay at the counter.
          </p>
          
          <button
            onClick={handleCashSuccessClose}
            className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold py-4 rounded-xl transition"
          >
            Back to Main Menu
          </button>
        </div>
      </div>
    );
  }

  // Payment Gateway Screen
  if (showPaymentGateway) {
    const totalAmount = getTotalPrice() + Math.round(getTotalPrice() * 0.05);

    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center p-4">
        <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 border border-gray-700 rounded-xl p-6 max-w-md w-full relative">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <button 
              onClick={handlePaymentClose}
              className="text-gray-400 hover:text-white transition"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h3 className="font-bold text-white text-xl">UPI Payment</h3>
            <button 
              onClick={handlePaymentClose}
              className="text-gray-400 hover:text-white transition"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Payment Status Views */}
          {paymentStatus === 'pending' && (
            <div className="space-y-6">
              {/* Amount Display */}
              <div className="bg-gradient-to-r from-amber-600/20 to-orange-600/20 border border-amber-600/30 rounded-xl p-6 text-center">
                <p className="text-gray-400 text-sm mb-2">Amount to Pay</p>
                <p className="text-4xl font-bold text-amber-400">₹{totalAmount}</p>
              </div>

              {/* QR Code Option */}
              <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
                <div className="flex items-center justify-center mb-4">
                  <div className="bg-white p-4 rounded-xl">
                    <QrCode className="w-32 h-32 text-gray-900" />
                  </div>
                </div>
                <p className="text-center text-gray-400 text-sm">Scan QR code with any UPI app</p>
              </div>

              {/* Divider */}
              <div className="flex items-center gap-4">
                <div className="flex-1 h-px bg-gray-700"></div>
                <span className="text-gray-400 text-sm">OR</span>
                <div className="flex-1 h-px bg-gray-700"></div>
              </div>

              {/* UPI ID Input */}
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Enter UPI ID</label>
                  <input
                    type="text"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    placeholder="yourname@upi"
                    className="w-full bg-gray-900/50 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 transition"
                  />
                </div>

                {/* Merchant UPI */}
                <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-4">
                  <p className="text-gray-400 text-xs mb-2">Pay to</p>
                  <div className="flex items-center justify-between">
                    <p className="text-white font-mono text-sm">{merchantUPI}</p>
                    <button
                      onClick={handleCopyUPI}
                      className="text-amber-400 hover:text-amber-300 transition"
                    >
                      {copied ? <CheckCircle className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleUPISubmit}
                  disabled={!upiId}
                  className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl transition"
                >
                  Proceed to Pay
                </button>
              </div>
            </div>
          )}

          {paymentStatus === 'processing' && (
            <div className="py-12 text-center space-y-6">
              <div className="flex justify-center">
                <div className="relative">
                  <Clock className="w-24 h-24 text-amber-400 animate-pulse" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 border-4 border-amber-400 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="text-2xl font-bold text-white mb-2">Processing Payment</h4>
                <p className="text-gray-400">Please wait while we confirm your payment...</p>
                <p className="text-sm text-gray-500 mt-4">Do not close this window</p>
              </div>
            </div>
          )}

          {paymentStatus === 'success' && (
            <div className="py-8 text-center space-y-6">
              <div className="flex justify-center">
                <div className="bg-green-500/20 rounded-full p-6">
                  <CheckCircle className="w-24 h-24 text-green-400" />
                </div>
              </div>
              <div>
                <h4 className="text-3xl font-bold text-white mb-2">Thank You!</h4>
                <p className="text-xl text-gray-300 mb-4">Visit Again</p>
                <p className="text-gray-400 mb-4">Your payment of ₹{totalAmount} has been received</p>
                <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-4 inline-block mb-4">
                  <p className="text-xs text-gray-500 mb-1">Transaction ID</p>
                  <p className="text-white font-mono text-sm">{Math.random().toString(36).substr(2, 16).toUpperCase()}</p>
                </div>
              </div>
              <button
                onClick={() => setCurrentPage('receipt')}
                className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold py-4 rounded-xl transition"
              >
                View Receipt & Download
              </button>

              <button
                onClick={handlePaymentSuccess}
                className="w-full bg-gray-800 hover:bg-gray-700 text-white font-semibold py-3 rounded-xl transition"
              >
                Skip to Main Menu
              </button>
            </div>
          )}

          {paymentStatus === 'failed' && (
            <div className="py-12 text-center space-y-6">
              <div className="flex justify-center">
                <div className="bg-red-500/20 rounded-full p-6">
                  <X className="w-24 h-24 text-red-400" />
                </div>
              </div>
              <div>
                <h4 className="text-2xl font-bold text-white mb-2">Payment Failed</h4>
                <p className="text-gray-400">Something went wrong with your payment</p>
              </div>
              <div className="space-y-3">
                <button
                  onClick={() => setPaymentStatus('pending')}
                  className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold py-4 rounded-xl transition"
                >
                  Try Again
                </button>
                <button
                  onClick={handlePaymentClose}
                  className="w-full bg-gray-700 hover:bg-gray-600 text-white font-bold py-4 rounded-xl transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // PAYMENT PAGE
  if (currentPage === 'payment') {
    const totalAmount = getTotalPrice() + Math.round(getTotalPrice() * 0.05);

    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
        <header className="sticky top-0 z-50 bg-black/90 backdrop-blur-md border-b border-amber-600/20 px-4 py-4">
          <div className="flex items-center gap-3">
            <button onClick={() => setCurrentPage('status')} className="text-gray-400 hover:text-amber-400">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-bold">Payment</h1>
          </div>
        </header>

        <div className="max-w-4xl mx-auto p-4 space-y-6">
          <div className="bg-gradient-to-br from-amber-600/20 to-orange-600/20 border border-amber-600/30 rounded-xl p-6 text-center">
            <p className="text-sm text-gray-400 mb-2">Total Amount</p>
            <p className="text-4xl font-bold text-amber-400">₹{totalAmount}</p>
          </div>

          <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 border border-gray-700 rounded-xl p-6">
            <h3 className="font-bold mb-4">Bill Summary</h3>
            <div className="space-y-2 text-sm">
              {cart.map(item => (
                <div key={item.id} className="flex justify-between">
                  <span>{item.quantity}x {item.name}</span>
                  <span>₹{item.price * item.quantity}</span>
                </div>
              ))}
              <div className="border-t border-gray-700 pt-2 mt-2">
                <div className="flex justify-between">
                  <span className="text-gray-400">Subtotal</span>
                  <span>₹{getTotalPrice()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">GST (5%)</span>
                  <span>₹{Math.round(getTotalPrice() * 0.05)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg mt-2">
                  <span>Total</span>
                  <span className="text-amber-400">₹{totalAmount}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 border border-gray-700 rounded-xl p-6">
            <h3 className="font-bold mb-4">Select Payment Method</h3>
            <div className="space-y-3">
              <button 
                onClick={handlePaymentClick}
                className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold py-4 rounded-xl transition flex items-center justify-center gap-2"
              >
                <span>Pay with UPI</span>
              </button>
              <button 
                onClick={handleCashPayment}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-bold py-4 rounded-xl transition flex items-center justify-center gap-2"
              >
                <span>Pay with Cash</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // RECEIPT PAGE
  if (currentPage === 'receipt') {
    const totalAmount = getTotalPrice() + Math.round(getTotalPrice() * 0.05);
    const orderNumber = Math.floor(Math.random() * 1000);

    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
        <div className="max-w-4xl mx-auto p-4 space-y-6 py-12">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-green-600 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-10 h-10" />
            </div>
            <h1 className="text-3xl font-bold mb-2">Payment Successful!</h1>
            <p className="text-gray-400">Thank you for dining with us</p>
          </div>

          <div ref={receiptRef} className="bg-white text-gray-900 border border-gray-300 rounded-xl p-6">
            <div className="text-center mb-6 pb-6 border-b border-gray-300">
              <h2 className="text-2xl font-bold text-amber-600 mb-2">
                RAJHANS HOTEL
              </h2>
              <p className="text-sm text-gray-600">BABULGAON, Maharashtra</p>
              <p className="text-sm text-gray-600">+919876543210</p>
            </div>

            <div className="space-y-3 text-sm mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">Order Number</span>
                <span className="font-bold">#{orderNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Table Number</span>
                <span className="font-bold">{tableNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Customer</span>
                <span>{userName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Date & Time</span>
                <span>{new Date().toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Payment Method</span>
                <span className="text-green-600 font-semibold">Paid</span>
              </div>
            </div>

            <div className="border-t border-gray-300 pt-4 mb-4">
              <h3 className="font-bold mb-3">Order Details</h3>
              <div className="space-y-2">
                {cart.map(item => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span>{item.quantity}x {item.name}</span>
                    <span>₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-gray-300 pt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span>₹{getTotalPrice()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">GST (5%)</span>
                <span>₹{Math.round(getTotalPrice() * 0.05)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg pt-2 border-t border-gray-300">
                <span>Total Paid</span>
                <span className="text-green-600">₹{totalAmount}</span>
              </div>
            </div>
          </div>

          {/* Download Button - Outside the receipt for PDF generation */}
          <div className="text-center">
            <button
              onClick={downloadReceiptPDF}
              className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold px-8 py-3 rounded-xl transition shadow-lg"
            >
               Download Bill (PDF)
            </button>
          </div>

          <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 border border-gray-700 rounded-xl p-6 text-center">
            <h3 className="font-bold mb-3">Rate Your Experience</h3>
            <div className="flex justify-center gap-2 mb-4">
              {[1, 2, 3, 4, 5].map(num => (
                <Star
                  key={num}
                  onClick={() => setRating(num)}
                  className={`w-8 h-8 cursor-pointer ${
                    num <= rating ? "text-amber-400 fill-amber-400" : "text-gray-500"
                  }`}
                />
              ))}
            </div>
            <textarea 
              placeholder="Share your feedback..."
              rows={3}
              className="w-full bg-black/50 border border-gray-600 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-400 transition resize-none"
            />
            <button className="w-full mt-3 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold py-3 rounded-xl transition">
              Submit Feedback
            </button>
          </div>

          <div className="text-center space-y-3">
            <button 
              onClick={() => {
                setCart([]);
                setCurrentPage('landing');
              }}
              className="w-full bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 hover:from-amber-500 hover:via-orange-500 hover:to-red-500 text-white font-bold py-4 rounded-xl shadow-lg"
            >
              Order Again
            </button>
            <div className="text-center mt-6">
              <button
                onClick={() => {
                  setCart([]);
                  setOrderStatus('received');
                  setOrderTime(null);
                  setCurrentPage('landing');
                }}
                className="bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 hover:from-amber-500 hover:via-orange-500 hover:to-red-500 text-white font-bold px-6 py-3 rounded-xl shadow-lg"
              >
                Back to Main Menu
              </button>
            </div>

            <p className="text-sm text-gray-400">
              Thank you for choosing Rajhans Hotel!<br/>
              We hope to serve you again soon.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // LANDING PAGE (default)
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white overflow-x-hidden">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-black/90 backdrop-blur-md border-b border-amber-600/20">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4 md:gap-8">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-600 to-orange-600 rounded-full flex items-center justify-center font-bold text-xl">
                RH
              </div>
              <div className="hidden md:block">
                <h1 className="text-xl font-bold bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
                  RAJHANS HOTEL
                </h1>
                <p className="text-xs text-gray-400">Fine Dining Experience</p>
              </div>
            </div>

            <nav className="hidden lg:flex gap-6 text-sm">
              <a 
                href="#menu" 
                onClick={(e) => { e.preventDefault(); scrollToSection('menu'); }}
                className="text-gray-400 hover:text-amber-400 transition cursor-pointer"
              >
                Menu
              </a>
              <a 
                href="#about" 
                onClick={(e) => { e.preventDefault(); scrollToSection('about'); }}
                className="text-gray-400 hover:text-amber-400 transition cursor-pointer"
              >
                About
              </a>
              <a 
                href="#locations" 
                onClick={(e) => { e.preventDefault(); scrollToSection('locations'); }}
                className="text-gray-400 hover:text-amber-400 transition cursor-pointer"
              >
                Locations
              </a>
              <a 
                href="#contact" 
                onClick={(e) => { e.preventDefault(); scrollToSection('contact'); }}
                className="text-gray-400 hover:text-amber-400 transition cursor-pointer"
              >
                Contact
              </a>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => setCurrentPage('cart')}
              className="transition-transform duration-200 active:scale-90 relative"
            >
              <ShoppingCart className="w-5 h-5 text-gray-400 hover:text-amber-400 cursor-pointer transition" />
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cart.length}
                </span>
              )}
            </button>

            <Phone className="w-4 h-4 text-gray-400" />
            <span className="hidden md:inline text-sm text-gray-400">+91 9876543210</span>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-24 pb-12 px-4 md:px-6">
        {/* Animated background */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-900/20 via-red-900/20 to-amber-900/20"></div>
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(251, 146, 60, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(234, 88, 12, 0.1) 0%, transparent 50%)'
          }}></div>
        </div>

        <div className="relative z-10 max-w-7xl w-full grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-6 md:space-y-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                <span className="text-sm text-gray-400 ml-2">5.0 Rating</span>
              </div>

              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight">
                <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-red-400 bg-clip-text text-transparent">
                  AUTHENTIC
                </span>
                <br/>
                <span className="text-white">INDIAN CUISINE</span>
              </h1>
              
              <p className="text-gray-400 max-w-md leading-relaxed text-sm md:text-base">
                Experience the rich flavors of India at Rajhans Hotel. From aromatic North Indian curries to crispy South Indian delicacies, we bring you an unforgettable dining journey with every dish prepared fresh to order.
              </p>
            </div>

            {/* Table Verification Card */}
            <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm border border-amber-600/30 rounded-2xl p-6 md:p-8 space-y-5 shadow-2xl max-w-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-amber-400">
                  <MapPin className="w-5 h-5" />
                  <span className="text-sm">BABULGAON, Maharashtra</span>
                </div>
                <div className="flex items-center gap-1">
                  <Utensils className="w-4 h-4 text-amber-400" />
                  <span className="text-xs text-gray-400">Dine-In</span>
                </div>
              </div>
              
              <div className="space-y-3">
                <label className="text-sm text-gray-400 font-medium">Your Table Number</label>
                <input 
                  type="text"
                  value={tableNumber}
                  onChange={(e) => setTableNumber(e.target.value)}
                  className="w-full bg-black/50 border-2 border-amber-600/50 rounded-xl px-4 py-4 text-3xl font-bold text-center focus:outline-none focus:border-amber-400 transition text-amber-400"
                  placeholder="00"
                  maxLength={3}
                />
                <p className="text-xs text-gray-500 text-center">Scan QR code on your table or enter manually</p>
              </div>

              <button 
                onClick={handleStartOrdering}
                className="w-full bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 hover:from-amber-500 hover:via-orange-500 hover:to-red-500 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 group shadow-lg shadow-orange-600/30"
              >
                <span className="text-lg">Start Ordering</span>
                <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition" />
              </button>

              <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-700">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>Open: 11:00 AM - 12:00 PM</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right - Hero Image */}
          <div className="relative order-first md:order-last">
            <div className="absolute -top-6 -right-6 bg-gradient-to-br from-amber-600 to-orange-600 rounded-2xl p-4 shadow-2xl z-20">
              <div className="text-sm font-semibold text-white">Today&apos;s Special</div>
              <div className="text-2xl font-bold text-white">Butter Chicken</div>
              <div className="text-3xl font-bold text-black">₹299</div>
            </div>

            <div className="relative">
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-amber-600/20 via-orange-600/20 to-red-600/20 rounded-full blur-3xl"></div>
              
              {/* Food image container */}
              <div className="relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl p-4 md:p-8 border border-amber-600/30 shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=600&h=600&fit=crop"
                  alt="Delicious Indian Cuisine"
                  className="rounded-2xl w-full h-full object-cover shadow-xl"
                  style={{ aspectRatio: '1/1' }}
                />
              </div>

              {/* Decorative elements */}
              <div className="absolute -bottom-8 -left-8 w-48 h-48 bg-gradient-to-br from-amber-600/20 to-transparent rounded-full blur-3xl"></div>
              <div className="absolute -top-8 -right-8 w-48 h-48 bg-gradient-to-bl from-orange-600/20 to-transparent rounded-full blur-3xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Sections */}
      <section id="menu" className="py-16 px-4">
        {/* Placeholder for menu preview */}
      </section>

      <section id="about" className="py-16 px-4 bg-gray-900">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-6">About Our Hotel</h2>
          <p className="text-gray-400 mb-4">
            Welcome to our premium hotel chain, offering exceptional hospitality and comfort.
          </p>
          <h3 className="text-xl font-semibold mt-6 mb-3">Our Locations</h3>
          <ul className="space-y-2 text-gray-400">
            <li>• Babulgaon - Experience luxury in the heart of the city</li>
          </ul>
        </div>
      </section>

      <section id="locations" className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-6">Our Locations</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="border border-gray-700 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-2">Babulgaon</h3>
              <p className="text-gray-400">Premium accommodation in Babulgaon</p>
            </div>
          </div>
        </div>
      </section>

      <section id="contact" className="py-16 px-4 bg-gray-900">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-6">Contact Us</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg mb-2">Phone</h3>
              <p className="text-gray-400">+91 1234567890</p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">Email</h3>
              <p className="text-gray-400">info@yourhotel.com</p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">Address</h3>
              <p className="text-gray-400">Babulgaon, Maharashtra</p>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Favourites */}
      <section className="relative py-16 md:py-24 px-4 md:px-6 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-2">
              <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
                CUSTOMER
              </span>
            </h2>
            <h3 className="text-2xl md:text-4xl font-bold text-white">
              FAVOURITES
            </h3>
            <p className="text-gray-400 mt-4 text-sm md:text-base">Most loved dishes by our guests</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {menuItems.slice(0, 8).map((item, idx) => (
              <div key={idx} className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 border border-gray-700 hover:border-amber-600/50 rounded-xl md:rounded-2xl overflow-hidden transition-all group cursor-pointer shadow-lg hover:shadow-amber-600/20 hover:scale-105">
                <div className="relative aspect-square bg-gray-800 overflow-hidden">
                  {idx % 3 === 0 && (
                    <div className="absolute top-2 md:top-3 left-2 md:left-3 bg-gradient-to-r from-red-600 to-orange-600 text-white text-xs font-bold px-2 md:px-3 py-1 rounded-full z-10 shadow-lg">
                      Hot
                    </div>
                  )}
                  <img 
                    src={`https://images.unsplash.com/${item.image}?w=400&h=400&fit=crop`}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition"></div>
                </div>
                <div className="p-3 md:p-4 space-y-2">
                  <div className="flex justify-between items-start gap-2">
                    <h4 className="font-semibold text-xs md:text-sm leading-tight text-white">{item.name}</h4>
                    <span className="text-xs text-gray-400 whitespace-nowrap">{item.category}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-base md:text-lg font-bold text-amber-400">₹{item.price}</span>
                    <button 
                      onClick={() => {
                        if (!tableNumber) {
                          alert('Please enter your table number first');
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                          return;
                        }
                        addToCart(item);
                      }}
                      className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white text-xs font-bold px-3 py-1.5 md:py-2 rounded-lg transition shadow-lg"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <button 
              onClick={handleViewFullMenu}
              className="bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 hover:from-amber-500 hover:via-orange-500 hover:to-red-500 text-white font-bold px-8 md:px-12 py-3 md:py-4 rounded-xl transition-all text-base md:text-lg shadow-lg shadow-orange-600/30 inline-flex items-center gap-2"
            >
              View Full Menu
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Quick Info Banner */}
      <section className="bg-gradient-to-r from-amber-900/20 via-orange-900/20 to-red-900/20 border-y border-amber-600/20 py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 text-center">
            <div className="space-y-2">
              <div className="text-2xl md:text-3xl font-bold text-amber-400">500+</div>
              <div className="text-xs md:text-sm text-gray-400">Happy Customers Daily</div>
            </div>
            <div className="space-y-2">
              <div className="text-2xl md:text-3xl font-bold text-amber-400">150+</div>
              <div className="text-xs md:text-sm text-gray-400">Menu Items</div>
            </div>
            <div className="space-y-2">
              <div className="text-2xl md:text-3xl font-bold text-amber-400">15/20min</div>
              <div className="text-xs md:text-sm text-gray-400">Average Prep Time</div>
            </div>
            <div className="space-y-2">
              <div className="text-2xl md:text-3xl font-bold text-amber-400">5★</div>
              <div className="text-xs md:text-sm text-gray-400">Customer Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black/50 border-t border-gray-800 py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4 md:px-6 text-center">
          <div className="mb-4">
            <h3 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
              RAJHANS HOTEL
            </h3>
            <p className="text-gray-400 text-xs md:text-sm mt-2">Serving authentic flavors </p>
          </div>
          <div className="flex flex-wrap justify-center gap-4 md:gap-6 text-xs md:text-sm text-gray-400 mb-4">
            <a href="#" className="hover:text-amber-400 transition">Privacy Policy</a>
            <a href="#" className="hover:text-amber-400 transition">Terms of Service</a>
            <a href="#" className="hover:text-amber-400 transition">Contact Us</a>
          </div>
          <p className="text-gray-500 text-xs">© 2025 Rajhans Hotel. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}