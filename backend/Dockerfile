# Imagen base: PHP 8.2 + Apache
FROM php:8.2-apache

# Instalar dependencias necesarias
RUN apt-get update && apt-get install -y \
    libpng-dev \
    libzip-dev \
    zip \
    unzip \
    && docker-php-ext-install pdo pdo_mysql

# Habilitar mod_rewrite
RUN a2enmod rewrite

# Copiar backend
COPY . /var/www/html/

# Configuración para permitir .htaccess
RUN printf "\n<Directory /var/www/html/>\n    AllowOverride All\n    Require all granted\n</Directory>\n" >> /etc/apache2/apache2.conf

# Render usa puerto 10000
EXPOSE 10000
RUN sed -i 's/80/10000/g' /etc/apache2/ports.conf
RUN sed -i 's/:80/:10000/g' /etc/apache2/sites-available/000-default.conf

CMD ["apache2-foreground"]
