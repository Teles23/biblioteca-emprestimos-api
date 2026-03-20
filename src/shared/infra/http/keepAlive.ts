import { env } from '../../../config/env';

const DEFAULT_TIMEOUT_MS = 10_000;

const normalizeKeepAliveUrl = (target: string): string => {
  const normalizedTarget = target.trim().replace(/\/+$/, '');

  if (!normalizedTarget) {
    return normalizedTarget;
  }

  let url: URL;

  try {
    url = new URL(normalizedTarget);
  } catch {
    console.warn(`[keep-alive] URL ignorada por ser inválida: ${target}`);
    return '';
  }

  if (!url.pathname || url.pathname === '/') {
    url.pathname = '/health';
  }

  return url.toString();
};

const pingTarget = async (target: string): Promise<void> => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT_MS);

  try {
    const response = await fetch(target, {
      method: 'GET',
      signal: controller.signal,
      headers: {
        'user-agent': 'biblioteca-emprestimos-api-keep-alive',
      },
    });

    if (!response.ok) {
      console.warn(
        `[keep-alive] Ping para ${target} retornou status ${response.status}.`,
      );
      return;
    }

    console.log(`[keep-alive] Ping enviado com sucesso para ${target}.`);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Erro desconhecido ao enviar ping.';

    console.warn(`[keep-alive] Falha ao pingar ${target}: ${message}`);
  } finally {
    clearTimeout(timeout);
  }
};

export const startKeepAlive = (): void => {
  if (!env.keepAliveEnabled) {
    return;
  }

  const targets = env.keepAliveTargets
    .map(normalizeKeepAliveUrl)
    .filter(Boolean);

  if (targets.length === 0) {
    console.warn(
      '[keep-alive] KEEP_ALIVE_ENABLED=true, mas nenhuma URL válida foi configurada em KEEP_ALIVE_TARGETS.',
    );
    return;
  }

  console.log(
    `[keep-alive] Ativo. Intervalo: ${env.keepAliveIntervalMs}ms. Destinos: ${targets.join(', ')}`,
  );

  const executePings = async (): Promise<void> => {
    await Promise.all(targets.map(target => pingTarget(target)));
  };

  void executePings();
  setInterval(() => {
    void executePings();
  }, env.keepAliveIntervalMs);
};
