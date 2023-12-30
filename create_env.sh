#!/bin/bash

if [ ! -f srcs/.env ]; then 
    echo 'srcs/.env file not found.'
    read -p "HOSTNAME (localhost?): " HOSTNAME
    read -p "BACKEND PORT (3000?): " BPORT
    read -p "FRONTEND PORT (1949?): " FPORT
    read -p "POSTGRES DB NAME: " DB
    read -p "POSTGRES USER: " DBUSER
    read -p "POSTGRES PASSWORD: " DBPASSWORD
    read -p "INTRA CLIENT ID: " Intra_Client_ID
    read -p "INTRA SECRET: " Intra_Secret
    read -p "GOOGLE CLIENT ID: " GOOGLE_CLIENT_ID
    read -p "GOOGLE CLIENT SECRET: " GOOGLE_CLIENT_SECRET

    # FRONT ENV
    echo "Localhost=\"http://$HOSTNAME:$FPORT\"" >> srcs/frontend/.env
    echo "NEXT_PUBLIC_HOSTNAME=\"$HOSTNAME\"" >> srcs/frontend/.env
    echo "NEXT_PUBLIC_LOCALHOST=\"http://$HOSTNAME:$BPORT\"" >> srcs/frontend/.env

    # BACKEND ENV
    echo "DATABASE_URL=\"postgres://$DBUSER:$DBPASSWORD@postgres:5432/$DB\"" >> srcs/backend/.env
    echo "PORT=\"$BPORT\"" >> srcs/backend/.env
    echo "Redirection_URL=\"http://$HOSTNAME:$FPORT\"" >> srcs/backend/.env
    echo "Server_URL=\"http://$HOSTNAME:$BPORT\"" >> srcs/backend/.env
    echo "Intra_Redirection_URL=\"http://$HOSTNAME:$BPORT/auth/42/callback\"" >> srcs/backend/.env
    echo "Intra_Client_ID=\"$Intra_Client_ID\"" >> srcs/backend/.env
    echo "Intra_Secret=\"$Intra_Secret\"" >> srcs/backend/.env
    echo "GOOGLE_CLIENT_ID=\"$GOOGLE_CLIENT_ID\"" >> srcs/backend/.env
    echo "GOOGLE_CLIENT_SECRET=\"$GOOGLE_CLIENT_SECRET\"" >> srcs/backend/.env
    echo "GOOGLE_CALLBACK_URL=\"http://$HOSTNAME:$BPORT/auth/google/callback\"" >> srcs/backend/.env

    # DOCKER ENV
    echo "POSTGRES_DB=$DB" >> srcs/.env
    echo "POSTGRES_USER=$DBUSER" >> srcs/.env
    echo "POSTGRES_PASSWORD=$DBPASSWORD" >> srcs/.env
    echo 'env files created.'
    echo 'Please double check it.'
else
    echo 'env file exists.'
fi
