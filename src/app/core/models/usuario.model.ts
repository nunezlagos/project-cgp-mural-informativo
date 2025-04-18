export interface Usuario {
  id?: number;
  usuario: string;
  contrasena: string; // Se almacenará en forma encriptada
  created_at?: string;
  updated_at?: string;
  status?: string;
}
