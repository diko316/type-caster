FROM diko316/alnode

COPY . $PROJECT_ROOT

RUN npm install -y -dd

CMD bash

