#!/usr/bin/env bash
# Выкладка лендинга на VPS (72.56.30.71) как статики. Запуск из Git Bash:
#   bash scripts/deploy-server.sh            # собрать и выложить
#   bash scripts/deploy-server.sh rollback   # вернуть предыдущий релиз
#
# Сайт изолирован от остальных проектов на сервере:
#   /var/www/eva-dent/releases/<дата>   — каждая выкладка в своей папке
#   /var/www/eva-dent/current           — ссылка на рабочий релиз
#   /etc/nginx/sites-available/eva-dent — свой конфиг, свои логи
# Новый релиз кладётся рядом и включается мгновенным переключением ссылки,
# поэтому сайт не бывает «наполовину залит». Хранятся последние 5 релизов.
set -euo pipefail

HOST="root@72.56.30.71"
KEY="${DEPLOY_KEY:-/d/vaznoe/ssh/id_ed25519}"
BASE="/var/www/eva-dent"
KEEP=5
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
WORK="$(mktemp -d)"
# В Git Bash `kill` гасит только обёртку npm, а wrangler/workerd остаются
# висеть, держат dist (EPERM при следующей сборке) и порт 8787 — тогда
# снимок мог бы уехать со СТАРОЙ сборки. Поэтому гасим всё дерево по Windows-PID.
stop_worker() {
  [[ -n "${WORKER_PID:-}" ]] || return 0
  local winpid
  winpid="$(cat "/proc/$WORKER_PID/winpid" 2>/dev/null || true)"
  if [[ -n "$winpid" ]] && command -v taskkill >/dev/null; then
    taskkill //PID "$winpid" //T //F >/dev/null 2>&1 || true
  else
    kill "$WORKER_PID" 2>/dev/null || true
  fi
  WORKER_PID=""
}
trap 'stop_worker; rm -rf "$WORK"' EXIT

SSH_OPTS=(-i "$KEY" -o BatchMode=yes -o IdentitiesOnly=yes -o ConnectTimeout=20)
# Если прямой доступ закрыт (например, fail2ban забанил IP), можно ходить
# через локальный HTTP-прокси: DEPLOY_PROXY=127.0.0.1:10809 bash scripts/deploy-server.sh
if [[ -n "${DEPLOY_PROXY:-}" ]]; then
  SSH_OPTS+=(-o "ProxyCommand=connect -H $DEPLOY_PROXY %h %p")
fi
remote() { ssh "${SSH_OPTS[@]}" "$HOST" "$@"; }

if [[ "${1:-}" == "rollback" ]]; then
  remote "set -e; cd $BASE/releases
    cur=\$(basename \$(readlink $BASE/current)); prev=\$(ls -1 | sort | grep -B1 -x \"\$cur\" | head -1)
    [ -n \"\$prev\" ] && [ \"\$prev\" != \"\$cur\" ] || { echo 'Нет предыдущего релиза'; exit 1; }
    ln -sfn releases/\$prev $BASE/current.tmp && mv -Tf $BASE/current.tmp $BASE/current
    echo \"Откат: \$cur -> \$prev\""
  exit 0
fi

if curl -s --noproxy '*' -o /dev/null -m 3 http://127.0.0.1:8787/; then
  echo "Порт 8787 уже занят (висит старый воркер?). Остановите его и запустите снова — иначе снимок может быть со старой сборки."
  exit 1
fi

echo "1/4 Сборка…"
cd "$ROOT"
npm run build >/dev/null

echo "2/4 Снимок страницы с локального воркера…"
npm run start >"$WORK/worker.log" 2>&1 &
WORKER_PID=$!
for _ in $(seq 1 60); do
  curl -s --noproxy '*' -o /dev/null http://127.0.0.1:8787/ && break
  sleep 1
done
mkdir -p "$WORK/release"
curl -sf --noproxy '*' -o "$WORK/release/index.html" http://127.0.0.1:8787/
stop_worker
for item in _next images favicon.svg apple-touch-icon.png robots.txt; do
  cp -r "dist/client/$item" "$WORK/release/"
done
grep -q 'assistant-fab' "$WORK/release/index.html" || { echo "Снимок без контента — стоп"; exit 1; }
# Снимок должен ссылаться только на файлы этой сборки — иначе он со старого воркера.
# (обратный слеш исключаем: внутри встроенных скриптов пути экранированы как \"…\")
missing="$(grep -oE '/_next/[^"?#\\]+' "$WORK/release/index.html" | sort -u | while read -r p; do [[ -e "$WORK/release$p" ]] || echo "$p"; done)"
if [[ -n "$missing" ]]; then
  echo "Снимок ссылается на файлы, которых нет в новой сборке — стоп:"; echo "$missing" | head -5; exit 1
fi
tar -czf "$WORK/release.tgz" -C "$WORK/release" .

echo "3/4 Загрузка…"
scp "${SSH_OPTS[@]}" "$WORK/release.tgz" "$HOST:/tmp/eva-dent-release.tgz"

echo "4/4 Включение релиза…"
remote "set -euo pipefail
  TS=\$(date +%Y%m%d-%H%M%S); REL=$BASE/releases/\$TS
  mkdir -p \$REL && tar -xzf /tmp/eva-dent-release.tgz -C \$REL && rm -f /tmp/eva-dent-release.tgz
  chown -R root:root \$REL; find \$REL -type d -exec chmod 755 {} +; find \$REL -type f -exec chmod 644 {} +
  nginx -t -q
  ln -sfn releases/\$TS $BASE/current.tmp && mv -Tf $BASE/current.tmp $BASE/current
  cd $BASE/releases && ls -1 | sort | head -n -$KEEP | xargs -r rm -rf
  echo \"Готово: current -> \$(readlink $BASE/current)\""
