import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ICrudOperations } from '../interfaces/crud-operations.interface';

// Dependency Inversion Principle - Implementación de interface
@Injectable()
export abstract class BaseCrudService<T> implements ICrudOperations<T> {
  protected abstract baseUrl: string;
  
  constructor(protected http: HttpClient) {}
  
  // Template Method Pattern - Método abstracto para personalización
  protected abstract getEntityName(): string;
  
  // Hook methods para extensibilidad
  protected beforeCreate?(data: Partial<T>): Partial<T>;
  protected afterCreate?(result: T): void;
  protected beforeUpdate?(id: number, data: Partial<T>): Partial<T>;
  protected afterUpdate?(result: T): void;
  protected beforeDelete?(id: number): void;
  protected afterDelete?(id: number): void;
  
  async getAll(): Promise<T[]> {
    try {
      const response = await fetch(this.baseUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Error fetching ${this.getEntityName()}s:`, error);
      throw error;
    }
  }
  
  async getById(id: number): Promise<T> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Error fetching ${this.getEntityName()} with id ${id}:`, error);
      throw error;
    }
  }
  
  async create(data: Partial<T>): Promise<T> {
    try {
      // Hook method - permite personalización antes de crear
      const processedData = this.beforeCreate ? this.beforeCreate(data) : data;
      
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(processedData)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      // Hook method - permite acciones después de crear
      if (this.afterCreate) {
        this.afterCreate(result);
      }
      
      return result;
    } catch (error) {
      console.error(`Error creating ${this.getEntityName()}:`, error);
      throw error;
    }
  }
  
  async update(id: number, data: Partial<T>): Promise<T> {
    try {
      // Hook method - permite personalización antes de actualizar
      const processedData = this.beforeUpdate ? this.beforeUpdate(id, data) : data;
      
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(processedData)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      // Hook method - permite acciones después de actualizar
      if (this.afterUpdate) {
        this.afterUpdate(result);
      }
      
      return result;
    } catch (error) {
      console.error(`Error updating ${this.getEntityName()} with id ${id}:`, error);
      throw error;
    }
  }
  
  async delete(id: number): Promise<void> {
    try {
      // Hook method - permite acciones antes de eliminar
      if (this.beforeDelete) {
        this.beforeDelete(id);
      }
      
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      // Hook method - permite acciones después de eliminar
      if (this.afterDelete) {
        this.afterDelete(id);
      }
    } catch (error) {
      console.error(`Error deleting ${this.getEntityName()} with id ${id}:`, error);
      throw error;
    }
  }
}