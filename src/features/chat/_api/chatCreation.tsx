import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import feathersClient from '@/src/shared/api/feathers';
import { useUser } from '@/src/shared/api/auth';
import { chatKeys } from './chat';

export const useStaffs = (facilityId?: string, locationId?: string) => {
    const { data: user } = useUser();
    return useQuery({
        queryKey: ['staffs', facilityId, locationId],
        queryFn: async () => {
            if (!user?._id) return [];
            const query: any = {
                facility: facilityId || user?.facilityDetail?._id,
                _id: { $ne: user._id },
                $limit: 200,
                $sort: { createdAt: -1 },
            };
            if (locationId) {
                query['locations._id'] = locationId;
            }
            const response = await feathersClient.service('employee').find({ query });
            return response.data || [];
        },
        enabled: !!user?._id,
    });
};

export const useFacilities = (searchQuery: string) => {
    const { data: user } = useUser();
    return useQuery({
        queryKey: ['facilities', searchQuery],
        queryFn: async () => {
            if (!searchQuery || searchQuery.length <= 3) return [];
            const response = await feathersClient.service('facility').find({
                query: {
                    _id: { $ne: user?.facilityDetail?._id },
                    $or: [
                        { facilityName: { $regex: searchQuery, $options: 'i' } },
                        { facilityOwner: { $regex: searchQuery, $options: 'i' } },
                        { facilityType: { $regex: searchQuery, $options: 'i' } },
                    ],
                    $limit: 100,
                    $sort: { createdAt: -1 },
                },
            });
            return response.data || [];
        },
        enabled: !!user?._id && searchQuery.length > 3,
    });
};

export const useClients = (searchQuery: string) => {
    const { data: user } = useUser();
    return useQuery({
        queryKey: ['clients', searchQuery],
        queryFn: async () => {
            if (!searchQuery || searchQuery.length <= 3) return [];
            const response = await feathersClient.service('client').find({
                query: {
                    $or: [
                        { firstname: { $regex: searchQuery, $options: 'i' } },
                        { lastname: { $regex: searchQuery, $options: 'i' } },
                        { phone: { $regex: searchQuery, $options: 'i' } },
                        { email: { $regex: searchQuery, $options: 'i' } },
                    ],
                    "relatedfacilities.facility": user?.facilityDetail?._id,
                    $limit: 100,
                    $sort: { createdAt: -1 },
                },
            });
            return response.data || [];
        },
        enabled: !!user?._id && searchQuery.length > 3,
    });
};

export const useLocations = (facilityId?: string) => {
    const { data: user } = useUser();
    return useQuery({
        queryKey: ['locations', facilityId],
        queryFn: async () => {
            if (!user?._id) return [];
            const response = await feathersClient.service('location').find({
                query: {
                    facility: facilityId || user?.facilityDetail?._id,
                    $limit: 200,
                    $sort: { createdAt: -1 },
                },
            });
            return response.data || [];
        },
        enabled: !!user?._id,
    });
};

export const useStartPersonalChat = () => {
    const { data: user } = useUser();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ userToChat, type = 'staff' }: { userToChat: any, type?: 'staff' | 'client' }) => {
            if (!user) throw new Error('User not found');
            const employee = user;

            const newChatRoom = {
                name: `personal ${type} chat`,
                description: `personal chat conversation between staff and ${type}`,
                chatType: "personal",
                members: [
                    {
                        name: `${employee.firstname} ${employee.lastname}`,
                        phone: employee.phone,
                        email: employee.email,
                        imageurl: employee.imageurl || "",
                        profession: employee.profession,
                        _id: employee._id,
                        type: "staff",
                        model: "employee",
                        organization: employee.facilityDetail,
                    },
                    {
                        name: `${userToChat.firstname} ${userToChat.lastname}`,
                        phone: userToChat.phone,
                        email: userToChat.email,
                        imageurl: userToChat.imageurl || "",
                        profession: userToChat.profession || 'Client',
                        _id: userToChat._id,
                        type: type,
                        model: type === 'client' ? 'client' : 'employee',
                        organization: userToChat.facilityDetail || employee.facilityDetail,
                    },
                ],
            };

            const res = await feathersClient.service('chatroom').find({
                query: {
                    members: newChatRoom.members,
                },
            });

            if (res.data && res.data.length > 0) {
                return res.data[0];
            } else {
                const newRoom = await feathersClient.service('chatroom').create(newChatRoom);
                return newRoom;
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: chatKeys.rooms() });
        },
    });
};

export const useCreateChannel = () => {
    const { data: user } = useUser();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: any) => {
            if (!user) throw new Error('User not found');
            const employee = user;

            const staffs = (data.staffs || []).map((staff: any) => ({
                name: `${staff.firstname} ${staff.lastname}`,
                phone: staff.phone,
                email: staff.email,
                imageurl: staff.imageurl || "",
                profession: staff.profession,
                _id: staff._id,
                type: "staff",
                model: "employee",
                organization: staff.facilityDetail || employee.facilityDetail,
            }));

            const clients = (data.clients || []).map((client: any) => ({
                name: `${client.firstname} ${client.lastname}`,
                phone: client.phone,
                email: client.email,
                imageurl: client.imageurl || "",
                profession: client.profession,
                _id: client._id,
                type: "client",
                model: "client",
                organization: employee.facilityDetail,
            }));

            const newChatRoom = {
                name: data.channel_name,
                description: data.channel_description,
                chatType: data.channel_type,
                members: [
                    {
                        name: `${employee.firstname} ${employee.lastname}`,
                        phone: employee.phone,
                        email: employee.email,
                        imageurl: employee.imageurl || "",
                        profession: employee.profession,
                        _id: employee._id,
                        type: "staff",
                        model: "employee",
                        organization: employee.facilityDetail,
                    },
                    ...staffs,
                    ...clients,
                ],
            };

            return await feathersClient.service('chatroom').create(newChatRoom);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: chatKeys.rooms() });
        },
    });
};
