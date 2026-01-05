import { ValidationErrors } from "@angular/forms";

export class FormUtils{
    static slugPattern = '^[a-z0-9_]+(?:-[a-z0-9_]+)*$';

    static isValidField = () => {

    }
 
    static getTextError = (errors: ValidationErrors) => {
        for (const key of Object.keys(errors)){
            switch (key) {
                case 'required':
                    return 'This field is required';
                case 'minlength':
                    return `Min. ${errors['minlenght'].requiredLength} characters`;
                case 'min':
                    return `Min value ${errors['min'].min}`
            }
        }
        return null
    }
}