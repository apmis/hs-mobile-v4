import { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import feathersClient from '@/src/shared/api/feathers';
import { useUser } from '@/src/shared/api/auth';
import Toast from 'react-native-toast-message';

export const chatKeys = {
    all: ['chat'] as const,
    rooms: () => [...chatKeys.all, 'rooms'] as const,
    messages: (roomId: string) => [...chatKeys.all, 'messages', roomId] as const,
};

const getRoomSortTime = (room: any) => {
    return new Date(room.lastmessage?.time || room.lastmessage?.createdAt || room.updatedAt || room.createdAt || 0).getTime();
};

export const useChatRooms = () => {
    const { data: user } = useUser();
    const queryClient = useQueryClient();

    const query = useQuery({
        queryKey: chatKeys.rooms(),
        queryFn: async () => {
            if (!user?._id) return [];
            const response = await feathersClient.service('chatroom').find({
                query: { 'members._id': user._id, $sort: { updatedAt: -1 } },
            });

            const data = response.data || [];

            if (data.length > 0) {
                const roomIds = data.map((r: any) => r._id);
                try {
                    // Fetch unread counts in the background so we don't block the chat list from rendering
                    feathersClient.service('chat').find({
                        query: {
                            chatroomId: { $in: roomIds },
                            createdbyId: { $ne: user._id },
                            status: { $ne: 'read' },
                            $select: ['chatroomId'],
                            $limit: 1000
                        }
                    }).then((unreadResponse: any) => {
                        const unreadMsgs = Array.isArray(unreadResponse) ? unreadResponse : unreadResponse.data || [];
                        const counts: Record<string, number> = {};
                        unreadMsgs.forEach((m: any) => { counts[m.chatroomId] = (counts[m.chatroomId] || 0) + 1; });

                        queryClient.setQueryData(chatKeys.rooms(), (old: any[] = []) => {
                            if (!old) return old;
                            return old.map(r => ({
                                ...r,
                                unreadCount: counts[r._id] || 0
                            }));
                        });
                    }).catch((error: any) => {
                        console.error("Failed to fetch initial unread counts in background", error);
                    });

                    // Set default unreadCount to 0 immediately
                    data.forEach((r: any) => {
                        r.unreadCount = 0;
                    });
                } catch (error: any) {
                    console.error("Error setting up background unread fetch", error);
                }
            }

            return data.sort((a: any, b: any) => getRoomSortTime(b) - getRoomSortTime(a));
        },
        enabled: !!user?._id,
    });

    // Real-time listeners
    useEffect(() => {
        if (!user?._id) return;

        const chatroomServer = feathersClient.service('chatroom');

        const handleCreated = (obj: any) => {
            queryClient.setQueryData(chatKeys.rooms(), (old: any[] = []) => {
                let unreadCount = 0;
                if (obj.lastmessage && obj.lastmessage.createdbyId !== user._id && obj.lastmessage.status !== 'read') {
                    unreadCount = 1;
                }
                const newArr = [{ ...obj, unreadCount }, ...old];
                return newArr.sort((a, b) => getRoomSortTime(b) - getRoomSortTime(a));
            });
        };

        const handlePatched = (obj: any) => {
            queryClient.setQueryData(chatKeys.rooms(), (old: any[] = []) => {
                const newArr = old.map((item) => {
                    if (item._id === obj._id) {
                        let newUnreadCount = item.unreadCount || 0;

                        const isNewLastMessage = obj.lastmessage && (!item.lastmessage ||
                            (obj.lastmessage._id && obj.lastmessage._id !== item.lastmessage._id) ||
                            (obj.lastmessage.time && obj.lastmessage.time !== item.lastmessage.time) ||
                            (obj.lastmessage.createdAt && obj.lastmessage.createdAt !== item.lastmessage.createdAt)
                        );

                        if (
                            isNewLastMessage &&
                            obj.lastmessage.createdbyId !== user._id &&
                            obj.lastmessage.status !== 'read'
                        ) {
                            newUnreadCount += 1;
                        } else if (obj.lastmessage && obj.lastmessage.status === 'read') {
                            newUnreadCount = 0;
                        }

                        return { ...obj, unreadCount: newUnreadCount };
                    }
                    return item;
                });

                // If it doesn't exist, we can optionally push it
                if (!old.some(item => item._id === obj._id)) {
                    let unreadCount = 0;
                    if (obj.lastmessage && obj.lastmessage.createdbyId !== user._id && obj.lastmessage.status !== 'read') {
                        unreadCount = 1;
                    }
                    newArr.push({ ...obj, unreadCount });
                }

                // Sort by last message time so marking as read doesn't jump the chat
                return newArr.sort((a, b) => getRoomSortTime(b) - getRoomSortTime(a));
            });
        };

        const handleRemoved = (obj: any) => {
            queryClient.setQueryData(chatKeys.rooms(), (old: any[] = []) =>
                old.filter((item) => item._id !== obj._id)
            );
        };

        chatroomServer.on('created', handleCreated);
        chatroomServer.on('patched', handlePatched);
        chatroomServer.on('removed', handleRemoved);

        // Global message listener to handle "delivered" receipts
        const chatMessagesServer = feathersClient.service('chat');
        const handleGlobalMessageCreated = (msg: any) => {
            if (msg.createdbyId !== user?._id && msg.status === 'sent') {
                // Background update: Tell the sender their message was delivered
                feathersClient.service('chat').patch(msg._id, { status: 'delivered' }).catch(() => { });

                // Also update the chatroom's last message to delivered
                const chatrooms = queryClient.getQueryData(chatKeys.rooms()) as any[];
                const room = chatrooms?.find((r) => r._id === msg.chatroomId);
                if (room?.lastmessage && room.lastmessage._id === msg._id) {
                    feathersClient.service('chatroom').patch(msg.chatroomId, {
                        lastmessage: { ...room.lastmessage, status: 'delivered' }
                    }).catch(() => { });
                }
            }
        };
        chatMessagesServer.on('created', handleGlobalMessageCreated);

        return () => {
            chatroomServer.removeListener('created', handleCreated);
            chatroomServer.removeListener('patched', handlePatched);
            chatroomServer.removeListener('removed', handleRemoved);
            chatMessagesServer.removeListener('created', handleGlobalMessageCreated);
        };
    }, [user?._id, queryClient]);

    return query;
};

export const useChatMessages = (chatRoom: any) => {
    const queryClient = useQueryClient();
    const roomId = chatRoom?._id;

    const query = useQuery({
        queryKey: chatKeys.messages(roomId),
        queryFn: async () => {
            if (!roomId) return [];
            const response = await feathersClient.service('chat').find({
                query: { chatroomId: roomId, $sort: { createdAt: 1 } },
            });
            return response.data || [];
        },
        enabled: !!roomId,
    });

    useEffect(() => {
        if (!roomId) return;

        const chatMessagesServer = feathersClient.service('chat');

        const handleMessageCreated = (obj: any) => {
            if (obj.chatroomId === roomId) {
                queryClient.setQueryData(chatKeys.messages(roomId), (old: any[] = []) => {
                    // Overwrite if it already exists with the same ID
                    const existingIndex = old.findIndex((m) => m._id === obj._id);
                    if (existingIndex !== -1) {
                        const newArr = [...old];
                        newArr[existingIndex] = obj;
                        return newArr;
                    }

                    // Overwrite pending optimistic UI matches
                    const tempIndex = old.findIndex(
                        (m) =>
                            m.status === 'sending' &&
                            m.message === obj.message &&
                            m.createdbyId === obj.createdbyId
                    );

                    if (tempIndex !== -1) {
                        const newArr = [...old];
                        newArr[tempIndex] = obj;
                        return newArr;
                    }

                    return [...old, obj];
                });
            }
        };

        const handleMessagePatched = (objOrArray: any) => {
            const items = Array.isArray(objOrArray) ? objOrArray : [objOrArray];

            queryClient.setQueryData(chatKeys.messages(roomId), (old: any[] = []) => {
                let hasChanges = false;
                const newArr = [...old];

                items.forEach(obj => {
                    if (obj.chatroomId === roomId) {
                        const index = newArr.findIndex((m) => m._id === obj._id);
                        if (index !== -1) {
                            newArr[index] = { ...newArr[index], ...obj };
                            hasChanges = true;
                        }
                    }
                });

                return hasChanges ? newArr : old;
            });
        };

        chatMessagesServer.on('created', handleMessageCreated);
        chatMessagesServer.on('patched', handleMessagePatched);
        return () => {
            chatMessagesServer.removeListener('created', handleMessageCreated);
            chatMessagesServer.removeListener('patched', handleMessagePatched);
        };
    }, [roomId, queryClient]);

    return query;
};

export const useSendMessage = () => {
    const { data: user } = useUser();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            chatRoom,
            inputMessage,
            locationCoordinates,
        }: {
            chatRoom: any;
            inputMessage: string;
            locationCoordinates?: { latitude: number; longitude: number };
        }) => {
            if (!chatRoom || !user) throw new Error('Missing chatroom or user');

            const employee = user;
            const message = {
                subject: 'new-message',
                chatroom: chatRoom,
                chatroomId: chatRoom._id,
                messageType: 'text',
                message: inputMessage,
                status: 'sent',
                createdby: employee,
                createdbyId: employee._id,
                geolocation: {
                    type: 'Point',
                    coordinates: [
                        locationCoordinates?.latitude || 0,
                        locationCoordinates?.longitude || 0,
                    ],
                },
            };

            const lastmessage = {
                messageType: 'text',
                message: inputMessage,
                status: 'sent',
                createdby: employee,
                createdbyId: employee._id,
                time: Date.now(),
            };

            // Send the actual message
            const savedMsg = await feathersClient.service('chat').create(message);

            // Patch the chatroom
            await feathersClient.service('chatroom').patch(chatRoom._id, { lastmessage });

            return savedMsg;
        },
        onMutate: async ({ chatRoom, inputMessage, locationCoordinates }) => {
            if (!user) return;
            const roomId = chatRoom._id;

            await queryClient.cancelQueries({ queryKey: chatKeys.messages(roomId) });
            await queryClient.cancelQueries({ queryKey: chatKeys.rooms() });

            const previousMessages = queryClient.getQueryData(chatKeys.messages(roomId));
            const previousRooms = queryClient.getQueryData(chatKeys.rooms());

            const optimisticMessage = {
                subject: 'new-message',
                chatroom: chatRoom,
                chatroomId: roomId,
                messageType: 'text',
                message: inputMessage,
                status: 'sending',
                createdby: user,
                createdbyId: user._id,
                _id: `temp-${Date.now()}`,
                createdAt: new Date().toISOString(),
                geolocation: {
                    type: 'Point',
                    coordinates: [
                        locationCoordinates?.latitude || 0,
                        locationCoordinates?.longitude || 0,
                    ],
                },
            };

            // 1. Optimistically add the message to the Chat Details
            queryClient.setQueryData(chatKeys.messages(roomId), (old: any[] = []) => [
                ...old,
                optimisticMessage,
            ]);

            // 2. Optimistically update the Chat List's last message and sort it to the top
            queryClient.setQueryData(chatKeys.rooms(), (old: any[] = []) => {
                const newArr = old.map((room) => {
                    if (room._id === roomId) {
                        return {
                            ...room,
                            lastmessage: optimisticMessage,
                            updatedAt: new Date().toISOString(),
                        };
                    }
                    return room;
                });
                return newArr.sort((a, b) => getRoomSortTime(b) - getRoomSortTime(a));
            });

            return { previousMessages, previousRooms, optimisticMessage, roomId };
        },
        onError: (err, variables, context) => {
            if (context?.roomId && context?.previousMessages) {
                queryClient.setQueryData(chatKeys.messages(context.roomId), context.previousMessages);
            }
            if (context?.previousRooms) {
                queryClient.setQueryData(chatKeys.rooms(), context.previousRooms);
            }
            Toast.show({
                type: 'error',
                text1: 'Message failed to send',
                text2: err.message || String(err),
            });
        },
        onSuccess: (savedMsg, variables, context) => {
            if (!context?.roomId) return;
            const roomId = context.roomId;

            // Ensure the saved message replaces the optimistic one, even if background refetch wiped it
            queryClient.setQueryData(chatKeys.messages(roomId), (old: any[] = []) => {
                const index = old.findIndex(
                    (m) => m._id === savedMsg._id || m._id === context.optimisticMessage._id || (m.status === 'sending' && m.message === savedMsg.message)
                );
                if (index !== -1) {
                    const newArr = [...old];
                    newArr[index] = savedMsg;
                    return newArr;
                }
                return [...old, savedMsg];
            });

            // Invalidate queries to guarantee perfect sync with the backend state
            queryClient.invalidateQueries({ queryKey: chatKeys.messages(roomId) });
            queryClient.invalidateQueries({ queryKey: chatKeys.rooms() });
        },
    });
};

