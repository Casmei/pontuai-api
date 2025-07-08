import { Logger } from '@nestjs/common';
import { WhatsappNotificationType } from 'src/modules/tenant/entities/tenant-config.entity';

export function validateTemplateVariables(
  expectedVariables: string[],
  providedValues: Record<string, string>,
  templateType: WhatsappNotificationType,
): boolean {
  const logger = new Logger('WhatsappTemplateValidator');

  // Valida apenas se TODAS as variáveis esperadas estão presentes nos valores fornecidos
  const missing = expectedVariables.filter(
    (variable) => !(variable in providedValues),
  );

  if (missing.length > 0) {
    logger.warn(
      `Variáveis ausentes para o template ${templateType}: ${missing.join(', ')}`,
    );
    return false;
  }

  // Não importa se existem variáveis a mais em providedValues
  return true;
}

export function renderTemplate(
  template: string,
  variables: Record<string, string>,
) {
  return template.replace(/{{(.*?)}}/g, (_, key) => {
    return variables[key.trim()] ?? '';
  });
}
