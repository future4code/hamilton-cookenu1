
export function validatePassword( password : string ) : boolean {
    const regexp = new RegExp(/(?=.{6,})/);
    const validation = regexp.test(password);

    return validation 
    }