<?php
spl_autoload_register(function ($class) {
    if (strpos($class, 'PHPMailer\\PHPMailer\\') === 0) {
        $relative = substr($class, strlen('PHPMailer\\PHPMailer\\'));
        $path = __DIR__ . '/phpmailer/phpmailer/src/' . $relative . '.php';
        if (file_exists($path)) require $path;
    }
});
