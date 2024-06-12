FROM debian:stable-slim
RUN apt-get update && apt-get install -y ca-certificates
COPY webnovelapi /bin/webnovelapi
ENV PORT="8080"
CMD ["/bin/webnovelapi"]