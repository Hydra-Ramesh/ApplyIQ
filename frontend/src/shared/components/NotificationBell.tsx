import { useState, useEffect, useRef } from "react";
import { Bell, Check, Trash } from "lucide-react";
import { useAuthStore } from "../hooks/useAuthStore";
import { io } from "socket.io-client";
import { toast } from "sonner";

export function NotificationBell() {
  const { user, isAuthenticated } = useAuthStore();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const token = localStorage.getItem('token');
  const socketUrl = import.meta.env.VITE_API_URL.replace(/:[0-9]+.*$/, ':5001');

  useEffect(() => {
    if (!isAuthenticated || !user) return;

    // Fetch initial notifications
    fetch(`${import.meta.env.VITE_API_URL}/notifications`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setNotifications(data);
      })
      .catch(console.error);

    // Setup Socket
    const socket = io(socketUrl);
    socket.on('connect', () => {
      socket.emit('join_room', user._id);
    });

    socket.on('new_notification', (notif) => {
      toast.info(`New Notification: ${notif.title}`);
      setNotifications(prev => [notif, ...prev]);
    });

    return () => { socket.disconnect(); };
  }, [isAuthenticated, user, token, socketUrl]);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const markAsRead = async (id: string) => {
    await fetch(`${import.meta.env.VITE_API_URL}/notifications/${id}/read`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
  };

  const markAllAsRead = async () => {
    await fetch(`${import.meta.env.VITE_API_URL}/notifications/read-all`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  if (!isAuthenticated) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-white/60 hover:text-white bg-white/5 hover:bg-white/10 rounded-xl transition-colors border border-white/5"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-[#0a0a0a] border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden">
          <div className="p-4 border-b border-white/10 flex justify-between items-center bg-white/5">
            <h3 className="font-bold text-white">Notifications</h3>
            {unreadCount > 0 && (
              <button onClick={markAllAsRead} className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1">
                <Check className="w-3 h-3" /> Mark all read
              </button>
            )}
          </div>
          
          <div className="max-h-[400px] overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-white/40 text-sm">
                No notifications yet.
              </div>
            ) : (
              <div className="divide-y divide-white/5">
                {notifications.map(n => (
                  <div 
                    key={n._id} 
                    className={`p-4 transition-colors cursor-pointer ${n.isRead ? 'opacity-60 hover:bg-white/5' : 'bg-blue-500/10 hover:bg-blue-500/20'}`}
                    onClick={() => !n.isRead && markAsRead(n._id)}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="text-sm font-bold text-white">{n.title}</h4>
                      {!n.isRead && <div className="w-2 h-2 rounded-full bg-blue-500 shrink-0 mt-1.5" />}
                    </div>
                    <p className="text-xs text-white/70 line-clamp-2">{n.message}</p>
                    <span className="text-[10px] text-white/40 block mt-2">{new Date(n.createdAt).toLocaleString()}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
