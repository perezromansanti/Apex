export type Rol = "admin" | "socio";

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          nombre: string;
          apellido: string;
          email: string;
          rol: Rol;
          categoria: string | null;
          dorsal: number | null;
        };
        Insert: {
          id: string;
          nombre: string;
          apellido: string;
          email: string;
          rol?: Rol;
          categoria?: string | null;
          dorsal?: number | null;
        };
        Update: Partial<{
          nombre: string;
          apellido: string;
          email: string;
          rol: Rol;
          categoria: string | null;
          dorsal: number | null;
        }>;
        Relationships: [];
      };
      pruebas: {
        Row: {
          id: string;
          nombre: string;
          fecha: string;
          descripcion: string | null;
          fecha_limite_inscripcion: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          nombre: string;
          fecha: string;
          descripcion?: string | null;
          fecha_limite_inscripcion: string;
        };
        Update: Partial<{
          nombre: string;
          fecha: string;
          descripcion: string | null;
          fecha_limite_inscripcion: string;
        }>;
        Relationships: [];
      };
      inscripciones: {
        Row: {
          id: string;
          user_id: string;
          prueba_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          prueba_id: string;
        };
        Update: Record<string, never>;
        Relationships: [
          {
            foreignKeyName: "inscripciones_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "inscripciones_prueba_id_fkey";
            columns: ["prueba_id"];
            isOneToOne: false;
            referencedRelation: "pruebas";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: Record<string, never>;
    Functions: {
      is_admin: {
        Args: Record<string, never>;
        Returns: boolean;
      };
    };
  };
}
