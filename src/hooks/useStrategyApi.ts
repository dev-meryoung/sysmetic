import { useMutation } from '@tanstack/react-query';
import { createStrategy } from '@/api';

export const useCreateStrategy = () =>
  useMutation({
    mutationFn: (formData: FormData) => createStrategy(formData),
  });
