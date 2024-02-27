up:
	docker-compose up

build:
	mkdir -p ./db
	@./create_env.sh
	docker-compose up --build

down:
	docker-compose down

restart: down up

purge:
	docker rm backend frontend redis postgres -f
	docker rmi backend:1337 frontend:1337 redis postgres -f
	docker volume rm volume_postgres volume_backend
	docker volume prune -f
	docker network prune -f
	docker system prune -f

rm_volumes:
	rm -rf ./db/*