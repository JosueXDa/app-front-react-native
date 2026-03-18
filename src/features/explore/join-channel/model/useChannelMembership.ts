import {
  getChannelMembers,
  isJoined as checkIsJoined,
  joinChannel,
} from '@/src/entities/channel-member';
import { Channel } from '@/src/entities/channel';
import { useCallback, useEffect, useState } from 'react';

type UseChannelMembershipReturn = {
  isJoined: boolean;
  memberCount: number;
  loading: boolean;
  checkingStatus: boolean;
  checkJoinStatusAndMembers: () => Promise<void>;
  handleJoin: () => Promise<void>;
};

export function useChannelMembership(
  channel: Channel | null,
  isOpen: boolean,
  onJoined?: () => Promise<void> | void,
): UseChannelMembershipReturn {
  const [isJoined, setIsJoined] = useState(false);
  const [memberCount, setMemberCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(false);

  const checkJoinStatusAndMembers = useCallback(async () => {
    if (!channel) {
      return;
    }

    try {
      setCheckingStatus(true);
      const [joined, members] = await Promise.all([
        checkIsJoined(channel.id),
        getChannelMembers(channel.id),
      ]);

      setIsJoined(joined);
      setMemberCount(members.length);
    } catch (error) {
      console.error('Error checking channel status:', error);
    } finally {
      setCheckingStatus(false);
    }
  }, [channel]);

  const handleJoin = useCallback(async () => {
    if (!channel) {
      return;
    }

    setLoading(true);

    try {
      await joinChannel(channel.id);
      setIsJoined(true);
      setMemberCount((prev) => prev + 1);
      if (onJoined) {
        await onJoined();
      }
    } catch (error) {
      console.error('Error joining channel:', error);
    } finally {
      setLoading(false);
    }
  }, [channel, onJoined]);

  useEffect(() => {
    if (channel && isOpen) {
      void checkJoinStatusAndMembers();
    }
  }, [channel, isOpen, checkJoinStatusAndMembers]);

  return {
    isJoined,
    memberCount,
    loading,
    checkingStatus,
    checkJoinStatusAndMembers,
    handleJoin,
  };
}
