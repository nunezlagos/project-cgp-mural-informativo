export interface Acta {
  id?:   number | undefined;
  titulo: string;
  cuerpo: string;
  autor: string;
  created_at?: string;
  updated_at?: string;
  status?: string;
}
