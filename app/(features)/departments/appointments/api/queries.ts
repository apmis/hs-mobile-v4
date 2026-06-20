import { useQuery } from '@tanstack/react-query';
import feathersClient from '@/app/shared/api/feathers';
import { PaginatedResponse } from '@/app/shared/api/types';
import { Appointment, AppointmentFilters } from './types';
import { appointmentKeys } from './keys';

export const useAppointments = (filters: AppointmentFilters = {}) => {
  return useQuery({
    queryKey: appointmentKeys.list(filters),
    queryFn: async () => {
      const response = await feathersClient.service('appointments').find({
        query: filters,
      });
      return response as PaginatedResponse<Appointment>;
    },
  });
};

export const useAppointment = (id: string) => {
  return useQuery({
    queryKey: appointmentKeys.detail(id),
    queryFn: async () => {
      const response = await feathersClient.service('appointments').get(id);
      return response as Appointment;
    },
    enabled: !!id, // Only run the query if we have a valid ID
  });
};
