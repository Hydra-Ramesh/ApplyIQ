import { useQuery } from '@tanstack/react-query';
import { env } from '../../../config/env';

export interface ResumeData {
  _id: string;
  title: string;
  targetRole: string;
  atsScore: number;
  updatedAt: string;
}

interface PaginatedResponse {
  data: ResumeData[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  }
}

export const useResumes = (page: number, limit: number = 10) => {
  return useQuery<PaginatedResponse>({
    queryKey: ['resumes', page, limit],
    queryFn: async () => {
      // Assuming a mock or actual logged in user session
      const response = await fetch(`${env.VITE_API_URL}/resumes?page=${page}&limit=${limit}`);
      if (!response.ok) {
        throw new Error('Failed to fetch resumes');
      }
      return response.json();
    },
    // keepPreviousData is replaced by placeholderData: keepPreviousData in v5, but we can just let it suspend or show loading
  });
};

export const saveResume = async (data: { title: string; targetRole: string; texCode: string; userId?: string }) => {
  const response = await fetch(`${env.VITE_API_URL}/resumes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(localStorage.getItem('token') ? { Authorization: `Bearer ${localStorage.getItem('token')}` } : {})
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error('Failed to save resume');
  }
  return response.json();
};

export const getResume = async (id: string) => {
  const response = await fetch(`${env.VITE_API_URL}/resumes/${id}`, {
    headers: {
      ...(localStorage.getItem('token') ? { Authorization: `Bearer ${localStorage.getItem('token')}` } : {})
    }
  });
  if (!response.ok) throw new Error('Failed to fetch resume');
  return response.json();
};

export const updateResume = async (id: string, data: Partial<{ title: string; targetRole: string; texCode: string; userId?: string; chatHistory?: {role: string, content: string}[], atsScore?: number }>) => {
  const response = await fetch(`${env.VITE_API_URL}/resumes/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...(localStorage.getItem('token') ? { Authorization: `Bearer ${localStorage.getItem('token')}` } : {})
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to update resume');
  return response.json();
};

export const deleteResume = async (id: string) => {
  const response = await fetch(`${env.VITE_API_URL}/resumes/${id}`, {
    method: 'DELETE',
    headers: {
      ...(localStorage.getItem('token') ? { Authorization: `Bearer ${localStorage.getItem('token')}` } : {})
    }
  });
  if (!response.ok) throw new Error('Failed to delete resume');
  return response.json();
};
