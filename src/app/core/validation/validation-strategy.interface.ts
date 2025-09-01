export interface ValidationStrategy<T> {
  validate(data: Partial<T>): ValidationResult;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}