# Docker & docker Compose 學習紀錄
### Docker
#### Install Docker Desktop
* [Install Docker Desktop on Windows](https://docs.docker.com/desktop/install/windows-install/)

![](https://i.imgur.com/KP31U2O.png)


#### Build Docker Image
##### Step 01. 進到自己的專案
![](https://i.imgur.com/2fsyPIp.png)

##### Step 02. 於根目錄新增一個 ```Dockerfile``` 檔案
```
FROM node:16.14.0
WORKDIR /app
ADD . /app
RUN npm install
EXPOSE 8000
CMD node app.js
```

📑 撰寫 Dockerfile 目的在於透過撰寫命令行告訴 Docker 如何打包你的程式~

```FROM node:16.14.0```

- 這行會載入 Node.js 需要的執行環境，不同的程式需要的環境可能都不同，詳細的其他版本可以在 [Docker Hub](https://hub.docker.com/_/node) 上看到。

```WORKDIR /app```

- 在這個 Docker 的環境之中建立一個工作目錄 ```/app```。

```ADD . /app```

- 把跟 ```Dockerfile``` 同個資料夾的程式加到剛建立的工作目錄 ```/app``` 中。

```RUN npm install```

- 運行```npm install```，讓 npm 透過讀取 ```package.json``` 下載相依的 package。

```EXPOSE 3000```

- 指定 container 對外開放的 port。

```CMD node app.js```

- 我們透過 node app.js 來執行我們的 Server

寫完 ```Dockerfile``` 後，如果本來有需要在本機端執行 ```npm install``` 產生 ```node_modules``` ，要在根目錄加一個 ```.dockerignore``` 檔案忽略 node_modules。

##### Step 03. 準備好所有預備檔案後，在 terminal 下 ```docker build -t="inquire-learning-system" .``` 指令
* 此動作在建立 Docker Image，並為這個 Image 加上 tag inquire-learning-system。
⚠ 注意：tag 不容許大寫英文字

我們可以透過 ```docker images``` 指令，列出我們全部的 Docker Image，如下圖：

![](https://i.imgur.com/B67wZXN.png)

現在我們就打包好了我們的第一個 Docker Image 囉！

#### 實際執行
有 Docker Image 後，下一步可以透過上面的 ```docker images``` 指令，找到我們建立的 Imag ID，在這邊是 ```575697eb10ea```。

所以我們輸入指令 ```docker run -p 8000:8000 -it 575697eb10ea```
* 透過 ```docker run```，我們把 Image 執行成 Container，這時用瀏覽器打開 localhost:8000，就可以看到你的程式跑起來了！！


### Docker Compose
Docker Compose 是用來把 container 串起來，它使用 YAML 描述檔定義 container 的關係。
#### 於根目錄新增 ```docker-compose.yml```
* ```docker-compose``` 描述 services 運作狀況，以我的專案為例，共有 ```app```、```mysql``` 和 ```phpmyadmin``` 三個 service。

```
version: '2.0'
services:
  # 定義一個叫 app 的 service
  app:
    image: node:16.14.0
    command: sh -c "npm install && npm start"
    ports:
      - 8000:8000
    working_dir: /app
    volumes: # 把當前資料夾 mount 掛載進去 container，這樣你可以直接在本地端專案資料夾改動檔案，container 裡面的檔案也會更動也不用重新 build image！
      - ./:/app
    environment:
      MARIADB_HOST: 140.115.126.19
      MARIADB_USER: wulab
      MARIADB_PASSWORD: ytwu35415
      MARIADB_DB: inquiry
      
  # 定義一個叫 mysql 的 service
  mysql:
    image: mariadb #mysql
    environment:
      MARIADB_ROOT_PASSWORD: root
    restart: always
    volumes:
      - ./database:/var/lib/mysql
    ports:
      - "3306:3306"
      
  # 定義一個叫 phpmyadmin 的 service
  phpmyadmin:
    image: phpmyadmin
    environment:
      MA_HOST: mysql
      UPLOAD_LIMIT: 1024M
      MEMORY_LIMIT: 1024M
      MAX_EXECUTION_TIME: 300
      PMA_ARBITRARY: 1
    ports:
      - "8081:80"
    restart: always
```

```version```
* 使用的設定檔版本，通常新版本會有新的功能，並支援新的設定參數。

```services```
* 定義 services 的區塊，一個 service 設定可以用來啟動多個 container。

```image```
* image 是指 IMAGE 參數。

```command```
* 定義了啟動 container 會執行的指令。

```ports```
* 為開出去的 port 設定。

```working_dir```
* 用來指定預設執行的路徑。

```volumes```
* 是 Docker 的元件，提供 container 保存資料或共享資料的機制。

```services```
* 定義 services 的區塊，一個 service 設定可以用來啟動多個 container。

#### 用 ```docker-compose up``` 執行你的程式
* 如果使用 ```docker-compose up -d``` 執行，可以讓你的程式在背景執行（※ d 代表 detached）。

[完整範例程式](https://github.com/YXR9/InquiryLearningSystem.git)