SHELL = /bin/sh
compose = docker-compose

.PHONY: loc
loc: build-loc
	$(compose) up --build

.PHONY: build-loc
build-loc:
	$(compose) build

.PHONY: exec
exec:
	$(compose) exec web bash

.PHONY: exec-db
exec-db:
	$(compose) exec db bash

.PHONY: down
down:
	$(compose) down

.PHONY: db
db:
	$(compose) exec db \
	psql -h 127.0.0.1 -p 5432 -U postgres -W postgres

username = root
email = root@example.com

.PHONY: createsuperuser
createsuperuser:
	$(compose) exec web \
	python manage.py createsuperuser --username ${username} --email ${email}
