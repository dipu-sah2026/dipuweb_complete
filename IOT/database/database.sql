-- Health Monitoring & Emergency Alert System Database Schema

CREATE DATABASE IF NOT EXISTS `health_monitor_db` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `health_monitor_db`;

-- Table: users
CREATE TABLE IF NOT EXISTS `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `mobile` VARCHAR(20) NOT NULL UNIQUE,
  `email` VARCHAR(100) NOT NULL UNIQUE,
  `otp` VARCHAR(6) DEFAULT NULL,
  `otp_expiry` DATETIME DEFAULT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table: api_devices
CREATE TABLE IF NOT EXISTS `api_devices` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `api_key` VARCHAR(64) NOT NULL UNIQUE,
  `device_name` VARCHAR(100) DEFAULT 'IoT Health Sensor',
  `status` ENUM('active', 'inactive') DEFAULT 'active',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table: health_data
CREATE TABLE IF NOT EXISTS `health_data` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `temperature` DECIMAL(4,1) NOT NULL,
  `blood_pressure` VARCHAR(10) NOT NULL,
  `systolic` INT DEFAULT 120,
  `diastolic` INT DEFAULT 80,
  `emergency` TINYINT(1) DEFAULT 0,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table: alerts
CREATE TABLE IF NOT EXISTS `alerts` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `alert_message` TEXT NOT NULL,
  `alert_type` ENUM('EMERGENCY', 'HIGH_TEMP', 'HIGH_BP', 'NORMAL') DEFAULT 'EMERGENCY',
  `status` ENUM('UNREAD', 'READ', 'RESOLVED') DEFAULT 'UNREAD',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Insert Sample Demo User & Device for instant testing
INSERT INTO `users` (`id`, `name`, `mobile`, `email`, `created_at`) 
VALUES (1, 'Rahul Sharma', '9876543210', 'rahul@example.com', NOW())
ON DUPLICATE KEY UPDATE `id`=`id`;

INSERT INTO `api_devices` (`id`, `user_id`, `api_key`, `device_name`, `status`, `created_at`)
VALUES (1, 1, 'HEALTH-API-998877665544332211', 'PulseTemp Sensor-01', 'active', NOW())
ON DUPLICATE KEY UPDATE `id`=`id`;

INSERT INTO `health_data` (`user_id`, `temperature`, `blood_pressure`, `systolic`, `diastolic`, `emergency`, `created_at`)
VALUES (1, 98.6, '120/80', 120, 80, 0, NOW());
