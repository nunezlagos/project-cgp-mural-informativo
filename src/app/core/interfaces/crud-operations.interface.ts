// Interface Segregation Principle - Interfaces específicas para operaciones CRUD

/**
 * Interface base para operaciones de lectura
 */
export interface IReadOperations<T> {
  getAll(): Promise<T[]>;
  getById(id: number): Promise<T>;
}

/**
 * Interface para operaciones de escritura
 */
export interface IWriteOperations<T> {
  create(data: Partial<T>): Promise<T>;
  update(id: number, data: Partial<T>): Promise<T>;
}

/**
 * Interface para operaciones de eliminación
 */
export interface IDeleteOperations {
  delete(id: number): Promise<void>;
}

/**
 * Interface completa para operaciones CRUD
 * Combina todas las interfaces específicas
 */
export interface ICrudOperations<T> extends 
  IReadOperations<T>, 
  IWriteOperations<T>, 
  IDeleteOperations {
}

/**
 * Interface para servicios que manejan estado reactivo
 */
export interface IReactiveState<T> {
  getState(): T[];
  updateState(data: T[]): void;
}

/**
 * Interface para validación de entidades
 */
export interface IValidatable<T> {
  validate(data: Partial<T>): { isValid: boolean; errors: string[] };
}

/**
 * Interface para servicios con capacidades de cache
 */
export interface ICacheable {
  clearCache(): void;
  refreshCache(): Promise<void>;
}