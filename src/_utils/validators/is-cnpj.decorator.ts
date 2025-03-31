import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

export function IsCNPJ(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            name: 'isCNPJ',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: {
                validate(value: string, _args: ValidationArguments) {
                    if (typeof value !== 'string') return false;

                    // Remove caracteres não numéricos
                    const cnpj = value.replace(/[^\d]/g, '');

                    // Verificações iniciais
                    if (cnpj.length !== 14) return false;

                    // Verifica se todos os dígitos são iguais (caso inválido)
                    if (/^(\d)\1+$/.test(cnpj)) return false;

                    // Algoritmo de validação do CNPJ
                    // Cálculo do primeiro dígito verificador
                    let soma = 0;
                    let peso = 5;

                    for (let i = 0; i < 12; i++) {
                        soma += parseInt(cnpj.charAt(i)) * peso;
                        peso = (peso === 2) ? 9 : peso - 1;
                    }

                    let resto = soma % 11;
                    const dv1 = (resto < 2) ? 0 : 11 - resto;

                    // Cálculo do segundo dígito verificador
                    soma = 0;
                    peso = 6;

                    for (let i = 0; i < 12; i++) {
                        soma += parseInt(cnpj.charAt(i)) * peso;
                        peso = (peso === 2) ? 9 : peso - 1;
                    }

                    soma += dv1 * 2;
                    resto = soma % 11;
                    const dv2 = (resto < 2) ? 0 : 11 - resto;

                    // Verifica se os dígitos calculados são iguais aos dígitos informados
                    return parseInt(cnpj.charAt(12)) === dv1 && parseInt(cnpj.charAt(13)) === dv2;
                },
                defaultMessage(_args: ValidationArguments) {
                    return 'O CNPJ fornecido não é válido';
                }
            },
        });
    };
}