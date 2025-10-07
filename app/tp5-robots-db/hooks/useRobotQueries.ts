import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as robotRepo from '../services/robotRepo';

// Fetch all robots
export function useRobotsQuery() {
  return useQuery({
    queryKey: ['robots'],
    queryFn: () => robotRepo.list(),
  });
}

// Fetch a single robot by id
export function useRobotQuery(id: string) {
  return useQuery({
    queryKey: ['robot', id],
    queryFn: () => robotRepo.getById(id),
    enabled: !!id,
  });
}

// Create robot
export function useCreateRobot() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: robotRepo.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['robots'] });
    },
  });
}

// Update robot
export function useUpdateRobot() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: { id: string; [key: string]: any }) => robotRepo.update(id, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['robots'] });
      queryClient.invalidateQueries({ queryKey: ['robot', variables.id] });
    },
  });
}

// Delete robot
export function useDeleteRobot() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => robotRepo.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['robots'] });
    },
  });
}
