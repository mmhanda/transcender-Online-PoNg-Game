FROM node:20

WORKDIR /backend

COPY . /backend

RUN npm install -g @nestjs/cli && npm install

RUN npm run build

RUN chmod 777 /backend/script.sh

CMD [ "/backend/script.sh" ]
