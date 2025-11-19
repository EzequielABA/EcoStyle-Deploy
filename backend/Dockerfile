# Usar imagen oficial de PHP con Apache
FROM php:8.2-apache

# Instalar extensión PDO MySQL
RUN docker-php-ext-install pdo pdo_mysql

# Copiar backend al contenedor
COPY . /var/www/html/

# Habilitar mod_rewrite
RUN a2enmod rewrite

# Añadir configuración segura para permitir .htaccess
RUN printf "\n<Directory /var/www/html/>\n    AllowOverride All\n    Require all granted\n</Directory>\n" \
    >> /etc/apache2/apache2.conf

# Puerto que Render usa por defecto
EXPOSE 10000

# Cambiar el puerto de Apache a 10000
RUN sed -i 's/80/10000/g' /etc/apache2/ports.conf
RUN sed -i 's/:80/:10000/g' /etc/apache2/sites-available/000-default.conf

CMD ["apache2-foreground"]
