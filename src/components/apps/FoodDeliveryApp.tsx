import React, { useState } from 'react';
import { Utensils, ShoppingBag, Plus, Minus, Star, Clock, MapPin, Navigation, CheckCircle } from 'lucide-react';

interface MenuItem {
  id: number;
  name: string;
  price: number;
  rating: number;
  prepTime: string;
  tag: string;
  emoji: string;
  description: string;
}

const MENU: MenuItem[] = [
  { id: 1, name: 'Truffle Wagyu Burger', price: 16.99, rating: 4.9, prepTime: '15-20 min', tag: 'Bestseller', emoji: '🍔', description: 'Double wagyu patty, black truffle aioli, aged cheddar, brioche bun.' },
  { id: 2, name: 'Artisanal Neapolitan Pizza', price: 18.50, rating: 4.8, prepTime: '20-25 min', tag: 'Wood Fired', emoji: '🍕', description: 'San Marzano tomatoes, fresh buffalo mozzarella, basil leaves.' },
  { id: 3, name: 'Dragon Roll Sushi Platter', price: 21.00, rating: 4.9, prepTime: '15 min', tag: 'Chef Special', emoji: '🍣', description: 'Unagi, avocado, cucumber, flying fish roe with unagi glaze.' },
  { id: 4, name: 'Matcha Boba Parfait', price: 7.99, rating: 4.7, prepTime: '5-10 min', tag: 'Dessert', emoji: '🧋', description: 'Uji matcha gelato, brown sugar tapioca pearls, red bean paste.' }
];

export const FoodDeliveryApp: React.FC = () => {
  const [cart, setCart] = useState<Record<number, number>>({ 1: 1 });
  const [orderStatus, setOrderStatus] = useState<'idle' | 'preparing' | 'delivery' | 'delivered'>('idle');
  const [driverLocationProgress, setDriverLocationProgress] = useState(35);

  const addToCart = (id: number) => {
    setCart(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  };

  const removeFromCart = (id: number) => {
    setCart(prev => {
      const updated = { ...prev };
      if (updated[id] > 1) {
        updated[id] -= 1;
      } else {
        delete updated[id];
      }
      return updated;
    });
  };

  const cartItemCount = Object.values(cart).reduce((a, b) => a + b, 0);
  const subtotal = Object.entries(cart).reduce((sum, [id, qty]) => {
    const item = MENU.find(m => m.id === Number(id));
    return sum + (item ? item.price * qty : 0);
  }, 0);

  const startOrder = () => {
    setOrderStatus('preparing');
    setTimeout(() => {
      setOrderStatus('delivery');
      setDriverLocationProgress(65);
    }, 4000);
  };

  return (
    <div className="h-full bg-slate-950 text-slate-100 flex flex-col font-sans select-none overflow-y-auto pb-12">
      {/* Top Bar */}
      <div className="p-4 bg-slate-900/90 backdrop-blur sticky top-0 z-10 border-b border-rose-500/20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center">
            <Utensils className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-base font-bold text-rose-300 leading-tight">BiteDash Gourmet</h1>
            <p className="text-[10px] text-slate-400">Instant Express Delivery</p>
          </div>
        </div>
        <div className="relative">
          <ShoppingBag className="w-5 h-5 text-rose-400" />
          {cartItemCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-rose-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-bounce">
              {cartItemCount}
            </span>
          )}
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Active Order Tracker Banner */}
        {orderStatus !== 'idle' && (
          <div className="bg-gradient-to-r from-rose-950 to-amber-950 border border-rose-500/40 p-4 rounded-3xl space-y-3 shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-rose-300 flex items-center gap-1">
                <Navigation className="w-3.5 h-3.5 text-rose-400 animate-spin-slow" /> Live Order Tracker
              </span>
              <span className="text-[10px] font-mono bg-rose-500/30 text-rose-200 px-2 py-0.5 rounded-full">
                {orderStatus === 'preparing' ? 'Kitchen Preparing' : orderStatus === 'delivery' ? 'Driver En Route' : 'Delivered'}
              </span>
            </div>

            {/* Simulated Map Progress */}
            <div className="relative w-full h-12 bg-slate-900/80 rounded-2xl border border-slate-800 p-2 flex items-center overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-rose-500/10 to-amber-500/10"></div>
              <div className="w-full flex justify-between items-center px-4 relative z-10 text-xs">
                <span className="flex items-center gap-1 text-slate-400"><Utensils className="w-3.5 h-3.5" /> Bistro</span>
                <span className="flex items-center gap-1 text-emerald-400 font-bold"><MapPin className="w-3.5 h-3.5" /> You</span>
              </div>
              {/* Driver Marker */}
              <div
                className="absolute top-1/2 -translate-y-1/2 bg-rose-500 text-white p-1 rounded-full shadow-lg transition-all duration-1000"
                style={{ left: `${driverLocationProgress}%` }}
              >
                <Navigation className="w-3.5 h-3.5 transform rotate-45" />
              </div>
            </div>
          </div>
        )}

        {/* Menu Items Grid */}
        <div className="space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-rose-400">Featured Gourmet Menu</div>
          {MENU.map(item => {
            const qty = cart[item.id] || 0;
            return (
              <div key={item.id} className="bg-slate-900/90 border border-slate-800 p-3.5 rounded-3xl space-y-2 hover:border-slate-700 transition">
                <div className="flex items-start justify-between">
                  <div className="flex gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-slate-800 text-2xl flex items-center justify-center shrink-0 border border-slate-700">
                      {item.emoji}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-white">{item.name}</h3>
                        <span className="text-[10px] bg-rose-500/20 text-rose-300 font-semibold px-2 py-0.5 rounded-md">
                          {item.tag}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">{item.description}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-slate-800/60">
                  <div className="flex items-center gap-3 text-xs text-slate-400">
                    <span className="font-extrabold text-white text-sm">${item.price.toFixed(2)}</span>
                    <span className="flex items-center gap-0.5 text-amber-400 font-semibold">
                      <Star className="w-3 h-3 fill-amber-400" /> {item.rating}
                    </span>
                    <span className="flex items-center gap-0.5 text-slate-500">
                      <Clock className="w-3 h-3" /> {item.prepTime}
                    </span>
                  </div>

                  {/* Quantity Counter / Add Button */}
                  {qty > 0 ? (
                    <div className="flex items-center gap-2 bg-slate-950 p-1 rounded-xl border border-slate-800">
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="p-1 rounded-lg hover:bg-slate-800 text-slate-300 transition"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-xs font-bold text-rose-400 w-4 text-center">{qty}</span>
                      <button
                        onClick={() => addToCart(item.id)}
                        className="p-1 rounded-lg bg-rose-500 hover:bg-rose-400 text-white transition"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => addToCart(item.id)}
                      className="bg-rose-500 hover:bg-rose-400 text-white font-bold px-3 py-1.5 rounded-xl text-xs flex items-center gap-1 active:scale-95 transition"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Checkout Bar */}
        {cartItemCount > 0 && orderStatus === 'idle' && (
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-3xl flex items-center justify-between shadow-xl">
            <div>
              <div className="text-[10px] text-slate-400">Subtotal ({cartItemCount} items)</div>
              <div className="text-lg font-black text-rose-400">${subtotal.toFixed(2)}</div>
            </div>
            <button
              onClick={startOrder}
              className="bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-400 hover:to-amber-400 text-slate-950 font-bold px-5 py-2.5 rounded-2xl text-xs flex items-center gap-1.5 shadow-lg active:scale-95 transition"
            >
              Place Order <CheckCircle className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
