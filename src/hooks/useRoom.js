import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../services/supabaseClient';
import { showToast, showConfirm } from '../services/alertService';

export function useRoom(roomId, session) {
  const [roomData, setRoomData] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [myParticipant, setMyParticipant] = useState(null);
  const [roomError, setRoomError] = useState(null);

  const fetchParticipants = useCallback(async () => {
    if (!roomId) return;
    const { data: p } = await supabase.from('participants').select('*').eq('room_id', roomId).order('joined_at', { ascending: true });
    if (p) {
      setParticipants(p);
      const me = p.find(user => user.user_id === session?.user?.id);
      setMyParticipant(me || null);
    }
  }, [roomId, session]);

  const fetchRoomData = useCallback(async () => {
    if (!roomId) return;
    const { data: r, error } = await supabase.from('rooms').select('*').eq('id', roomId).single();
    
    if (error) {
      console.error("Error fetching room:", error);
      setRoomError("Room not found");
      return;
    }

    if (r) {
      setRoomData(r);
      setRoomError(null);
    }
    fetchParticipants();
  }, [roomId, fetchParticipants]);

  useEffect(() => {
    if (!roomId || !session) return;

    fetchRoomData();

    // Listen for changes in participants
    const participantChannel = supabase.channel(`participants_${roomId}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'participants', filter: `room_id=eq.${roomId}` }, () => {
        fetchParticipants();
      })
      .subscribe();

    // Listen for changes in room state
    const roomChannel = supabase.channel(`room_state_${roomId}`)
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'rooms', filter: `id=eq.${roomId}` }, (payload) => {
        setRoomData(payload.new);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(participantChannel);
      supabase.removeChannel(roomChannel);
    };
  }, [roomId, session, fetchRoomData, fetchParticipants]);

  const clearRoom = () => {
    setRoomData(null);
    setParticipants([]);
    setMyParticipant(null);
  };

  const actions = {
    startGame: async () => {
      await supabase.from('rooms').update({ is_started: true, reveal_phase: false }).eq('id', roomId);
      showToast("Game Started!", "success");
    },
    updatePriceRule: async (val) => {
      await supabase.from('rooms').update({ price_rule: val }).eq('id', roomId);
      showToast("Budget updated!", "success");
    },
    saveWishlist: async (val) => {
      if (!myParticipant) return;
      await supabase.from('participants').update({ wishlist: val }).eq('id', myParticipant.id);
    },
    pickNumber: async (num) => {
       const active = participants.find(p => p.picked_number === null);
       if (active?.id !== myParticipant?.id) return showToast("Wait your turn!", "warning");
       if (participants.some(p => p.picked_number === num)) return showToast("That number is already taken!", "error");
       
       await supabase.from('participants').update({ picked_number: num }).eq('id', myParticipant.id);
       showToast(`You picked #${num}!`, "success");
    },
    revealAll: async () => {
      const confirmed = await showConfirm(
        "Reveal Results?", 
        "This will show everyone who got who. There is no going back!"
      );
      if (confirmed) {
        await supabase.from('rooms').update({ reveal_phase: true }).eq('id', roomId);
      }
    },
    resetGame: async () => {
      const confirmed = await showConfirm(
        "Reset Game?", 
        "This will clear all picked numbers and restart the lobby. Are you sure?",
        "Yes, Reset Everything"
      );
      if (confirmed) {
        await supabase.from('rooms').update({ is_started: false, reveal_phase: false, price_rule: 'Open Budget' }).eq('id', roomId);
        await supabase.from('participants').update({ picked_number: null }).eq('room_id', roomId);
        showToast("Game has been reset", "info");
      }
    }
  };

  // Derived State
  const isHost = roomData?.host_id === session?.user?.id;
  const activePlayer = participants.find(p => p.picked_number === null);
  const isMyTurn = activePlayer?.id === myParticipant?.id;
  const isGameOver = participants.length > 0 && !activePlayer;
  const myBroughtGift = myParticipant ? participants.findIndex(p => p.id === myParticipant.id) + 1 : -1;

  return {
    roomData,
    participants,
    myParticipant,
    isHost,
    activePlayer,
    isMyTurn,
    isGameOver,
    myBroughtGift,
    actions,
    clearRoom,
    roomError
  };
}
