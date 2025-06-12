import { useState, useEffect } from 'react';
import { LiveUpdate } from '../types';
import { apiService } from '../services/api';

export const useLiveUpdates = (userId: string | null) => {
  const [updates, setUpdates] = useState<LiveUpdate[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!userId) return;

    const fetchUpdates = async () => {
      try {
        const liveUpdates = await apiService.getLiveUpdates(userId);
        setUpdates(liveUpdates);
        setUnreadCount(liveUpdates.filter(u => !u.read).length);
      } catch (error) {
        console.error('Error fetching live updates:', error);
      }
    };

    // Fetch immediately
    fetchUpdates();

    // Set up polling for live updates
    const interval = setInterval(fetchUpdates, 3000);

    return () => clearInterval(interval);
  }, [userId]);

  const markAsRead = async (updateId: string) => {
    try {
      await apiService.markUpdateAsRead(updateId);
      setUpdates(prev => prev.map(u => 
        u.id === updateId ? { ...u, read: true } : u
      ));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking update as read:', error);
    }
  };

  return { updates, unreadCount, markAsRead };
};