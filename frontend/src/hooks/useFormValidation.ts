import { useState, useCallback } from 'react';

export interface ValidationRule {
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    pattern?: RegExp;
    validate?: (value: any) => boolean | string;
    customMessage?: string;
}

export interface ValidationRules {
    [key: string]: ValidationRule;
}

export interface FormErrors {
    [key: string]: string;
}

export function useFormValidation<T extends Record<string, any>>(
    initialValues: T,
    validationRules: ValidationRules
) {
    const [values, setValues] = useState<T>(initialValues);
    const [errors, setErrors] = useState<FormErrors>({});
    const [touched, setTouched] = useState<Record<string, boolean>>({});

    // Validate single field
    const validateField = useCallback(
        (name: string, value: any): string => {
            const rules = validationRules[name];
            if (!rules) return '';

            // Required
            if (rules.required && (!value || value.toString().trim() === '')) {
                return 'ฟิลด์นี้จำเป็นต้องกรอก';
            }

            // Min length
            if (rules.minLength && value.length < rules.minLength) {
                return `ต้องมีอย่างน้อย ${rules.minLength} ตัวอักษร`;
            }

            // Max length
            if (rules.maxLength && value.length > rules.maxLength) {
                return `ต้องไม่เกิน ${rules.maxLength} ตัวอักษร`;
            }

            // Pattern (regex)
            if (rules.pattern && !rules.pattern.test(value)) {
                return rules.customMessage || 'รูปแบบไม่ถูกต้อง';
            }

            // Custom validation
            if (rules.validate) {
                const result = rules.validate(value);
                if (typeof result === 'string') return result;
                if (!result) return 'ข้อมูลไม่ถูกต้อง';
            }

            return '';
        },
        [validationRules]
    );

    // Validate all fields
    const validateForm = useCallback((): boolean => {
        const newErrors: FormErrors = {};
        let isValid = true;

        Object.keys(validationRules).forEach((fieldName) => {
            const error = validateField(fieldName, values[fieldName]);
            if (error) {
                newErrors[fieldName] = error;
                isValid = false;
            }
        });

        setErrors(newErrors);
        return isValid;
    }, [values, validationRules, validateField]);

    // Handle field change
    const handleChange = useCallback(
        (name: string, value: any) => {
            setValues((prev) => ({ ...prev, [name]: value }));

            // Validate on change if field was touched
            if (touched[name]) {
                const error = validateField(name, value);
                setErrors((prev) => ({ ...prev, [name]: error }));
            }
        },
        [touched, validateField]
    );

    // Handle field blur
    const handleBlur = useCallback(
        (name: string) => {
            setTouched((prev) => ({ ...prev, [name]: true }));
            const error = validateField(name, values[name]);
            setErrors((prev) => ({ ...prev, [name]: error }));
        },
        [values, validateField]
    );

    // Reset form
    const resetForm = useCallback(() => {
        setValues(initialValues);
        setErrors({});
        setTouched({});
    }, [initialValues]);

    return {
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        validateForm,
        resetForm,
        setValues,
    };
}

// Email validation
export const emailValidation: ValidationRule = {
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    validate: (value: string) => {
        if (!value.includes('@')) return 'กรุณากรอกอีเมลให้ถูกต้อง';
        return true;
    },
};

// Password validation
export const passwordValidation: ValidationRule = {
    required: true,
    minLength: 8,
    validate: (value: string) => {
        if (!/[A-Z]/.test(value)) return 'ต้องมีตัวพิมพ์ใหญ่อย่างน้อย 1 ตัว';
        if (!/[a-z]/.test(value)) return 'ต้องมีตัวพิมพ์เล็กอย่างน้อย 1 ตัว';
        if (!/[0-9]/.test(value)) return 'ต้องมีตัวเลขอย่างน้อย 1 ตัว';
        if (!/[!@#$%^&*]/.test(value)) return 'ต้องมีอักขระพิเศษอย่างน้อย 1 ตัว (!@#$%^&*)';
        return true;
    },
};

// Password strength checker
export function getPasswordStrength(password: string): {
    score: number;
    label: string;
    color: string;
} {
    let score = 0;

    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[!@#$%^&*]/.test(password)) score++;

    if (score <= 2) return { score, label: 'อ่อนแอ', color: 'bg-red-500' };
    if (score <= 4) return { score, label: 'ปานกลาง', color: 'bg-yellow-500' };
    return { score, label: 'แข็งแรง', color: 'bg-green-500' };
}
