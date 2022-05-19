-- phpMyAdmin SQL Dump
-- version 4.8.4
-- https://www.phpmyadmin.net/
--
-- 主機: 127.0.0.1
-- 產生時間： 2020 年 02 月 19 日 11:47
-- 伺服器版本: 10.1.37-MariaDB
-- PHP 版本： 7.3.0

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- 資料庫： `inquiry_v2`
--

-- --------------------------------------------------------

--
-- 資料表結構 `activity`
--

CREATE TABLE `activity` (
  `activity_id` int(11) NOT NULL,
  `member_id` int(11) NOT NULL,
  `activity_title` text NOT NULL,
  `activity_info` text NOT NULL,
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- 資料表的匯出資料 `activity`
--

INSERT INTO `activity` (`activity_id`, `member_id`, `activity_title`, `activity_info`, `create_time`) VALUES
(17, 3, '組別測試', '測試是否能進入小組', '2019-12-30 04:42:33'),
(18, 2, '植物的世界', '認識植物的基本知識', '2020-01-15 00:41:41'),
(19, 3, 'teacher/main測試', 'teacher/main測試', '2020-02-03 07:52:40'),
(21, 3, '組別資料夾', '組別資料夾', '2020-02-10 05:38:20'),
(24, 3, '關鍵字測試', '關鍵字測試', '2020-02-10 06:30:46'),
(25, 3, '重製後組別測試', '重製後組別測試', '2020-02-18 15:21:56'),
(26, 3, '重製後組別測試2', '重製後組別測試2', '2020-02-18 15:22:50');

-- --------------------------------------------------------

--
-- 資料表結構 `activity_group`
--

CREATE TABLE `activity_group` (
  `group_id` int(11) NOT NULL,
  `activity_id` int(11) NOT NULL,
  `member_id` int(11) NOT NULL,
  `group_name` text NOT NULL,
  `group_key` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- 資料表的匯出資料 `activity_group`
--

INSERT INTO `activity_group` (`group_id`, `activity_id`, `member_id`, `group_name`, `group_key`) VALUES
(36, 17, 3, '第1組', 'TJIS40706'),
(37, 17, 3, '第2組', 'iZLZ60098'),
(38, 17, 3, '第3組', 'cvqe17802'),
(39, 18, 2, '第1組', 'BiuG12860'),
(40, 18, 2, '第2組', 'QiOz47930'),
(41, 18, 2, '第3組', 'jdIY48684'),
(42, 17, 3, '第4組', 'qwav18344'),
(43, 19, 3, '第1組', 'QlCV73785'),
(44, 19, 3, '第2組', 'LAOE05683'),
(45, 17, 3, '第5組', 'DcXM92536'),
(46, 17, 3, '第6組', 'tVlI15267'),
(47, 17, 3, '第7組', 'WkxE64223'),
(48, 17, 3, '第8組', 'sxYu19107'),
(52, 21, 3, '第1組', 'hMJc35802'),
(53, 21, 3, '第2組', 'NxVd86957'),
(57, 24, 3, '第1組', 'dWTd69701'),
(58, 24, 3, '第2組', 'Isob95019'),
(59, 19, 3, '第201組', 'XONZ59179'),
(60, 19, 3, '第211組', 'UQDV50477'),
(61, 19, 3, '第5組', 'NIIW68212'),
(62, 19, 3, '第6組', 'YBQP77140'),
(63, 25, 3, '第1組', 'XQNV52539'),
(64, 25, 3, '第2組', 'JYSK52622'),
(65, 26, 3, '第1組', 'PZHI19795'),
(66, 26, 3, '第2組', 'ELIZ00117');

-- --------------------------------------------------------

--
-- 資料表結構 `attachment`
--

CREATE TABLE `attachment` (
  `attachment_id` int(11) NOT NULL,
  `node_id` int(11) NOT NULL,
  `attachment_name` text NOT NULL,
  `attachment_type` text NOT NULL,
  `share` tinyint(1) NOT NULL,
  `member_id` int(11) NOT NULL,
  `group_id` int(11) NOT NULL,
  `attachment_create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- 資料表的匯出資料 `attachment`
--

INSERT INTO `attachment` (`attachment_id`, `node_id`, `attachment_name`, `attachment_type`, `share`, `member_id`, `group_id`, `attachment_create_time`) VALUES
(1, 170, 'IMAG3131.jpg', '圖片', 1, 3, 42, '2020-02-10 05:11:05'),
(2, 171, 'IMAG3115.jpg', '圖片', 1, 3, 42, '2020-02-10 05:11:05'),
(4, 176, 'IMAG3073_2020110jpg', '圖片', 1, 3, 42, '2020-02-10 05:11:05'),
(5, 177, 'IMAG3096_2020110.jpg', '圖片', 1, 3, 42, '2020-02-10 05:11:05'),
(6, 178, 'IMAG3115_2020210.jpg', '圖片', 1, 3, 42, '2020-02-10 05:11:06'),
(7, 179, '畢業照方案_2020210.png', '圖片', 1, 3, 42, '2020-02-10 05:11:06'),
(8, 180, '12_Citrus_Healthy-Holiday-Food-Gifts-Instead-of-Fruit-Cake_524210419-ch_ch_2020210.jpg', '圖片', 1, 3, 36, '2020-02-10 05:11:06'),
(9, 181, '府社團字第1070234700號_申請換發第4屆理事長當選證明書_2020210.pdf', '文件', 1, 3, 42, '2020-02-10 05:11:06'),
(10, 182, '14102748_1079216055499176_5248871484399376756_n_2020210.jpg', '圖片', 1, 4, 38, '2020-02-10 05:11:06'),
(11, 183, '201411131524230_2020210.pdf', '文件', 1, 4, 38, '2020-02-10 05:11:06'),
(12, 185, '植物構造_2020210.jpg', '', 1, 2, 41, '2020-02-10 05:14:18'),
(13, 186, '1515456591895_2020210.jpg', '', 1, 3, 48, '2020-02-10 05:32:19'),
(14, 187, 'Bao-Bao-Holder3_2020210.jpg', '', 1, 3, 53, '2020-02-10 05:38:53'),
(15, 188, 'HouseholdsStructureTable_2020210.PNG', '', 1, 4, 38, '2020-02-10 08:09:28');

-- --------------------------------------------------------

--
-- 資料表結構 `directive_observation`
--

CREATE TABLE `directive_observation` (
  `directive_observation_id` int(11) NOT NULL,
  `node_id` int(11) NOT NULL,
  `directive_observation_info` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- 資料表的匯出資料 `directive_observation`
--

INSERT INTO `directive_observation` (`directive_observation_id`, `node_id`, `directive_observation_info`) VALUES
(1, 87, '<p>直接觀察說明1</p>'),
(2, 88, '<h3>步驟說明</h3><ol><li>步驟1</li><li>步驟2</li><li>步驟3</li></ol>'),
(3, 97, '222'),
(4, 99, '222'),
(5, 98, '222'),
(6, 108, '<p>222</p>'),
(7, 127, '<p>直接觀察說明</p>'),
(8, 146, '<p>test</p>'),
(9, 147, '<p>test2</p>'),
(10, 148, '<p>test3</p>'),
(11, 149, '<p>test4</p>'),
(12, 154, '<p>123</p>'),
(13, 155, '<p>123</p>'),
(14, 156, '<p>123</p>'),
(15, 159, '<p>小明直接觀察活動內容</p><p>javascript定時執行 <a href=\"https://blog.camel2243.com/2016/08/06/javascript-%E6%B7%B1%E5%85%A5%E4%BA%86%E8%A7%A3-settimeout-%E8%88%87-setinterval-%E7%9A%84%E4%B8%8D%E5%90%8C%E4%B9%8B%E8%99%95/\">https://blog.camel2243.com/2016/08/06/javascript-%E6%B7%B1%E5%85%A5%E4%BA%86%E8%A7%A3-settimeout-%E8%88%87-setinterval-%E7%9A%84%E4%B8%8D%E5%90%8C%E4%B9%8B%E8%99%95/</a></p>');

-- --------------------------------------------------------

--
-- 資料表結構 `directive_observation_record`
--

CREATE TABLE `directive_observation_record` (
  `directive_observation_record_id` int(11) NOT NULL,
  `directive_observation_id` int(11) NOT NULL,
  `member_id` int(11) NOT NULL,
  `directive_observation_record` text NOT NULL,
  `directive_observation_record_create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- 資料表的匯出資料 `directive_observation_record`
--

INSERT INTO `directive_observation_record` (`directive_observation_record_id`, `directive_observation_id`, `member_id`, `directive_observation_record`, `directive_observation_record_create_time`) VALUES
(1, 6, 3, 'record test 01', '2020-01-26 07:39:44'),
(2, 6, 3, 'record test 02', '2020-01-26 07:39:44'),
(3, 6, 3, '<p>testaaa</p>', '2020-01-26 08:08:42'),
(4, 6, 3, '<p>test4</p>', '2020-01-26 08:09:59'),
(5, 6, 3, '<h2>test5</h2>', '2020-01-26 08:10:18'),
(6, 3, 3, '<h2>111test</h2>', '2020-01-26 08:10:40'),
(7, 6, 3, '<p>test6</p><ul><li>1</li><li>2</li><li>3</li></ul>', '2020-01-26 08:12:37'),
(8, 6, 3, '<p>觀察記錄</p>', '2020-02-02 07:46:05'),
(9, 6, 3, '<p>test</p>', '2020-02-02 07:55:12');

-- --------------------------------------------------------

--
-- 資料表結構 `edge`
--

CREATE TABLE `edge` (
  `edge_id` int(11) NOT NULL,
  `edge_from` int(11) NOT NULL,
  `edge_to` int(11) NOT NULL,
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- 資料表的匯出資料 `edge`
--

INSERT INTO `edge` (`edge_id`, `edge_from`, `edge_to`, `create_time`) VALUES
(1, 67, 68, '2020-01-04 08:39:16'),
(2, 65, 77, '2020-01-04 08:55:38'),
(3, 65, 78, '2020-01-04 09:16:32'),
(4, 61, 79, '2020-01-04 09:16:48'),
(5, 67, 80, '2020-01-04 09:19:28'),
(6, 54, 81, '2020-01-04 13:20:08'),
(7, 70, 82, '2020-01-04 14:14:43'),
(8, 67, 83, '2020-01-07 08:30:03'),
(9, 57, 85, '2020-01-13 15:45:52'),
(10, 80, 86, '2020-01-14 02:56:16'),
(11, 90, 93, '2020-01-15 02:27:17'),
(12, 94, 96, '2020-01-15 09:22:42'),
(13, 116, 117, '2020-01-31 16:06:42'),
(14, 131, 133, '2020-02-03 08:14:06'),
(15, 129, 134, '2020-02-04 05:34:48'),
(16, 131, 135, '2020-02-04 05:46:06'),
(17, 131, 136, '2020-02-04 05:49:46'),
(18, 129, 137, '2020-02-04 14:59:27'),
(19, 138, 139, '2020-02-05 03:29:04'),
(20, 138, 140, '2020-02-05 03:29:53'),
(21, 126, 141, '2020-02-05 06:58:40'),
(22, 128, 141, '2020-02-05 06:58:40'),
(23, 141, 142, '2020-02-05 07:07:40'),
(24, 128, 142, '2020-02-05 07:07:40'),
(25, 126, 143, '2020-02-05 07:14:07'),
(26, 141, 143, '2020-02-05 07:14:07'),
(27, 142, 143, '2020-02-05 07:14:07'),
(28, 142, 144, '2020-02-05 07:16:37'),
(29, 125, 144, '2020-02-05 07:16:37'),
(30, 144, 145, '2020-02-05 07:19:34'),
(31, 127, 145, '2020-02-05 07:19:34'),
(32, 146, 147, '2020-02-05 08:36:06'),
(33, 146, 148, '2020-02-05 08:36:29'),
(34, 147, 148, '2020-02-05 08:36:29'),
(35, 144, 149, '2020-02-05 08:39:12'),
(36, 145, 149, '2020-02-05 08:39:12'),
(37, 77, 150, '2020-02-05 08:45:16'),
(38, 65, 150, '2020-02-05 08:45:16'),
(39, 79, 151, '2020-02-05 08:45:31'),
(40, 61, 151, '2020-02-05 08:45:31'),
(41, 151, 152, '2020-02-05 08:45:38'),
(42, 85, 153, '2020-02-05 08:47:43'),
(43, 57, 153, '2020-02-05 08:47:43'),
(44, 102, 154, '2020-02-05 08:48:07'),
(45, 153, 154, '2020-02-05 08:48:07'),
(46, 139, 155, '2020-02-05 09:12:12'),
(47, 0, 156, '2020-02-05 09:17:24'),
(48, 0, 157, '2020-02-05 13:52:23'),
(49, 0, 159, '2020-02-06 05:31:32'),
(50, 0, 160, '2020-02-06 05:32:36'),
(51, 0, 161, '2020-02-06 05:33:54'),
(52, 161, 162, '2020-02-06 05:43:12'),
(53, 161, 163, '2020-02-06 05:43:22'),
(54, 160, 164, '2020-02-06 05:48:56'),
(55, 0, 166, '2020-02-08 03:48:23'),
(56, 171, 172, '2020-02-10 02:42:42'),
(57, 170, 173, '2020-02-10 02:43:35'),
(58, 171, 173, '2020-02-10 02:43:35'),
(59, 147, 174, '2020-02-10 02:47:08'),
(60, 183, 184, '2020-02-10 04:47:05');

-- --------------------------------------------------------

--
-- 資料表結構 `experiment`
--

CREATE TABLE `experiment` (
  `experiment_id` int(11) NOT NULL,
  `node_id` int(11) NOT NULL,
  `research_hypothesis` text NOT NULL,
  `research_motivation` text NOT NULL,
  `experiment_record_node_id` int(11) NOT NULL DEFAULT '-1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- 資料表的匯出資料 `experiment`
--

INSERT INTO `experiment` (`experiment_id`, `node_id`, `research_hypothesis`, `research_motivation`, `experiment_record_node_id`) VALUES
(1, 129, '研究假設', '<p>哈哈哈哈哈</p>', 137),
(2, 130, '第二組研究假設', '<p>第二組實驗說明</p>', -1),
(3, 131, '第一組研究假設', '<p>第一組研究動機</p>', 136),
(4, 132, '第二組研究假設', '<p>第二組研究動機</p>', -1),
(5, 138, '111', '<p>111</p>', 139),
(6, 151, '22', '<p>222</p>', 152),
(7, 161, '小名研究假設', '<p>小明研究動機</p>', 163);

-- --------------------------------------------------------

--
-- 資料表結構 `experiment_record`
--

CREATE TABLE `experiment_record` (
  `experiment_record_id` int(11) NOT NULL,
  `node_id` int(11) NOT NULL,
  `member_id` int(11) NOT NULL,
  `experiment_record_content` text NOT NULL,
  `experiment_record_create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- 資料表的匯出資料 `experiment_record`
--

INSERT INTO `experiment_record` (`experiment_record_id`, `node_id`, `member_id`, `experiment_record_content`, `experiment_record_create_time`) VALUES
(1, 137, 3, '<p>組別測試第1組實驗記錄1</p>', '2020-02-04 15:24:58'),
(2, 137, 3, '<p>組別測試第1組實驗記錄2</p>', '2020-02-04 15:25:07'),
(3, 139, 3, '<p>12345</p>', '2020-02-05 03:29:15'),
(4, 163, 4, '<p>小明研究紀錄</p>', '2020-02-06 05:43:39');

-- --------------------------------------------------------

--
-- 資料表結構 `group_member`
--

CREATE TABLE `group_member` (
  `group_member_id` int(11) NOT NULL,
  `member_id` int(11) NOT NULL,
  `group_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- 資料表的匯出資料 `group_member`
--

INSERT INTO `group_member` (`group_member_id`, `member_id`, `group_id`) VALUES
(1, 4, 37),
(2, 5, 37),
(3, 4, 38),
(4, 4, 39);

-- --------------------------------------------------------

--
-- 資料表結構 `idea`
--

CREATE TABLE `idea` (
  `idea_id` int(11) NOT NULL,
  `node_id` int(11) NOT NULL,
  `idea_content` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- 資料表的匯出資料 `idea`
--

INSERT INTO `idea` (`idea_id`, `node_id`, `idea_content`) VALUES
(7, 55, '<p>想法內容1</p><p><strong>[我的想法]</strong></p>'),
(8, 56, '<p>想法內容1</p><p><strong>[我的想法]</strong></p>'),
(9, 62, '<p>想法2內容<strong>[我想知道]</strong></p><p><strong>[新資訊或參考來源]</strong></p>'),
(10, 63, '<h3>想法3內容</h3>'),
(11, 64, '<h4>想法4內容</h4>'),
(12, 65, '<p>第三組想法1<strong>[我的想法]</strong></p>'),
(13, 67, '<p>第二組想法2 <strong>[我的理論][新資訊或參考來源]</strong><br>&nbsp;</p>'),
(14, 68, '<p>想法3內容</p>'),
(15, 69, '<p>想法4內容想法4內容想法4內容想法4內容想法4內容想法4內容</p>'),
(16, 70, '<p>想法5內容</p>'),
(17, 71, '<p>想法6內容</p>'),
(18, 72, '<p>想法7內容</p>'),
(19, 73, '<p>想法8內容</p><p>&nbsp;</p>'),
(20, 74, '<p>想法9內容</p>'),
(21, 75, '<p>想法10內容</p>'),
(22, 76, '<p>想法11內容</p>'),
(23, 77, '<p>回覆想法1內容OWO</p>'),
(24, 78, '<p>回覆想法2內容</p>'),
(25, 79, '<p>回覆想法3內容</p>'),
(26, 80, '<p>第二組回覆想法2內容</p>'),
(27, 81, '<p>第2組回覆關鍵提問內容</p>'),
(28, 82, '<p>回覆想法</p>'),
(29, 83, '<p>123</p>'),
(30, 85, '<p>小明回覆關鍵提問2</p>'),
(31, 86, '<p>學生回覆測試內容</p>'),
(32, 91, '<p>植物需要曬太陽才會長大</p>'),
(33, 93, '<p>沒有澆水的話植物會枯死</p>'),
(34, 96, '<p>植物都需要澆水才能長大</p>'),
(35, 101, '<p>變更測試內容</p>'),
(36, 102, '<p>變更測試內容</p>'),
(37, 100, '<p>變更測試內容</p>'),
(38, 107, '<p>修改後測試內容</p>'),
(39, 117, '<p>回復操作觀察內容</p>'),
(40, 126, '<p>想法內容</p>'),
(41, 133, '<p>回覆第一組實驗</p>'),
(42, 140, '<p>444124</p>'),
(43, 141, '<p>回覆126, 128內容</p>'),
(44, 142, '<p>回覆128,141內容</p>'),
(45, 143, '<p>回覆126,141,142想法內容</p>'),
(46, 144, '<p>回覆125, 142想法</p>'),
(47, 145, '<p>回覆127,114</p>'),
(48, 153, '<p>1</p>'),
(49, 158, '<p>小明想法內容</p>'),
(50, 162, '<p>回覆內容</p>'),
(51, 164, '<p>123</p>'),
(52, 165, '<p>1111</p>'),
(53, 172, '<p>回覆檔案</p>'),
(54, 173, '<p>回覆兩個檔案</p>'),
(55, 174, '<p>11111</p>'),
(56, 184, '<p>地圖</p>');

-- --------------------------------------------------------

--
-- 資料表結構 `key_question`
--

CREATE TABLE `key_question` (
  `key_question_id` int(11) NOT NULL,
  `node_id` int(11) NOT NULL,
  `key_question_info` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- 資料表的匯出資料 `key_question`
--

INSERT INTO `key_question` (`key_question_id`, `node_id`, `key_question_info`) VALUES
(35, 53, '關鍵提問1說明'),
(36, 54, '關鍵提問1說明'),
(37, 57, '關鍵提問2說明'),
(38, 58, '關鍵提問2說明'),
(39, 59, '關鍵提問3info'),
(40, 60, '關鍵提問3info'),
(41, 61, '關鍵提問3info'),
(42, 66, '第二組關鍵提問說明'),
(43, 84, '第2組關鍵提問'),
(44, 89, '植物生產需要什麼呢？它要怎麼獲得它想要的？'),
(45, 90, '植物生產需要什麼呢？它要怎麼獲得它想要的？'),
(46, 94, '校園中的花草、樹木需要活在怎樣的環境呢？'),
(47, 95, '校園中的花草、樹木需要活在怎樣的環境呢？'),
(48, 103, '變更測試內容'),
(49, 105, '變更測試內容'),
(50, 104, '變更測試內容'),
(51, 106, '修改後測試內容'),
(52, 125, '關鍵提問說明'),
(53, 167, '第四組關鍵提問2說明');

-- --------------------------------------------------------

--
-- 資料表結構 `key_word`
--

CREATE TABLE `key_word` (
  `key_word_id` int(11) NOT NULL,
  `activity_id` int(11) NOT NULL,
  `key_word` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- 資料表的匯出資料 `key_word`
--

INSERT INTO `key_word` (`key_word_id`, `activity_id`, `key_word`) VALUES
(1, 24, '關鍵字1'),
(2, 24, '關鍵字2');

-- --------------------------------------------------------

--
-- 資料表結構 `member`
--

CREATE TABLE `member` (
  `member_id` int(11) NOT NULL,
  `member_account` text NOT NULL,
  `member_password` text NOT NULL,
  `member_city` text NOT NULL,
  `member_school` text NOT NULL,
  `member_name` text NOT NULL,
  `member_create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `member_identity` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- 資料表的匯出資料 `member`
--

INSERT INTO `member` (`member_id`, `member_account`, `member_password`, `member_city`, `member_school`, `member_name`, `member_create_time`, `member_identity`) VALUES
(2, 'cmhuang', 'cmhuang', '桃園市', 'NCU', '黃嘉眉', '2019-12-18 06:48:40', '老師'),
(3, 'aaa', 'aaa', '桃園市', 'NCU', 'aaa', '2019-12-22 14:11:59', '老師'),
(4, 'bbb', 'bbb', '高雄市', 'KGHS', '王小明', '2020-01-07 08:56:58', '學生'),
(5, 'ccc', 'ccc', '桃園市', 'NCU', '美美', '2020-01-09 10:19:52', '學生');

-- --------------------------------------------------------

--
-- 資料表結構 `node`
--

CREATE TABLE `node` (
  `node_id` int(11) NOT NULL,
  `member_id` int(11) NOT NULL,
  `group_id` int(11) NOT NULL,
  `node_type` text NOT NULL,
  `node_title` text NOT NULL,
  `node_author` text NOT NULL,
  `x` int(11) NOT NULL DEFAULT '0',
  `y` int(11) NOT NULL DEFAULT '0',
  `node_create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `node_revised_count` int(11) NOT NULL,
  `node_read_count` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- 資料表的匯出資料 `node`
--

INSERT INTO `node` (`node_id`, `member_id`, `group_id`, `node_type`, `node_title`, `node_author`, `x`, `y`, `node_create_time`, `node_revised_count`, `node_read_count`) VALUES
(53, 3, 36, 'key_question', '關鍵提問1', 'aaa', -440, -452, '2020-02-06 04:24:18', 0, 0),
(54, 3, 37, 'key_question', '關鍵提問1', 'aaa', -243, 27, '2020-02-06 04:24:03', 0, 0),
(55, 3, 36, 'idea', '想法1', 'aaa', -109, 330, '2020-02-06 04:24:18', 0, 0),
(56, 3, 37, 'idea', '想法1', 'aaa', 45, 225, '2020-02-06 04:24:03', 0, 0),
(57, 3, 38, 'key_question', '關鍵提問2', 'aaa', 20, -269, '2020-02-06 04:23:44', 0, 0),
(58, 3, 36, 'key_question', '關鍵提問2', 'aaa', -293, 275, '2020-02-06 04:24:18', 0, 0),
(59, 3, 36, 'key_question', '關鍵提問3', 'aaa', 491, 334, '2020-02-06 04:24:18', 0, 0),
(60, 3, 37, 'key_question', '關鍵提問3', 'aaa', -318, 259, '2020-02-06 04:24:03', 0, 0),
(61, 3, 38, 'key_question', '關鍵提問3', 'aaa', 264, 35, '2020-02-06 04:23:44', 0, 0),
(62, 3, 36, 'idea', '想法2', 'aaa', -468, -104, '2020-02-06 04:24:18', 0, 0),
(63, 3, 36, 'idea', '想法3', 'aaa', 205, -307, '2020-02-06 04:24:18', 0, 0),
(64, 3, 36, 'idea', '想法4', 'aaa', 300, -438, '2020-02-06 04:24:18', 0, 0),
(65, 3, 38, 'idea', '第三組想法1', 'aaa', -88, 100, '2020-02-06 04:23:44', 0, 0),
(66, 3, 37, 'key_question', '第二組關鍵提問', 'aaa', 337, 173, '2020-02-06 04:24:03', 0, 0),
(67, 3, 37, 'idea', '第二組想法2', 'aaa', 33, -21, '2020-02-06 04:24:03', 0, 0),
(68, 3, 37, 'idea', '想法3', 'aaa', 22, 98, '2020-02-06 04:24:03', 0, 0),
(69, 3, 37, 'idea', '想法4', 'aaa', 200, -264, '2020-02-06 04:24:03', 0, 0),
(70, 3, 36, 'idea', '想法5', 'aaa', -180, -34, '2020-02-06 04:24:18', 0, 0),
(71, 3, 36, 'idea', '想法6', 'aaa', -358, -289, '2020-02-06 04:24:18', 0, 0),
(72, 3, 36, 'idea', '想法7', 'aaa', -163, -310, '2020-02-06 04:24:18', 0, 0),
(73, 3, 36, 'idea', '想法8', 'aaa', 327, 194, '2020-02-06 04:24:18', 0, 0),
(74, 3, 36, 'idea', '想法9', 'aaa', 436, -215, '2020-02-06 04:24:18', 0, 0),
(75, 3, 36, 'idea', '想法10', 'aaa', 480, 66, '2020-02-06 04:24:18', 0, 0),
(76, 3, 36, 'idea', '想法11', 'aaa', 80, 476, '2020-02-06 04:24:18', 0, 0),
(77, 3, 38, 'idea', '回覆想法1', 'aaa', -6, 1, '2020-02-06 04:23:44', 0, 0),
(78, 3, 38, 'idea', '回覆想法2', 'aaa', -178, 194, '2020-02-06 04:23:44', 0, 0),
(79, 3, 38, 'idea', '回覆想法3', 'aaa', 345, 94, '2020-02-06 04:23:44', 0, 0),
(80, 3, 37, 'idea', '回覆想法2', 'aaa', -59, -101, '2020-02-06 04:24:03', 0, 0),
(81, 3, 37, 'idea', '第2組回覆關鍵提問', 'aaa', -140, 95, '2020-02-06 04:24:03', 0, 0),
(82, 3, 36, 'idea', '第1組回覆想法', 'aaa', -278, 39, '2020-02-06 04:24:18', 0, 0),
(83, 3, 37, 'idea', '123', 'aaa', 138, -93, '2020-02-06 04:24:03', 0, 0),
(84, 3, 37, 'key_question', '第2組關鍵提問', 'aaa', 202, 93, '2020-02-06 04:24:03', 0, 0),
(85, 4, 38, 'idea', '小明回覆關鍵提問2', '王小明', 53, -167, '2020-02-06 04:23:44', 0, 0),
(86, 4, 37, 'idea', '學生回覆測試', '王小明', -145, -190, '2020-02-06 04:24:03', 0, 0),
(87, 4, 37, 'directive_observation', '直接觀察活動1', '王小明', 337, -45, '2020-02-06 04:24:03', 0, 0),
(88, 4, 38, 'directive_observation', '直接觀察', '王小明', -272, 42, '2020-02-06 04:23:44', 0, 0),
(89, 2, 39, 'key_question', '植物為什麼會生長？', '黃嘉眉', -149, -27, '2020-02-10 05:12:21', 0, 0),
(90, 2, 40, 'key_question', '植物為什麼會生長？', '黃嘉眉', 28, 118, '2020-02-10 05:12:33', 0, 0),
(91, 2, 39, 'idea', '植物需要曬太陽', '黃嘉眉', 47, -112, '2020-02-10 05:12:21', 0, 0),
(93, 2, 40, 'idea', '植物需要澆水', '黃嘉眉', -110, 36, '2020-02-10 05:12:33', 0, 0),
(94, 2, 39, 'key_question', '植物需要什麼才能生長？', '黃嘉眉', 96, -2, '2020-02-10 05:12:21', 0, 0),
(95, 2, 40, 'key_question', '植物需要什麼才能生長？', '黃嘉眉', 170, 24, '2020-02-10 05:12:33', 0, 0),
(96, 4, 39, 'idea', '植物需要水分', '王小明', 184, -93, '2020-02-10 05:12:21', 0, 0),
(97, 3, 36, 'directive_observation', '111', 'aaa', -148, 492, '2020-02-06 04:24:18', 0, 0),
(98, 3, 37, 'directive_observation', '111', 'aaa', -335, -205, '2020-02-06 04:24:03', 0, 0),
(99, 3, 38, 'directive_observation', '111', 'aaa', -103, 8, '2020-02-06 05:29:58', 0, 0),
(100, 3, 36, 'idea', '變更測試', 'aaa', -134, -504, '2020-02-06 04:24:18', 0, 0),
(101, 3, 37, 'idea', '變更測試', 'aaa', 267, 360, '2020-02-06 04:24:03', 0, 0),
(102, 3, 38, 'idea', '變更測試', 'aaa', -311, -54, '2020-02-06 04:23:44', 0, 0),
(103, 3, 36, 'key_question', '變更測試', 'aaa', -231, -173, '2020-02-06 04:24:18', 0, 0),
(104, 3, 37, 'key_question', '變更測試', 'aaa', 68, 367, '2020-02-06 04:24:03', 0, 0),
(105, 3, 38, 'key_question', '變更測試', 'aaa', 98, 31, '2020-02-10 07:43:57', 0, 0),
(106, 3, 36, 'key_question', '修改後測試', 'aaa', 9, -381, '2020-02-06 04:24:18', 0, 0),
(107, 3, 36, 'idea', '修改後測試', 'aaa', 294, 440, '2020-02-06 04:24:18', 0, 0),
(108, 3, 36, 'directive_observation', '222', 'aaa', 302, -123, '2020-02-06 04:24:18', 0, 0),
(116, 3, 36, 'operational_observation', '123', 'aaa', -55, -19, '2020-02-06 04:24:18', 0, 0),
(117, 3, 36, 'idea', '回復操作觀察', 'aaa', 47, -36, '2020-02-06 04:24:18', 0, 0),
(122, 3, 37, 'operational_observation', '操作觀察組別測試', 'aaa', -84, -360, '2020-02-06 04:24:03', 0, 0),
(123, 3, 38, 'operational_observation', '操作觀察組別測試', 'aaa', 268, -112, '2020-02-06 04:23:44', 0, 0),
(124, 3, 36, 'operational_observation', '111', 'aaa', -429, 132, '2020-02-06 04:24:18', 0, 0),
(125, 3, 42, 'key_question', '第四組關鍵提問', 'aaa', 10, 279, '2020-02-06 04:23:12', 0, 0),
(126, 3, 42, 'idea', '第4組想法', 'aaa', 300, -116, '2020-02-06 04:23:12', 0, 0),
(127, 3, 42, 'directive_observation', '第4組直接觀察', 'aaa', -71, -110, '2020-02-06 04:23:12', 0, 0),
(128, 3, 42, 'operational_observation', '地4組操作觀察', 'aaa', 56, -73, '2020-02-06 04:23:12', 0, 0),
(129, 3, 36, 'experiment', '實驗研究問題', 'aaa', 100, -180, '2020-02-06 04:24:18', 0, 0),
(130, 3, 37, 'experiment', '第二組研究問題', 'aaa', -132, 279, '2020-02-06 04:24:03', 0, 0),
(131, 3, 43, 'experiment', '第一組研究問題', 'aaa', -250, -44, '2020-02-06 04:20:47', 0, 0),
(132, 3, 44, 'experiment', '第二組研究問題', 'aaa', 167, -89, '2020-02-06 04:21:04', 0, 0),
(133, 3, 43, 'idea', '回覆第一組實驗', 'aaa', 17, -66, '2020-02-06 04:20:47', 0, 0),
(136, 3, 43, 'experiment_record', '第一組研究問題', 'aaa', -12, 89, '2020-02-06 04:18:07', 0, 0),
(137, 3, 36, 'experiment_record', '實驗研究問題', 'aaa', -23, -180, '2020-02-06 04:24:18', 0, 0),
(138, 3, 36, 'experiment', '111', 'aaa', 14, 144, '2020-02-06 04:24:18', 0, 0),
(139, 3, 36, 'experiment_record', '111', 'aaa', 130, 92, '2020-02-06 04:24:18', 0, 0),
(140, 3, 36, 'idea', '123', 'aaa', -111, 159, '2020-02-06 04:24:18', 0, 0),
(141, 3, 42, 'idea', '回覆126, 128', 'aaa', 173, -93, '2020-02-06 04:23:12', 0, 0),
(142, 3, 42, 'idea', '回覆128,141', 'aaa', 121, 44, '2020-02-06 04:23:12', 0, 0),
(143, 3, 42, 'idea', '回覆126,141,142想法', 'aaa', 294, 10, '2020-02-10 02:43:38', 0, 0),
(144, 3, 42, 'idea', '回覆125, 142', 'aaa', -1, 139, '2020-02-06 04:23:12', 0, 0),
(145, 3, 42, 'idea', '回覆127,114', 'aaa', -82, 23, '2020-02-06 04:23:12', 0, 0),
(146, 3, 42, 'directive_observation', 'test', 'aaa', -342, -191, '2020-02-06 04:23:12', 0, 0),
(147, 3, 42, 'directive_observation', 'test2', 'aaa', -228, -209, '2020-02-06 04:23:12', 0, 0),
(148, 3, 42, 'directive_observation', 'test3', 'aaa', -279, -99, '2020-02-06 04:23:12', 0, 0),
(149, 3, 42, 'directive_observation', 'test4', 'aaa', -136, 130, '2020-02-06 04:23:12', 0, 0),
(150, 3, 38, 'operational_observation', '111', 'aaa', 30, 102, '2020-02-06 04:23:44', 0, 0),
(151, 3, 38, 'experiment', '22', 'aaa', 236, 161, '2020-02-06 04:23:44', 0, 0),
(152, 3, 38, 'experiment_record', '22', 'aaa', 151, 268, '2020-02-06 04:23:44', 0, 0),
(153, 3, 38, 'idea', '1', 'aaa', -72, -179, '2020-02-06 04:23:44', 0, 0),
(154, 3, 38, 'directive_observation', '123', 'aaa', -199, -120, '2020-02-06 04:23:44', 0, 0),
(155, 3, 36, 'directive_observation', '123', 'aaa', 229, 14, '2020-02-06 04:24:18', 0, 0),
(156, 3, 36, 'directive_observation', '123', 'aaa', -428, 409, '2020-02-06 04:24:18', 0, 0),
(157, 3, 36, 'operational_observation', '修改操作觀察事件', 'aaa', 147, 305, '2020-02-06 04:24:18', 0, 0),
(158, 4, 38, 'idea', '小明想法', '王小明', 148, 100, '2020-02-10 04:48:09', 0, 0),
(159, 4, 38, 'directive_observation', '小明直接觀察活動', '王小明', 392, -183, '2020-02-06 05:33:15', 0, 0),
(160, 4, 38, 'operational_observation', '小明操作觀察', '王小明', 372, -42, '2020-02-06 05:33:15', 0, 0),
(161, 4, 38, 'experiment', '小明研究問題', '王小明', 179, -186, '2020-02-06 05:36:35', 0, 0),
(162, 4, 38, 'idea', '小明回覆實驗', '王小明', 64, -72, '2020-02-06 05:43:58', 0, 0),
(163, 4, 38, 'experiment_record', '小明研究問題', '王小明', 279, -190, '2020-02-06 05:43:58', 0, 0),
(164, 4, 38, 'idea', '123', '王小明', 218, -4, '2020-02-06 05:54:53', 0, 0),
(165, 3, 43, 'idea', '1112', 'aaa', 0, 0, '2020-02-08 03:47:36', 0, 0),
(166, 3, 43, 'operational_observation', '123', 'aaa', 0, 0, '2020-02-08 03:48:23', 0, 0),
(167, 3, 42, 'key_question', '第四組關鍵提問2', 'aaa', -279, 20, '2020-02-10 02:41:39', 0, 0),
(170, 3, 42, 'attachment', 'IMAG3131.jpg', 'aaa', 57, -197, '2020-02-10 02:41:39', 0, 0),
(171, 3, 42, 'attachment', 'IMAG3115.jpg', 'aaa', 352, 115, '2020-02-10 02:43:38', 0, 0),
(172, 3, 42, 'idea', '回覆檔案', 'aaa', 166, 216, '2020-02-10 02:43:08', 0, 0),
(173, 3, 42, 'idea', '回覆兩個檔案', 'aaa', 523, -183, '2020-02-10 02:43:38', 0, 0),
(174, 3, 42, 'idea', '11111', 'aaa', 0, 0, '2020-02-10 02:47:08', 0, 0),
(176, 3, 42, 'attachment', 'IMAG3073.jpg', 'aaa', 106, -336, '2020-02-10 03:45:19', 0, 0),
(177, 3, 42, 'attachment', 'IMAG3096.jpg', 'aaa', 337, -153, '2020-02-10 03:48:10', 0, 0),
(178, 3, 42, 'attachment', 'IMAG3115.jpg', 'aaa', -57, -291, '2020-02-10 03:45:19', 0, 0),
(179, 3, 42, 'attachment', '畢業照方案.png', 'aaa', -371, 151, '2020-02-10 04:29:56', 0, 0),
(180, 3, 36, 'attachment', '12_Citrus_Healthy-Holiday-Food-Gifts-Instead-of-Fruit-Cake_524210419-ch_ch.jpg', 'aaa', 0, 0, '2020-02-10 04:16:32', 0, 0),
(181, 3, 42, 'attachment', '府社團字第1070234700號_申請換發第4屆理事長當選證明書.pdf', 'aaa', -504, -81, '2020-02-10 04:29:56', 0, 0),
(182, 4, 38, 'attachment', '14102748_1079216055499176_5248871484399376756_n.jpg', '王小明', -323, -180, '2020-02-10 04:47:08', 0, 0),
(183, 4, 38, 'attachment', '201411131524230.pdf', '王小明', 471, 31, '2020-02-10 04:47:08', 0, 0),
(184, 4, 38, 'idea', '地圖', '王小明', 533, -80, '2020-02-10 04:47:08', 0, 0),
(185, 2, 41, 'attachment', '植物構造.jpg', '黃嘉眉', 370, -119, '2020-02-10 05:14:24', 0, 0),
(186, 3, 48, 'attachment', '1515456591895.jpg', 'aaa', 0, 0, '2020-02-10 05:32:19', 0, 0),
(187, 3, 53, 'attachment', 'Bao-Bao-Holder3.jpg', 'aaa', 0, 0, '2020-02-10 05:38:53', 0, 0),
(188, 4, 38, 'attachment', 'HouseholdsStructureTable.PNG', '王小明', 0, 0, '2020-02-10 08:09:28', 0, 0);

-- --------------------------------------------------------

--
-- 資料表結構 `operational_observation`
--

CREATE TABLE `operational_observation` (
  `operational_observation_id` int(11) NOT NULL,
  `node_id` int(11) NOT NULL,
  `operational_observation_info` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- 資料表的匯出資料 `operational_observation`
--

INSERT INTO `operational_observation` (`operational_observation_id`, `node_id`, `operational_observation_info`) VALUES
(8, 116, '123'),
(11, 122, '測試說明'),
(12, 123, '測試說明'),
(13, 124, '222'),
(14, 128, '操作觀察說明'),
(15, 150, '111'),
(16, 157, '修改操作觀察事件'),
(17, 160, '小明操作觀察說明'),
(18, 166, '123');

-- --------------------------------------------------------

--
-- 資料表結構 `operational_observation_record`
--

CREATE TABLE `operational_observation_record` (
  `operational_observation_record_id` int(11) NOT NULL,
  `operational_observation_id` int(11) NOT NULL,
  `member_id` int(11) NOT NULL,
  `operational_observation_record` text NOT NULL,
  `operational_observation_record_create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- 資料表的匯出資料 `operational_observation_record`
--

INSERT INTO `operational_observation_record` (`operational_observation_record_id`, `operational_observation_id`, `member_id`, `operational_observation_record`, `operational_observation_record_create_time`) VALUES
(1, 13, 3, '<p>test</p>', '2020-02-02 07:55:19'),
(2, 13, 3, '<h2>test2</h2>', '2020-02-02 08:00:32'),
(3, 14, 3, '<p>第四組操作觀察紀錄</p>', '2020-02-02 08:04:09'),
(4, 17, 4, '<p>小明test</p>', '2020-02-06 05:32:59');

-- --------------------------------------------------------

--
-- 資料表結構 `practice_material`
--

CREATE TABLE `practice_material` (
  `practice_material_id` int(11) NOT NULL,
  `node_id` int(11) NOT NULL,
  `material_name` text NOT NULL,
  `material_number` text NOT NULL,
  `member_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- 資料表的匯出資料 `practice_material`
--

INSERT INTO `practice_material` (`practice_material_id`, `node_id`, `material_name`, `material_number`, `member_id`) VALUES
(9, 116, '11', '1', 3),
(10, 116, '22', '2', 3),
(11, 122, '材料1', '1', 3),
(12, 122, '材料2', '2', 3),
(13, 123, '材料1', '1', 3),
(14, 123, '材料2', '2', 3),
(15, 124, '11', '1', 3),
(16, 128, '材料1', '1', 3),
(17, 128, '材料2', '2', 3),
(28, 132, '', '', 3),
(33, 131, '第二組材料2', '1株', 3),
(34, 130, '11', '11', 3),
(35, 138, '11', '1', 3),
(36, 138, '22', '2', 3),
(37, 150, '1', '1', 3),
(38, 150, '2', '2', 3),
(39, 157, '修改操作觀察事件材料1', '2', 3),
(40, 157, '修改操作觀察事件材料2', '1', 3),
(43, 129, '129_材料4', '4個', 3),
(44, 160, '小華', '1', 4),
(45, 161, '小明實驗材料1', '1', 4),
(46, 161, '小明實驗材料2', '2', 4),
(47, 166, '111', '22', 3);

-- --------------------------------------------------------

--
-- 資料表結構 `practice_step`
--

CREATE TABLE `practice_step` (
  `practice_step_id` int(11) NOT NULL,
  `node_id` int(11) NOT NULL,
  `step_order` int(11) NOT NULL,
  `step_content` text NOT NULL,
  `member_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- 資料表的匯出資料 `practice_step`
--

INSERT INTO `practice_step` (`practice_step_id`, `node_id`, `step_order`, `step_content`, `member_id`) VALUES
(1, 116, 1, '1', 3),
(2, 116, 2, '2', 3),
(3, 116, 3, '3', 3),
(4, 122, 1, '步驟1', 3),
(5, 122, 2, '步驟2', 3),
(6, 122, 3, '步驟3', 3),
(7, 123, 1, '步驟1', 3),
(8, 123, 2, '步驟2', 3),
(9, 123, 3, '步驟3', 3),
(10, 124, 1, '1', 3),
(11, 124, 2, '3', 3),
(12, 124, 3, '4', 3),
(13, 124, 4, '6', 3),
(14, 128, 1, '步驟1', 3),
(15, 128, 2, '步驟2', 3),
(42, 132, 1, '第二組步驟1', 3),
(43, 132, 2, '第二組步驟2', 3),
(44, 132, 3, '', 3),
(49, 131, 1, '第一組步驟2', 3),
(50, 131, 2, '第一組步驟1', 3),
(51, 130, 1, '11', 3),
(52, 130, 2, '22', 3),
(53, 130, 3, '33', 3),
(54, 130, 4, '44', 3),
(55, 138, 1, '11', 3),
(56, 138, 2, '33', 3),
(57, 138, 3, '22', 3),
(58, 150, 1, '1', 3),
(59, 150, 2, '2', 3),
(60, 157, 1, '修改操作觀察事件步驟1', 3),
(61, 157, 2, '修改操作觀察事件步驟2', 3),
(65, 129, 1, '129_step4', 3),
(66, 129, 2, '129_step1', 3),
(67, 160, 1, '小明1', 4),
(68, 160, 2, '小明2', 4),
(69, 161, 1, '小明實驗步驟1', 4),
(70, 161, 2, '小明實驗步驟4', 4),
(71, 161, 3, '小明實驗步驟2', 4),
(72, 166, 1, '2', 3),
(73, 166, 2, '1', 3);

-- --------------------------------------------------------

--
-- 資料表結構 `vote`
--

CREATE TABLE `vote` (
  `vote_id` int(11) NOT NULL,
  `node_id` int(11) NOT NULL,
  `vote_info` text NOT NULL,
  `vote_start_time` time NOT NULL,
  `vote_end_time` time NOT NULL,
  `vote_state` text NOT NULL,
  `vote_selected_option_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- 資料表結構 `vote_option`
--

CREATE TABLE `vote_option` (
  `vote_option_id` int(11) NOT NULL,
  `vote_id` int(11) NOT NULL,
  `member_id` int(11) NOT NULL,
  `vote_option` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- 資料表結構 `vote_record`
--

CREATE TABLE `vote_record` (
  `vote_record_id` int(11) NOT NULL,
  `vote_option_id` int(11) NOT NULL,
  `member_id` int(11) NOT NULL,
  `vote_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- 已匯出資料表的索引
--

--
-- 資料表索引 `activity`
--
ALTER TABLE `activity`
  ADD PRIMARY KEY (`activity_id`),
  ADD KEY `activity_fk0` (`member_id`);

--
-- 資料表索引 `activity_group`
--
ALTER TABLE `activity_group`
  ADD PRIMARY KEY (`group_id`),
  ADD KEY `group_fk0` (`activity_id`),
  ADD KEY `group_fk1` (`member_id`);

--
-- 資料表索引 `attachment`
--
ALTER TABLE `attachment`
  ADD PRIMARY KEY (`attachment_id`);

--
-- 資料表索引 `directive_observation`
--
ALTER TABLE `directive_observation`
  ADD PRIMARY KEY (`directive_observation_id`),
  ADD KEY `directive_observation_fk0` (`node_id`);

--
-- 資料表索引 `directive_observation_record`
--
ALTER TABLE `directive_observation_record`
  ADD PRIMARY KEY (`directive_observation_record_id`),
  ADD KEY `directive_observation_record_fk0` (`directive_observation_id`),
  ADD KEY `directive_observation_record_fk1` (`member_id`);

--
-- 資料表索引 `edge`
--
ALTER TABLE `edge`
  ADD PRIMARY KEY (`edge_id`);

--
-- 資料表索引 `experiment`
--
ALTER TABLE `experiment`
  ADD PRIMARY KEY (`experiment_id`);

--
-- 資料表索引 `experiment_record`
--
ALTER TABLE `experiment_record`
  ADD PRIMARY KEY (`experiment_record_id`);

--
-- 資料表索引 `group_member`
--
ALTER TABLE `group_member`
  ADD PRIMARY KEY (`group_member_id`),
  ADD KEY `group_member_fk0` (`member_id`),
  ADD KEY `group_member_fk1` (`group_id`);

--
-- 資料表索引 `idea`
--
ALTER TABLE `idea`
  ADD PRIMARY KEY (`idea_id`),
  ADD KEY `idea_fk0` (`node_id`);

--
-- 資料表索引 `key_question`
--
ALTER TABLE `key_question`
  ADD PRIMARY KEY (`key_question_id`);

--
-- 資料表索引 `key_word`
--
ALTER TABLE `key_word`
  ADD PRIMARY KEY (`key_word_id`);

--
-- 資料表索引 `member`
--
ALTER TABLE `member`
  ADD PRIMARY KEY (`member_id`);

--
-- 資料表索引 `node`
--
ALTER TABLE `node`
  ADD PRIMARY KEY (`node_id`),
  ADD KEY `node_fk0` (`member_id`),
  ADD KEY `node_fk1` (`group_id`);

--
-- 資料表索引 `operational_observation`
--
ALTER TABLE `operational_observation`
  ADD PRIMARY KEY (`operational_observation_id`);

--
-- 資料表索引 `operational_observation_record`
--
ALTER TABLE `operational_observation_record`
  ADD PRIMARY KEY (`operational_observation_record_id`);

--
-- 資料表索引 `practice_material`
--
ALTER TABLE `practice_material`
  ADD PRIMARY KEY (`practice_material_id`);

--
-- 資料表索引 `practice_step`
--
ALTER TABLE `practice_step`
  ADD PRIMARY KEY (`practice_step_id`);

--
-- 資料表索引 `vote`
--
ALTER TABLE `vote`
  ADD PRIMARY KEY (`vote_id`),
  ADD KEY `vote_fk0` (`node_id`);

--
-- 資料表索引 `vote_option`
--
ALTER TABLE `vote_option`
  ADD PRIMARY KEY (`vote_option_id`),
  ADD KEY `vote_option_fk0` (`vote_id`),
  ADD KEY `vote_option_fk1` (`member_id`);

--
-- 資料表索引 `vote_record`
--
ALTER TABLE `vote_record`
  ADD PRIMARY KEY (`vote_record_id`),
  ADD KEY `vote_record_fk0` (`vote_option_id`),
  ADD KEY `vote_record_fk1` (`member_id`),
  ADD KEY `vote_record_fk2` (`vote_id`);

--
-- 在匯出的資料表使用 AUTO_INCREMENT
--

--
-- 使用資料表 AUTO_INCREMENT `activity`
--
ALTER TABLE `activity`
  MODIFY `activity_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- 使用資料表 AUTO_INCREMENT `activity_group`
--
ALTER TABLE `activity_group`
  MODIFY `group_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=67;

--
-- 使用資料表 AUTO_INCREMENT `attachment`
--
ALTER TABLE `attachment`
  MODIFY `attachment_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- 使用資料表 AUTO_INCREMENT `directive_observation`
--
ALTER TABLE `directive_observation`
  MODIFY `directive_observation_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- 使用資料表 AUTO_INCREMENT `directive_observation_record`
--
ALTER TABLE `directive_observation_record`
  MODIFY `directive_observation_record_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- 使用資料表 AUTO_INCREMENT `edge`
--
ALTER TABLE `edge`
  MODIFY `edge_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=61;

--
-- 使用資料表 AUTO_INCREMENT `experiment`
--
ALTER TABLE `experiment`
  MODIFY `experiment_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- 使用資料表 AUTO_INCREMENT `experiment_record`
--
ALTER TABLE `experiment_record`
  MODIFY `experiment_record_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- 使用資料表 AUTO_INCREMENT `group_member`
--
ALTER TABLE `group_member`
  MODIFY `group_member_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- 使用資料表 AUTO_INCREMENT `idea`
--
ALTER TABLE `idea`
  MODIFY `idea_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=57;

--
-- 使用資料表 AUTO_INCREMENT `key_question`
--
ALTER TABLE `key_question`
  MODIFY `key_question_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=54;

--
-- 使用資料表 AUTO_INCREMENT `key_word`
--
ALTER TABLE `key_word`
  MODIFY `key_word_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- 使用資料表 AUTO_INCREMENT `member`
--
ALTER TABLE `member`
  MODIFY `member_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- 使用資料表 AUTO_INCREMENT `node`
--
ALTER TABLE `node`
  MODIFY `node_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=189;

--
-- 使用資料表 AUTO_INCREMENT `operational_observation`
--
ALTER TABLE `operational_observation`
  MODIFY `operational_observation_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- 使用資料表 AUTO_INCREMENT `operational_observation_record`
--
ALTER TABLE `operational_observation_record`
  MODIFY `operational_observation_record_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- 使用資料表 AUTO_INCREMENT `practice_material`
--
ALTER TABLE `practice_material`
  MODIFY `practice_material_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=48;

--
-- 使用資料表 AUTO_INCREMENT `practice_step`
--
ALTER TABLE `practice_step`
  MODIFY `practice_step_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=74;

--
-- 使用資料表 AUTO_INCREMENT `vote`
--
ALTER TABLE `vote`
  MODIFY `vote_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- 使用資料表 AUTO_INCREMENT `vote_option`
--
ALTER TABLE `vote_option`
  MODIFY `vote_option_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- 使用資料表 AUTO_INCREMENT `vote_record`
--
ALTER TABLE `vote_record`
  MODIFY `vote_record_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- 已匯出資料表的限制(Constraint)
--

--
-- 資料表的 Constraints `activity`
--
ALTER TABLE `activity`
  ADD CONSTRAINT `activity_fk0` FOREIGN KEY (`member_id`) REFERENCES `member` (`member_id`);

--
-- 資料表的 Constraints `activity_group`
--
ALTER TABLE `activity_group`
  ADD CONSTRAINT `group_fk0` FOREIGN KEY (`activity_id`) REFERENCES `activity` (`activity_id`),
  ADD CONSTRAINT `group_fk1` FOREIGN KEY (`member_id`) REFERENCES `member` (`member_id`);

--
-- 資料表的 Constraints `directive_observation`
--
ALTER TABLE `directive_observation`
  ADD CONSTRAINT `directive_observation_fk0` FOREIGN KEY (`node_id`) REFERENCES `node` (`node_id`);

--
-- 資料表的 Constraints `directive_observation_record`
--
ALTER TABLE `directive_observation_record`
  ADD CONSTRAINT `directive_observation_record_fk0` FOREIGN KEY (`directive_observation_id`) REFERENCES `directive_observation` (`directive_observation_id`),
  ADD CONSTRAINT `directive_observation_record_fk1` FOREIGN KEY (`member_id`) REFERENCES `member` (`member_id`);

--
-- 資料表的 Constraints `group_member`
--
ALTER TABLE `group_member`
  ADD CONSTRAINT `group_member_fk0` FOREIGN KEY (`member_id`) REFERENCES `member` (`member_id`),
  ADD CONSTRAINT `group_member_fk1` FOREIGN KEY (`group_id`) REFERENCES `activity_group` (`group_id`);

--
-- 資料表的 Constraints `idea`
--
ALTER TABLE `idea`
  ADD CONSTRAINT `idea_fk0` FOREIGN KEY (`node_id`) REFERENCES `node` (`node_id`);

--
-- 資料表的 Constraints `node`
--
ALTER TABLE `node`
  ADD CONSTRAINT `node_fk0` FOREIGN KEY (`member_id`) REFERENCES `member` (`member_id`),
  ADD CONSTRAINT `node_fk1` FOREIGN KEY (`group_id`) REFERENCES `activity_group` (`group_id`);

--
-- 資料表的 Constraints `vote`
--
ALTER TABLE `vote`
  ADD CONSTRAINT `vote_fk0` FOREIGN KEY (`node_id`) REFERENCES `node` (`node_id`);

--
-- 資料表的 Constraints `vote_option`
--
ALTER TABLE `vote_option`
  ADD CONSTRAINT `vote_option_fk0` FOREIGN KEY (`vote_id`) REFERENCES `vote` (`vote_id`),
  ADD CONSTRAINT `vote_option_fk1` FOREIGN KEY (`member_id`) REFERENCES `member` (`member_id`);

--
-- 資料表的 Constraints `vote_record`
--
ALTER TABLE `vote_record`
  ADD CONSTRAINT `vote_record_fk0` FOREIGN KEY (`vote_option_id`) REFERENCES `vote_option` (`vote_option_id`),
  ADD CONSTRAINT `vote_record_fk1` FOREIGN KEY (`member_id`) REFERENCES `member` (`member_id`),
  ADD CONSTRAINT `vote_record_fk2` FOREIGN KEY (`vote_id`) REFERENCES `vote` (`vote_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
