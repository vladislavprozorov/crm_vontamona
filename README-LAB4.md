# Лабораторная работа №4 — безопасность DevOps, CI (SonarQube), CD (Argo CD), Telegram уведомления

Этот репозиторий содержит простую CRM (frontend на Next.js + backend на NestJS + PostgreSQL) и настроенный пайплайн CI/CD, который:

- запускает tests + coverage для **backend** и **frontend**;
- загружает отчёты покрытия в SonarQube/SonarCloud;
- выполняет **Sonar Scan** и **Quality Gate** отдельным job’ом в CI;
- **падает**, если Quality Gate не пройден (в том числе если coverage ниже целевого порога);
- собирает и пушит Docker images;
- автоматизирует доставку/деплой в Kubernetes через **Argo CD**;
- отправляет статусы jobs в Telegram.

> Важно: порог **coverage ≥ 80%** задаётся в Sonar как часть **Quality Gate** (на стороне Sonar).

---

## 1) Что именно считается “выполнено” по задаче

### CI + Sonar (SAST)

- В `.github/workflows/ci.yml` есть job `sonarqube`:
  - выполняет scan (`SonarSource/sonarqube-scan-action@v2`)
  - ждёт quality gate (`SonarSource/sonarqube-quality-gate-action@v1`)
  - при fail quality gate → job падает → pipeline падает.

### Coverage ≥ 80%

- Backend: `server/pnpm test:cov:ci` формирует `server/coverage/lcov.info`.
- Frontend: `client/npm run test:ci` формирует `client/coverage/lcov.info`.
- Sonar берёт оба отчёта из `sonar-project.properties`:
  - `sonar.typescript.lcov.reportPaths=server/coverage/lcov.info,client/coverage/lcov.info`

### CD (Argo CD)

- `infrastructure/argocd/application.yaml` — манифест Argo CD Application, который применяет манифесты из `infrastructure/k3s`.

### Telegram уведомления

- В каждом job’е workflow есть шаг `appleboy/telegram-action@v1.0.0` с отправкой статуса job.

---

## 2) Секреты для GitHub Actions

В GitHub repo → **Settings → Secrets and variables → Actions** добавь:

### SonarQube / SonarCloud

- `SONAR_HOST_URL` — URL SonarQube (например, `https://sonar.my-domain.com`) или SonarCloud (`https://sonarcloud.io`).
- `SONAR_TOKEN` — токен пользователя/проекта в Sonar.

> Если используешь **self-hosted SonarQube**, то `SONAR_HOST_URL` **должен быть доступен из GitHub Actions**.
> `http://localhost:9000` работать **не будет** для CI, потому что GitHub runner не видит твой ноутбук.

### Docker Registry (Docker Hub)

- `REGISTRY_USER`
- `REGISTRY_PASSWORD`

### Telegram

- `TELEGRAM_BOT_TOKEN` — токен бота (через @BotFather)
- `TELEGRAM_CHAT_ID` — chat id (личный чат или группа)

---

## 3) Настройка Quality Gate на coverage ≥ 80%

Порог coverage настраивается **в Sonar**, не в репозитории.

1. Открой Sonar → **Quality Gates**
2. Создай/выбери gate
3. Добавь условие:
   - _Coverage_ **is less than** `80` → **Error**
4. Привяжи gate к проекту `crm_vontamona`.

После этого GitHub Actions job `Sonar Quality Gate` будет падать, если:

- coverage ниже 80%
- есть blocker/critical issues
- другие ошибки, которые входят в gate.

---

## 4) Argo CD: деплой в Kubernetes

Файл: `infrastructure/argocd/application.yaml`

`targetRevision` определяет, **какую ветку** Argo CD деплоит. Для сдачи ЛР4 удобно указывать ветку с лабораторной (например, `lab4-ci-cd-security`).

### Как Argo CD понимает, что нужно обновиться

Argo CD **не отслеживает** Docker Registry сам по себе. Он отслеживает **Git** (манифесты).

Поэтому правильная схема для CD в этой лабораторной:

1. CI собирает и пушит образы с **иммутабельным тегом** (например, `${{ github.sha }}`)
2. CI **обновляет Kubernetes-манифесты** в `infrastructure/k3s` (подставляет новый tag)
3. CI коммитит эти изменения
4. Argo CD видит commit в Git и делает Sync

В этом репозитории для этого добавлен CI job `update-k8s-manifests`, который после push образов обновляет `infrastructure/k3s/backend.yaml` и `infrastructure/k3s/frontend.yaml` на тег `${{ github.sha }}` и пушит commit.

### Порядок действий (общая схема)

1. Установи Argo CD в кластер.
2. Применяй `application.yaml` в namespace `argocd`.
3. Argo CD подхватит манифесты из `infrastructure/k3s` и начнёт sync.

### Важно про образы

В `infrastructure/k3s/backend.yaml` и `frontend.yaml` используются образы вида:

- `jenya00/crm_vontamona-backend:latest`
- `jenya00/crm_vontamona-frontend:latest`

Они обновляются job’ами `build-and-push-backend` / `build-and-push-frontend`.

---

## 5) Локальный запуск (Docker Compose)

В корне репозитория есть `docker-compose.yml`.

Поднимаются сервисы:

- postgres
- backend (порт 3001)
- frontend (порт 3000)

### Self-hosted SonarQube (локально)

`docker-compose.yml` также содержит сервисы:

- `sonarqube` (порт **9000**)
- `sonarqube-db` (PostgreSQL для SonarQube)

Запуск (локально):

1. `docker compose up -d sonarqube-db sonarqube`
2. Открыть UI: `http://localhost:9000`
3. Логин по умолчанию: `admin` / `admin` (при первом входе Sonar попросит сменить пароль)
4. Создать проект с key `crm_vontamona`
5. Создать токен (My Account → Security → Generate Tokens)

> Для CI (GitHub Actions) локальный SonarQube через `localhost` не подойдёт — нужен публичный URL (VPS/туннель), который ты укажешь в `SONAR_HOST_URL`.

---

## 6) Где что лежит

- CI: `.github/workflows/ci.yml`
- Sonar config: `sonar-project.properties`
- Argo CD Application: `infrastructure/argocd/application.yaml`
- Kubernetes manifests: `infrastructure/k3s/*.yaml`

---

## 7) Частые проблемы

- **CI “Quality Gate” падает**: проверь, что отчёты coverage реально загружены и путь в `sonar.typescript.lcov.reportPaths` верный.
- **Coverage в Sonar ниже ожидаемого**: убедись, что tests запускаются и формируют lcov, и что Sonar видит `sonar.tests`/`sonar.test.inclusions`.
- **Telegram не присылает**: проверь `TELEGRAM_BOT_TOKEN`/`TELEGRAM_CHAT_ID`.
