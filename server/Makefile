SHELL = /bin/sh

.PHONY: loc
loc: build-loc
	docker-compose up --build

.PHONY: build-loc
build-loc:
	docker-compose build

.PHONY: exec
exec:
	docker-compose exec web bash

.PHONY: exec-db
exec-db:
	docker-compose exec db bash

.PHONY: down
down:
	docker-compose down

.PHONY: db
db:
	docker-compose exec db \
	psql -h 127.0.0.1 -p 5432 -U postgres -W postgres

.PHONY: createsuperuser
createsuperuser:
	docker-compose exec web \
	python manage.py createsuperuser --noinput