export const useMarkAsRead = () => {
    const { data: user } = useUser();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (roomId: string) => {
            if (!user?._id || !roomId) return;

            // 1. Patch unread messages
            try {
                await feathersClient.service('chat').patch(
                    null,
                    { status: 'read' },
                    {
                        query: {
                            chatroomId: roomId,
                            createdbyId: { $ne: user._id },
                            status: { $ne: 'read' },
                        },
                    }
                );
            } catch (err: any) {
                // If multi-patch is disabled, fallback to fetching and patching individually
                if (err.name === 'MethodNotAllowed' || err.code === 405) {
                    const unreadMsgs = await feathersClient.service('chat').find({
                        query: {
                            chatroomId: roomId,
                            createdbyId: { $ne: user._id },
                            status: { $ne: 'read' },
                            $select: ['_id']
                        }
                    });
                    const msgs = Array.isArray(unreadMsgs) ? unreadMsgs : unreadMsgs.data;
                    await Promise.all(
                        msgs.map((m: any) => feathersClient.service('chat').patch(m._id, { status: 'read' }))
                    );
                } else {
                    console.error("Error patching chat messages:", err);
                    throw err;
                }
            }

            // 2. Patch the chatroom's lastmessage object so the backend knows
            const chatrooms = queryClient.getQueryData(chatKeys.rooms()) as any[];
            const room = chatrooms?.find((r) => r._id === roomId);
            if (room?.lastmessage && room.lastmessage.createdbyId !== user._id) {
                try {
                    await feathersClient.service('chatroom').patch(roomId, {
                        lastmessage: { ...room.lastmessage, status: 'read' }
                        // Removed unreadCount: 0 to prevent schema validation errors
                    });
                } catch (err) {
                    console.error("Error patching chatroom lastmessage:", err);
                    throw err;
                }
            }
        },
        onMutate: async (roomId: string) => {
            if (!user?._id || !roomId) return;

            await queryClient.cancelQueries({ queryKey: chatKeys.rooms() });
            const previousRooms = queryClient.getQueryData(chatKeys.rooms());

            queryClient.setQueryData(chatKeys.rooms(), (old: any[] = []) => {
                return old.map((room) => {
                    if (room._id === roomId) {
                        return {
                            ...room,
                            lastmessage: room.lastmessage && room.lastmessage.createdbyId !== user._id
                                ? { ...room.lastmessage, status: 'read' }
                                : room.lastmessage,
                            unreadCount: 0,
                        };
                    }
                    return room;
                });
            });

            return { previousRooms };
        },
        onError: (err, variables, context) => {
            if (context?.previousRooms) {
                queryClient.setQueryData(chatKeys.rooms(), context.previousRooms);
            }
        },
    });
};

export const useDeleteChat = () => {
    const { data: user } = useUser();
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: async (chatId: string) => {
            if (!user?._id) throw new Error("User not found");

            // Get current room from cache
            const rooms = queryClient.getQueryData(chatKeys.rooms()) as any[];
            const room = rooms?.find(r => r._id === chatId);

            if (room && room.members) {
                // Filter out the current user from the members array
                const newMembers = room.members.filter((m: any) => m._id !== user._id);
                
                // Patch the chatroom with the updated members list
                return await feathersClient.service('chatroom').patch(chatId, { members: newMembers });
            } else {
                // Fallback (though unlikely to happen)
                throw new Error("Chatroom data not found in cache");
            }
        },
        onSuccess: (_, chatId) => {
            // Optimistically remove from cache
            queryClient.setQueryData(chatKeys.rooms(), (old: any[] = []) => 
                old.filter(r => r._id !== chatId)
            );
            Toast.show({ type: 'success', text1: 'Chat deleted successfully' });
        },
        onError: (error: any) => {
            Toast.show({ type: 'error', text1: 'Failed to delete chat', text2: error.message });
        }
    });
};

// -------------------------------------------------------------
// COPILOT API
// -------------------------------------------------------------


