-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 29, 2025 at 05:25 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `lotto_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `bets`
--

CREATE TABLE `bets` (
  `bet_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `draw_id` int(11) NOT NULL,
  `ticket_id` int(11) NOT NULL,
  `bet_number` varchar(17) NOT NULL,
  `status` enum('won','lost','pending') NOT NULL DEFAULT 'pending',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `bets`
--

INSERT INTO `bets` (`bet_id`, `user_id`, `draw_id`, `ticket_id`, `bet_number`, `status`, `created_at`) VALUES
(1, 1, 4, 1, '11-12-13-14-15-16', 'pending', '2025-03-20 02:47:20'),
(2, 1, 5, 1, '11-12-13-14-15-16', 'pending', '2025-03-20 09:55:56'),
(3, 1, 5, 2, '12-14-16-18-20-22', 'pending', '2025-03-20 09:59:07'),
(4, 1, 35, 2, '11-12-13-14-15-16', 'pending', '2025-03-21 15:12:04'),
(5, 1, 35, 3, '01-02-03-04-05-06', 'pending', '2025-03-21 15:37:05'),
(6, 1, 38, 4, '01-02-03-04-05-06', 'pending', '2025-03-21 15:44:54'),
(7, 1, 41, 5, '01-02-03-04-05-06', 'pending', '2025-03-21 15:52:15'),
(8, 1, 44, 6, '01-02-03-04-05-06', 'pending', '2025-03-21 15:54:32'),
(9, 1, 46, 7, '01-02-03-04-05-06', 'pending', '2025-03-21 15:58:26'),
(10, 1, 47, 7, '01-02-03-04-05-06', 'pending', '2025-03-21 15:59:48'),
(11, 1, 48, 7, '01-02-03-04-05-06', 'pending', '2025-03-22 01:47:32'),
(12, 1, 50, 7, '01-02-03-04-05-06', 'pending', '2025-03-22 01:55:01'),
(13, 1, 51, 7, '01-02-03-04-05-06', 'pending', '2025-03-22 02:15:06'),
(14, 1, 55, 8, '01-02-03-04-05-06', 'pending', '2025-03-22 02:24:44'),
(15, 1, 56, 8, '01-02-03-04-05-06', 'pending', '2025-03-22 02:39:01'),
(16, 1, 57, 8, '01-02-03-04-05-06', 'pending', '2025-03-22 02:46:50'),
(17, 1, 58, 8, '01-02-03-04-05-06', 'pending', '2025-03-22 02:51:45'),
(18, 1, 59, 8, '01-02-03-04-05-06', 'pending', '2025-03-22 02:53:33'),
(19, 1, 60, 9, '01-02-03-04-05-06', 'pending', '2025-03-22 02:54:42'),
(20, 1, 61, 9, '01-02-03-04-05-06', 'pending', '2025-03-22 02:58:05'),
(21, 1, 62, 9, '01-02-03-04-05-06', 'pending', '2025-03-22 02:58:50'),
(22, 1, 63, 9, '01-02-03-04-05-06', 'pending', '2025-03-22 03:02:08'),
(23, 1, 64, 9, '01-02-03-04-05-06', 'pending', '2025-03-22 03:02:29'),
(24, 1, 65, 10, '01-02-03-04-05-06', 'pending', '2025-03-22 03:05:32'),
(25, 1, 66, 10, '01-02-03-04-05-06', 'pending', '2025-03-22 03:07:53'),
(26, 1, 67, 10, '01-02-03-04-05-06', 'pending', '2025-03-22 03:09:16'),
(27, 1, 68, 10, '01-02-03-04-05-06', 'pending', '2025-03-22 03:10:16'),
(28, 1, 69, 10, '01-02-03-04-05-06', 'pending', '2025-03-22 03:10:41'),
(29, 1, 70, 11, '01-02-03-04-05-06', 'pending', '2025-03-22 03:11:24'),
(30, 1, 71, 11, '01-02-03-04-05-06', 'pending', '2025-03-22 03:12:17'),
(31, 1, 72, 11, '01-02-03-04-05-06', 'pending', '2025-03-22 06:33:27'),
(32, 1, 76, 11, '01-02-03-04-05-06', 'pending', '2025-03-22 08:26:43'),
(33, 1, 76, 11, '12-31-23-12-31-23', 'pending', '2025-03-22 08:27:11'),
(34, 1, 77, 12, '01-02-03-04-05-06', 'pending', '2025-03-22 08:31:55'),
(35, 1, 78, 13, '01-02-03-04-05-06', 'pending', '2025-03-22 08:33:31'),
(36, 1, 79, 13, '01-02-03-04-05-06', 'pending', '2025-03-22 08:34:58'),
(37, 1, 80, 14, '01-02-03-04-05-06', 'pending', '2025-03-26 14:45:50'),
(38, 1, 80, 14, '01-02-03-04-05-07', 'pending', '2025-03-26 14:48:49'),
(39, 1, 80, 15, '01-02-03-04-05-08', 'pending', '2025-03-26 14:54:23'),
(40, 1, 80, 15, '01-02-03-04-05-09', 'pending', '2025-03-26 14:56:07'),
(41, 1, 80, 16, '02-01-03-04-05-06', 'pending', '2025-03-26 14:56:59'),
(42, 1, 80, 16, '02-01-03-05-06-04', 'pending', '2025-03-26 15:00:34'),
(43, 1, 80, 16, '04-01-02-03-05-06', 'pending', '2025-03-26 15:01:11'),
(44, 1, 80, 16, '04-02-01-03-05-07', 'pending', '2025-03-26 15:02:37'),
(45, 1, 80, 16, '01-03-02-04-05-06', 'pending', '2025-03-26 15:06:44'),
(46, 1, 80, 17, '07-06-05-04-03-02', 'pending', '2025-03-26 15:07:42'),
(47, 1, 81, 17, '06-05-04-03-02-01', 'pending', '2025-03-26 15:09:38'),
(48, 1, 81, 18, '01-02-03-04-05-06', 'pending', '2025-03-26 15:12:08'),
(49, 1, 81, 19, '02-10-05-03-01-06', 'pending', '2025-03-26 15:21:15'),
(50, 1, 81, 20, '11-12-13-14-15-16', 'pending', '2025-03-27 17:53:53'),
(51, 1, 81, 21, '11-12-13-14-15-17', 'pending', '2025-03-27 17:55:57'),
(52, 3, 83, 59, '01-02-03-04-05-06', 'pending', '2025-03-28 15:46:50'),
(53, 3, 84, 60, '01-02-03-04-05-06', 'pending', '2025-03-28 15:50:48'),
(54, 3, 85, 61, '01-02-03-04-05-06', 'pending', '2025-03-28 15:51:37'),
(55, 3, 86, 62, '01-02-03-04-05-06', 'won', '2025-03-28 15:59:07'),
(56, 3, 87, 63, '01-02-03-04-05-07', 'pending', '2025-03-28 15:59:55'),
(57, 3, 88, 64, '01-02-03-04-05-07', 'pending', '2025-03-28 16:02:57'),
(58, 3, 89, 64, '01-02-03-04-05-07', 'pending', '2025-03-28 16:11:43'),
(59, 3, 90, 64, '01-02-03-04-05-07', 'pending', '2025-03-28 16:14:27'),
(60, 3, 93, 64, '01-02-03-04-05-07', 'lost', '2025-03-28 16:19:45'),
(61, 3, 94, 64, '01-02-03-04-05-07', 'lost', '2025-03-28 16:21:21'),
(62, 3, 95, 65, '01-02-03-04-05-06', 'won', '2025-03-28 16:22:53'),
(63, 3, 96, 65, '01-02-03-04-05-07', 'lost', '2025-03-28 16:26:24'),
(64, 3, 97, 65, '01-02-03-04-05-07', 'lost', '2025-03-28 17:27:04'),
(65, 3, 98, 65, '01-02-03-04-05-06', 'won', '2025-03-28 17:27:18'),
(66, 3, 99, 65, '01-02-03-04-05-07', 'lost', '2025-03-29 03:06:40'),
(67, 1, 99, 22, '01-02-03-04-05-07', 'lost', '2025-03-29 03:52:46'),
(68, 1, 99, 23, '01-02-03-04-05-06', 'won', '2025-03-29 03:53:55');

