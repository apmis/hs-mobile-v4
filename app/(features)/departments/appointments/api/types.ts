export interface Appointment {
  id: string;
  patientId: string;
  providerId: string;
  date: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AppointmentFilters {
  status?: string;
  providerId?: string;
  date?: string;
  // FeathersJS pagination and sorting
  $limit?: number;
  $skip?: number;
  $sort?: Record<string, 1 | -1>;
}
