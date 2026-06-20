import { useMutation, useQueryClient } from '@tanstack/react-query';
import feathersClient from '@/app/shared/api/feathers';
import { Appointment } from './types';
import { appointmentKeys } from './keys';

export const useCreateAppointment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<Appointment>) => {
      const response = await feathersClient.service('appointments').create(data);
      return response as Appointment;
    },
    onSuccess: () => {
      // Invalidate the lists to fetch the newly created data
      queryClient.invalidateQueries({ queryKey: appointmentKeys.lists() });
    },
  });
};

export const useUpdateAppointment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Appointment> }) => {
      const response = await feathersClient.service('appointments').patch(id, data);
      return response as Appointment;
    },
    onSuccess: (updatedData) => {
      // Invalidate both the list and the specific detail query
      queryClient.invalidateQueries({ queryKey: appointmentKeys.lists() });
      queryClient.invalidateQueries({ queryKey: appointmentKeys.detail(updatedData.id) });
    },
  });
};

export const useDeleteAppointment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await feathersClient.service('appointments').remove(id);
      return response as Appointment;
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: appointmentKeys.lists() });
      queryClient.removeQueries({ queryKey: appointmentKeys.detail(id) });
    },
  });
};
