/**
 * Validation class
 */
export default class Validation {
    success: boolean;
    message: string;

    /**
     * 
     * @param sucess If the validation was sucessful
     * @param message The validation message, if validation was not sucessful
     */
    constructor(sucess: boolean = true, message: string = "") {
        this.success = sucess;
        this.message = message;
    }
}