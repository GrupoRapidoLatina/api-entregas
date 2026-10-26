import type { ResetPasswordEmailParams } from '../models/reset-password.model';

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function resetPasswordEmailHtml(params: ResetPasswordEmailParams): string {
  const name = escapeHtml(params.firstname || 'usuário');
  const url = escapeHtml(params.resetUrl);
  return `<!DOCTYPE html>
<html lang="pt-BR">
<body style="font-family: system-ui, sans-serif; color: #222;">
  <p>Olá ${name},</p>
  <p>Recebemos sua solicitação para redefinir a senha da conta <strong>${escapeHtml(params.email)}</strong>.</p>
  <p><a href="${url}" style="display:inline-block;padding:12px 18px;background:#e10600;color:#fff;text-decoration:none;border-radius:8px;">Abrir app e redefinir senha</a></p>
  <p>Ou copie o link: ${url}</p>
  <p>Este link é válido por <strong>2 horas</strong>.</p>
  <p>Grupo Rápido Latina — Rápido Entregas</p>
</body>
</html>`;
}
