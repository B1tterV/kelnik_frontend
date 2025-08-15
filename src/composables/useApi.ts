import { defu } from "defu";
import type { UseFetchOptions } from "#app";
import { useFetch } from "#imports";

export function useApi<T>(
  url: string | (() => string),
  options: UseFetchOptions<T> = {},
  requestHeaders: object,
) {
  const config = useRuntimeConfig();
  const router = useRouter();

  if (!config.public.apiUrl) {
    throw createError({
      statusCode: 523,
      statusMessage: "Не указан url для API в конфигурации окружения",
    });
  }

  const headers: any = {
    "X-AD-OS": "Web",
    "X-Ad-Locale": "ru",
    ...requestHeaders,
  };

  const apiUrl = config.public.apiUrl;

  const defaults: UseFetchOptions<T> = {
    baseURL: apiUrl,
    headers,

    onResponse(_ctx) {
      // Здесь можно сделать что-нибудь с ответом
    },

    async onResponseError(ctx) {
      // Здесь можно сделать что-нибудь с ошибкой
    },
  };

  const params = defu(options, defaults);

  return useFetch(url, params);
}