-- --------------------------------------------------------

--
-- Table structure for table `draws`
--

CREATE TABLE `draws` (
  `draw_id` int(11) NOT NULL,
  `numbers` varchar(17) DEFAULT NULL,
  `status` enum('open','close','completed') NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `draws`
--

INSERT INTO `draws` (`draw_id`, `numbers`, `status`, `created_at`) VALUES
(1, '33-36-30-14-24-5', 'completed', '2025-03-20 02:45:05'),
(2, '24-33-4-43-17-2', 'completed', '2025-03-20 02:45:17'),
(3, '3-29-9-11-30-16', 'completed', '2025-03-20 02:46:29'),
(4, '25-47-12-1-27-31', 'completed', '2025-03-20 09:53:49'),
(5, '27-24-42-22-36-13', 'completed', '2025-03-21 13:43:41'),
(6, '40-11-19-39-23-38', 'completed', '2025-03-21 13:58:54'),
(7, '17-47-35-5-41-40', 'completed', '2025-03-21 14:00:00'),
(8, '19-16-15-31-28-45', 'completed', '2025-03-21 14:01:06'),
(9, '24-15-36-42-35-40', 'completed', '2025-03-21 14:02:12'),
(10, '20-10-19-36-6-13', 'completed', '2025-03-21 14:03:17'),
(11, '38-47-23-43-27-48', 'completed', '2025-03-21 14:47:52'),
(12, '39-17-10-20-32-44', 'completed', '2025-03-21 14:47:56'),
(13, '41-22-3-33-49-7', 'completed', '2025-03-21 14:48:59'),
(14, '34-4-2-9-48-41', 'completed', '2025-03-21 14:49:04'),
(15, '15-23-40-17-43-29', 'completed', '2025-03-21 14:50:07'),
(16, '26-33-45-2-29-39', 'completed', '2025-03-21 14:50:11'),
(17, '5-10-49-4-26-32', 'completed', '2025-03-21 14:51:14'),
(18, '26-34-4-39-12-47', 'completed', '2025-03-21 14:51:19'),
(19, '42-18-8-46-14-15', 'completed', '2025-03-21 14:52:22'),
(20, '17-7-40-24-14-31', 'completed', '2025-03-21 14:52:26'),
(21, '42-47-27-34-5-13', 'completed', '2025-03-21 14:53:28'),
(22, '3-19-2-46-15-33', 'completed', '2025-03-21 14:53:33'),
(23, '16-29-25-24-48-7', 'completed', '2025-03-21 14:54:35'),
(24, '41-25-37-9-35-40', 'completed', '2025-03-21 14:54:40'),
(25, '40-44-47-1-13-36', 'completed', '2025-03-21 14:55:42'),
(26, '20-28-22-12-35-2', 'completed', '2025-03-21 14:55:47'),
(27, '41-48-25-21-29-35', 'completed', '2025-03-21 14:56:49'),
(28, '43-8-9-38-3-2', 'completed', '2025-03-21 14:56:54'),
(29, '41-49-6-21-1-36', 'completed', '2025-03-21 14:57:57'),
(30, '34-46-36-44-31-38', 'completed', '2025-03-21 14:58:02'),
(31, '33-2-32-41-30-29', 'completed', '2025-03-21 14:59:05'),
(32, '7-28-24-47-12-4', 'completed', '2025-03-21 14:59:09'),
(33, '35-10-46-39-14-36', 'completed', '2025-03-21 15:00:12'),
(34, '23-24-11-27-28-20', 'completed', '2025-03-21 15:00:17'),
(35, '1-2-3-4-5-6', 'completed', '2025-03-21 15:37:48'),
(36, '1-2-3-4-5-6', 'completed', '2025-03-21 15:37:49'),
(37, '1-2-3-4-5-6', 'completed', '2025-03-21 15:37:52'),
(38, '01-02-03-04-05-06', 'completed', '2025-03-21 15:48:08'),
(39, '01-02-03-04-05-06', 'completed', '2025-03-21 15:48:10'),
(40, '01-02-03-04-05-06', 'completed', '2025-03-21 15:48:10'),
(41, '01-02-03-04-05-06', 'completed', '2025-03-21 15:52:25'),
(42, '01-02-03-04-05-06', 'completed', '2025-03-21 15:52:25'),
(43, '01-02-03-04-05-06', 'completed', '2025-03-21 15:52:26'),
(44, '01-02-03-04-05-06', 'completed', '2025-03-21 15:54:43'),
(45, '01-02-03-04-05-06', 'completed', '2025-03-21 15:54:43'),
(46, '01-02-03-04-05-06', 'completed', '2025-03-21 15:58:36'),
(47, '01-02-03-04-05-06', 'completed', '2025-03-21 15:59:55'),
(48, '01-02-03-04-05-06', 'completed', '2025-03-22 01:53:54'),
(49, '01-02-03-04-05-06', 'completed', '2025-03-22 01:54:49'),
(50, '01-02-03-04-05-06', 'completed', '2025-03-22 01:55:07'),
(51, '01-02-03-04-05-06', 'completed', '2025-03-22 02:15:11'),
(52, '01-02-03-04-05-06', 'completed', '2025-03-22 02:18:34'),
(53, '01-02-03-04-05-06', 'completed', '2025-03-22 02:19:07'),
(54, '01-02-03-04-05-06', 'completed', '2025-03-22 02:22:40'),
(55, '01-02-03-04-05-06', 'completed', '2025-03-22 02:24:52'),
(56, '01-02-03-04-05-06', 'completed', '2025-03-22 02:39:10'),
(57, '01-02-03-04-05-06', 'completed', '2025-03-22 02:47:13'),
(58, '01-02-03-04-05-06', 'completed', '2025-03-22 02:51:54'),
(59, '01-02-03-04-05-06', 'completed', '2025-03-22 02:53:36'),
(60, '01-02-03-04-05-06', 'completed', '2025-03-22 02:54:47'),
(61, '01-02-03-04-05-06', 'completed', '2025-03-22 02:58:07'),
(62, '01-02-03-04-05-06', 'completed', '2025-03-22 02:58:54'),
(63, '01-02-03-04-05-06', 'completed', '2025-03-22 03:02:13'),
(64, '01-02-03-04-05-06', 'completed', '2025-03-22 03:02:32'),
(65, '01-02-03-04-05-06', 'completed', '2025-03-22 03:05:38'),
(66, '01-02-03-04-05-06', 'completed', '2025-03-22 03:07:56'),
(67, '01-02-03-04-05-06', 'completed', '2025-03-22 03:09:18'),
(68, '01-02-03-04-05-06', 'completed', '2025-03-22 03:10:19'),
(69, '01-02-03-04-05-06', 'completed', '2025-03-22 03:10:44'),
(70, '01-02-03-04-05-06', 'completed', '2025-03-22 03:11:27'),
(71, '01-02-03-04-05-06', 'completed', '2025-03-22 03:12:19'),
(72, '01-02-03-04-05-06', 'completed', '2025-03-22 06:33:37'),
(73, '01-02-03-04-05-06', 'completed', '2025-03-22 06:33:41'),
(74, '32-46-49-20-08-31', 'completed', '2025-03-22 06:35:28'),
(75, '13-24-42-01-46-40', 'completed', '2025-03-22 06:35:28'),
(76, '01-02-03-04-05-06', 'completed', '2025-03-22 08:27:36'),
(77, '01-02-03-04-05-06', 'completed', '2025-03-22 08:32:06'),
(78, '01-02-03-04-05-06', 'completed', '2025-03-22 08:33:46'),
(79, '01-02-03-04-05-06', 'completed', '2025-03-22 08:35:12'),
(80, '01-02-03-04-05-06', 'completed', '2025-03-26 15:09:16'),
(81, '01-02-03-04-05-06', 'completed', '2025-03-28 15:45:19'),
(82, '01-02-03-04-05-06', 'completed', '2025-03-28 15:46:22'),
(83, '01-02-03-04-05-06', 'completed', '2025-03-28 15:46:57'),
(84, '01-02-03-04-05-06', 'completed', '2025-03-28 15:50:51'),
(85, '01-02-03-04-05-06', 'completed', '2025-03-28 15:51:39'),
(86, '01-02-03-04-05-06', 'completed', '2025-03-28 15:59:13'),
(87, '01-02-03-04-05-06', 'completed', '2025-03-28 16:00:00'),
(88, '01-02-03-04-05-06', 'completed', '2025-03-28 16:03:01'),
(89, '01-02-03-04-05-06', 'completed', '2025-03-28 16:11:49'),
(90, '01-02-03-04-05-06', 'completed', '2025-03-28 16:14:30'),
(91, '01-02-03-04-05-06', 'completed', '2025-03-28 16:15:16'),
(92, '01-02-03-04-05-06', 'completed', '2025-03-28 16:15:24'),
(93, '01-02-03-04-05-06', 'completed', '2025-03-28 16:19:49'),
(94, '01-02-03-04-05-06', 'completed', '2025-03-28 16:21:25'),
(95, '01-02-03-04-05-06', 'completed', '2025-03-28 16:22:57'),
(96, '01-02-03-04-05-06', 'completed', '2025-03-28 16:26:27'),
(97, '01-02-03-04-05-06', 'completed', '2025-03-28 17:27:08'),
(98, '01-02-03-04-05-06', 'completed', '2025-03-28 17:27:21'),
(99, '01-02-03-04-05-06', 'completed', '2025-03-29 03:55:24'),
(100, NULL, 'open', '2025-03-29 03:55:24');

-- --------------------------------------------------------

--
-- Table structure for table `prize`
--

CREATE TABLE `prize` (
  `prize_id` int(11) NOT NULL,
  `money` int(11) NOT NULL,
  `status` enum('claimed','unclaim') NOT NULL DEFAULT 'unclaim'
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `prize`
--

INSERT INTO `prize` (`prize_id`, `money`, `status`) VALUES
(1, 1500, 'claimed'),
(2, 1500, 'claimed'),
(3, 1500, 'claimed'),
(4, 1500, 'claimed'),
(5, 1500, 'claimed'),
(6, 1500, 'claimed'),
(7, 1500, 'claimed'),
(8, 1500, 'claimed'),
(9, 1500, 'claimed'),
(10, 1500, 'claimed'),
(11, 1500, 'claimed'),
(12, 1500, 'claimed'),
(13, 1500, 'claimed'),
(14, 1500, 'claimed'),
(15, 1500, 'unclaim');

-- --------------------------------------------------------

--
-- Table structure for table `tickets`
--

CREATE TABLE `tickets` (
  `ticket_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `ticket_count` int(11) NOT NULL,
  `status` enum('used','unused') NOT NULL DEFAULT 'unused'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tickets`
--

INSERT INTO `tickets` (`ticket_id`, `user_id`, `ticket_count`, `status`) VALUES
(1, 1, 1, 'used'),
(2, 1, 1, 'used'),
(3, 1, 1, 'used'),
(4, 1, 1, 'used'),
(5, 1, 1, 'used'),
(6, 1, 1, 'used'),
(7, 1, 1, 'used'),
(8, 1, 1, 'used'),
(9, 1, 1, 'used'),
(10, 1, 1, 'used'),
(11, 1, 1, 'used'),
(12, 1, 1, 'used'),
(13, 1, 1, 'used'),
(14, 1, 1, 'used'),
(15, 1, 1, 'used'),
(16, 1, 1, 'used'),
(17, 1, 1, 'used'),
(18, 1, 1, 'used'),
(19, 1, 1, 'used'),
(20, 1, 1, 'used'),
(21, 1, 1, 'used'),
(22, 1, 1, 'used'),
(23, 1, 1, 'used'),
(24, 1, 1, 'unused'),
(25, 1, 1, 'unused'),
(26, 1, 1, 'unused'),
(27, 1, 1, 'unused'),
(28, 1, 1, 'unused'),
(29, 1, 1, 'unused'),
(30, 1, 1, 'unused'),
(31, 1, 1, 'unused'),
(32, 1, 1, 'unused'),
(33, 1, 1, 'unused'),
(34, 1, 1, 'unused'),
(35, 1, 1, 'unused'),
(36, 1, 1, 'unused'),
(37, 1, 1, 'unused'),
(38, 1, 1, 'unused'),
(39, 1, 1, 'unused'),
(40, 1, 1, 'unused'),
(41, 1, 1, 'unused'),
(42, 1, 1, 'unused'),
(43, 1, 1, 'unused'),
(44, 1, 1, 'unused'),
(45, 1, 1, 'unused'),
(46, 1, 1, 'unused'),
(47, 1, 1, 'unused'),
(48, 1, 1, 'unused'),
(49, 1, 1, 'unused'),
(50, 1, 1, 'unused'),
(51, 1, 1, 'unused'),
(52, 1, 1, 'unused'),
(53, 1, 1, 'unused'),
(54, 1, 1, 'unused'),
(55, 1, 1, 'unused'),
(56, 1, 1, 'unused'),
(57, 1, 1, 'unused'),
(58, 1, 1, 'unused'),
(59, 3, 1, 'used'),
(60, 3, 1, 'used'),
(61, 3, 1, 'used'),
(62, 3, 1, 'used'),
(63, 3, 1, 'used'),
(64, 3, 1, 'used'),
(65, 3, 1, 'used'),
(66, 1, 1, 'unused'),
(67, 1, 1, 'unused'),
(68, 1, 1, 'unused'),
(69, 1, 1, 'unused'),
(70, 1, 1, 'unused'),
(71, 1, 1, 'unused'),
(72, 1, 1, 'unused'),
(73, 1, 1, 'unused'),
(74, 1, 1, 'unused'),
(75, 1, 1, 'unused'),
(76, 1, 1, 'unused'),
(77, 1, 1, 'unused'),
(78, 1, 1, 'unused'),
(79, 3, 1, 'unused'),
(80, 3, 1, 'unused'),
(81, 3, 1, 'unused'),
(82, 3, 1, 'unused'),
(83, 3, 1, 'unused'),
(84, 1, 1, 'unused'),
(85, 1, 1, 'unused');

-- --------------------------------------------------------

--
-- Table structure for table `transactions`
--

CREATE TABLE `transactions` (
  `transaction_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `TYPE` enum('deposit','withdraw','buy','winning') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_nopad_ci NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `transaction_date` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `transactions`
--

INSERT INTO `transactions` (`transaction_id`, `user_id`, `TYPE`, `amount`, `transaction_date`) VALUES
(1, 1, 'deposit', 50.00, '2025-02-23 16:10:22'),
(2, 1, 'deposit', 50.00, '2025-02-23 16:11:18'),
(3, 1, 'deposit', 50.00, '2025-02-23 16:33:43'),
(4, 1, 'deposit', 50.00, '2025-02-23 16:35:24'),
(5, 1, 'withdraw', 50.00, '2025-02-23 16:36:21'),
(6, 1, 'withdraw', 50.00, '2025-02-23 16:36:34'),
(7, 1, 'withdraw', 50.00, '2025-02-23 16:36:36'),
(8, 1, 'withdraw', 50.00, '2025-02-23 16:36:43'),
(9, 1, 'deposit', 50.00, '2025-02-23 16:37:40'),
(10, 1, 'deposit', 500.00, '2025-03-20 02:14:13'),
(11, 1, 'deposit', 200.00, '2025-03-20 02:16:24'),
(12, 1, 'deposit', 100.00, '2025-03-20 02:16:59'),
(13, 1, '', 40.00, '2025-03-20 02:47:00'),
(14, 1, '', 40.00, '2025-03-20 02:47:05'),
(15, 1, '', 20.00, '2025-03-21 07:42:42'),
(16, 1, '', 20.00, '2025-03-21 15:03:53'),
(17, 1, '', 20.00, '2025-03-21 15:52:07'),
(18, 1, '', 20.00, '2025-03-21 15:52:08'),
(19, 1, '', 100.00, '2025-03-21 15:57:24'),
(20, 1, 'buy', 100.00, '2025-03-22 02:09:24');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `PASSWORD` varchar(255) NOT NULL,
  `balance` decimal(15,2) DEFAULT 0.00,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `fullname` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `username`, `email`, `PASSWORD`, `balance`, `created_at`, `fullname`) VALUES
(1, 'wilson', 'wilson', 'f70a73c71ceb6db4689ed3c2c764abeb7df64f615d5709f46e44ed122b7f7d76', 9730.00, '2025-02-23 06:23:14', ''),
(3, 'yeshel', 'email', 'f8ed6f4e57c31ef803ad576ae7b3fcf3e65fb7917c82484eb3681e9401e8c863', 6500.00, '2025-03-21 15:14:57', '');

-- --------------------------------------------------------

--
-- Table structure for table `winners`
--

CREATE TABLE `winners` (
  `winner_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `bet_id` int(11) NOT NULL,
  `draw_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `winners`
--

INSERT INTO `winners` (`winner_id`, `user_id`, `bet_id`, `draw_id`) VALUES
(1, 1, 10, 47),
(2, 1, 12, 50),
(3, 1, 13, 51),
(4, 1, 14, 55),
(5, 1, 19, 60),
(6, 1, 20, 61),
(7, 1, 21, 62),
(8, 1, 23, 64),
(9, 1, 24, 65),
(10, 1, 25, 66),
(11, 1, 26, 67),
(12, 1, 27, 68),
(13, 1, 28, 69),
(14, 1, 29, 70),
(15, 1, 30, 71),
(16, 1, 31, 72),
(17, 1, 32, 76),
(18, 1, 34, 77),
(19, 1, 35, 78),
(20, 1, 36, 79),
(21, 1, 37, 80),
(22, 3, 54, 85),
(23, 3, 55, 86),
(24, 3, 62, 95),
(25, 3, 65, 98),
(26, 1, 68, 99);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `bets`
--
ALTER TABLE `bets`
  ADD PRIMARY KEY (`bet_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `draw_id` (`draw_id`),
  ADD KEY `ticket_id` (`ticket_id`);

--
-- Indexes for table `draws`
--
ALTER TABLE `draws`
  ADD PRIMARY KEY (`draw_id`);

--
-- Indexes for table `prize`
--
ALTER TABLE `prize`
  ADD PRIMARY KEY (`prize_id`);

--
-- Indexes for table `tickets`
--
ALTER TABLE `tickets`
  ADD PRIMARY KEY (`ticket_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `transactions`
--
ALTER TABLE `transactions`
  ADD PRIMARY KEY (`transaction_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `winners`
--
ALTER TABLE `winners`
  ADD PRIMARY KEY (`winner_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `bet_id` (`bet_id`),
  ADD KEY `draw_id` (`draw_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `bets`
--
ALTER TABLE `bets`
  MODIFY `bet_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=69;

--
-- AUTO_INCREMENT for table `draws`
--
ALTER TABLE `draws`
  MODIFY `draw_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=101;

--
-- AUTO_INCREMENT for table `prize`
--
ALTER TABLE `prize`
  MODIFY `prize_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `tickets`
--
ALTER TABLE `tickets`
  MODIFY `ticket_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=86;

--
-- AUTO_INCREMENT for table `transactions`
--
ALTER TABLE `transactions`
  MODIFY `transaction_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `winners`
--
ALTER TABLE `winners`
  MODIFY `winner_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `bets`
--
ALTER TABLE `bets`
  ADD CONSTRAINT `bets_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `bets_ibfk_2` FOREIGN KEY (`draw_id`) REFERENCES `draws` (`draw_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `bets_ibfk_3` FOREIGN KEY (`ticket_id`) REFERENCES `tickets` (`ticket_id`) ON DELETE CASCADE;

--
-- Constraints for table `tickets`
--
ALTER TABLE `tickets`
  ADD CONSTRAINT `tickets_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE;

--
-- Constraints for table `transactions`
--
ALTER TABLE `transactions`
  ADD CONSTRAINT `transactions_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE;

--
-- Constraints for table `winners`
--
ALTER TABLE `winners`
  ADD CONSTRAINT `winners_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `winners_ibfk_2` FOREIGN KEY (`bet_id`) REFERENCES `bets` (`bet_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `winners_ibfk_3` FOREIGN KEY (`draw_id`) REFERENCES `draws` (`draw_id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
