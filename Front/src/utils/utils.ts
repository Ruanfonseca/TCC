export default function FuncaoVerificaEmail(email: string):boolean {

    const expression: RegExp = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

    const result: boolean = expression.test(email);

    return result;
}

export function VerificaMatricula(input: string): boolean {
    const expression: RegExp = /^\d{12}$/;
    const result: boolean = expression.test(input);
    return result;
}

export function VerificaSenha(input: any): boolean {
    
    const expression: RegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    const result: boolean = expression.test(input);
    return result;
}

export function GeradordeCodigo(): string {
    const length:number = 7;
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      result += characters[randomIndex];
    }
    return result;
  }