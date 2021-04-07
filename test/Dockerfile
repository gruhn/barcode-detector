FROM webplatformtests/wpt:0.46

RUN ./start.sh
WORKDIR /home/test/web-platform-tests
RUN ./wpt install firefox webdriver

CMD ["./wpt", "run", "firefox", "shape-detection"]