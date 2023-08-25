import { api } from "@/services/apiClient";
import { apiService } from "./apiServices";

export const imo7ApiService = (entidade: string) => apiService(entidade, api); // Use a instância api padrão
