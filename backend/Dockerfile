# Usar imagen oficial de PHP con Apache
FROM php:8.2-apache

# Instalar extensión PDO MySQL
RUN docker-php-ext-install pdo pdo_mysql

# Copiar backend al contenedor
COPY . /var/www/html/

# Habilitar mod_rewrite
RUN a2enmod rewrite

# Configuración de Apache para permitir .htaccess
RUN echo "<Directory /var/www/html/> \
    AllowOverride All \
    </Directory>" >> /etc/apache2/apache2.conf

# Puerto que Render usa por defecto
EXPOSE 10000

# Apache escucha en 10000 en Render
RUN sed -i 's/80/10000/g' /etc/apache2/ports.conf
RUN sed -i 's/:80/:10000/g' /etc/apache2/sites-available/000-default.conf

# Comando de inicio
CMD ["apache2-foreground"]
