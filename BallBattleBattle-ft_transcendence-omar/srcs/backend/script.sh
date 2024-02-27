#!/bin/bash


if [ ! -f .migrations_done ]; then
  sleep 25
  npx prisma db push && npx prisma db seed
  touch .migrations_done
fi

npm run start:prod
