import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export abstract class BaseCrudService<T> {
  protected abstract baseUrl: string;
  
  constructor(protected http: HttpClient) {}
  
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
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Error creating ${this.getEntityName()}:`, error);
      throw error;
    }
  }
  
  async update(id: number, data: Partial<T>): Promise<T> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Error updating ${this.getEntityName()} with id ${id}:`, error);
      throw error;
    }
  }
  
  async delete(id: number): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error(`Error deleting ${this.getEntityName()} with id ${id}:`, error);
      throw error;
    }
  }
  
  protected abstract getEntityName(): string;
}