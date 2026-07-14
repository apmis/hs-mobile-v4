import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import feathersClient from './feathers';
import { useUser } from './auth';

export const notificationKeys = {
  all: ['notifications'] as const,
  lists: () => [...notificationKeys.all, 'list'] as const,
};

export const useNotifications = () => {
  const { data: user } = useUser();

  // console.log('facility', user?.facilityDetail?._id);
  // console.log('user', user?.stacker);

  return useQuery({
    queryKey: notificationKeys.lists(),
    queryFn: async () => {
      if (!user) return [];

      // Natively wait for the socket to finish authenticating before making the query.
      // If it's already authenticated, this resolves instantly.
      try {
        await feathersClient.authenticate();
      } catch (e) {
        // Ignore errors, let the find() call handle any real 401s
      }

      const userId = user?._id;
      const facilityId = user?.facilityDetail?._id

      if (!user.stacker) {
        const response = await feathersClient.service('notification').find({
          query: {
            facilityId: facilityId,
            $limit: 50,
            senderId: {
              $ne: userId,
            },
            isRead: {
              $ne: userId,
            },
            $sort: {
              createdAt: -1,
            },
          },
        });
        //console.log('NOTIFICATIONS', response.data);
        return response.data;
      } else {
        const response = await feathersClient.service('notification').find({
          query: {
            //facilityId: facilityId,
            $limit: 100,
            $sort: {
              createdAt: -1
            },
          },
        });
        return response.data;
      }
    },
    enabled: !!user,
  });
};

export const useMarkAsRead = () => {
  const queryClient = useQueryClient();
  const { data: user } = useUser();

  return useMutation({
    mutationFn: async (notification: any) => {
      if (!user) throw new Error('User not found');

      const prevReads = notification.isRead || [];
      const documentId = notification._id;
      const userId = user.currentEmployee?._id || user._id;

      if (prevReads.includes(userId)) {
        return notification; // already read
      }

      const newReads = [userId, ...prevReads];

      return await feathersClient.service('notification').patch(documentId, {
        isRead: newReads,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.lists() });
    },
  });
};
