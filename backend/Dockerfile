FROM php:8.2-apache

RUN apt-get update && apt-get install -y \
    default-mysql-client \
    libpng-dev \
    libzip-dev \
    zip \
    unzip \
    && docker-php-ext-install pdo pdo_mysql

RUN a2enmod rewrite

COPY . /var/www/html/

RUN printf "\n<Directory /var/www/html/>\n    AllowOverride All\n    Require all granted\n</Directory>\n" \
    >> /etc/apache2/apache2.conf

EXPOSE 10000
RUN sed -i 's/80/10000/g' /etc/apache2/ports.conf
RUN sed -i 's/:80/:10000/g' /etc/apache2/sites-available/000-default.conf

CMD ["apache2-foreground"]
