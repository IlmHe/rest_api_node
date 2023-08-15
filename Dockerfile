FROM postgres:latest
# Since this is a demo project, environment variables are hardcoded here for simplicity.
# In a real-world application, consider using environment files or other secure methods for managing secrets.
ENV POSTGRES_USER myuser
ENV POSTGRES_PASSWORD mysecretpassword
ENV POSTGRES_DB mydb
EXPOSE 5432
