### 参考资料
- [从零开始做自动驾驶定位（文章汇总）](https://zhuanlan.zhihu.com/p/113616755)

### 数据集
- kitty 数据集


### 论文和源码
- [LOAM_livox](https://github.com/hku-mars/loam_livox)
> 最小二乘法
- http://www2.imm.dtu.dk/pubdb/edoc/imm3215.pdf
> SVD 分解
- Arun, K. Somani, Thomas S. Huang, and Steven D. Blostein. "Least-squares fitting of two 3-D point
sets." IEEE Transactions on pattern analysis and machine intelligence 5 (1987): 698-700.
> NDT 
- Scan Registration using Segmented Region Growing NDT. Das A, Waslander SL. 2014.
- 3D Scan Registration Using the Normal Distributions Transform with Ground Segmentation and Point Cloud Clustering. Das A, Waslander SL. 2013.
- Scan Registration with Multi-Scale K-Means Normal Distributions Transform. Das A, Waslander SL. 2012.

> 基于特征匹配的前端里程计
- LOAM: Lidar Odometry and Mapping in Real-time Ji Zhang and Sanjiv Singh
- [LOAM论文和程序代码的解读](https://blog.csdn.net/robinvista/article/details/104379087)
- [A-LOAM](https://github.com/HKUST-Aerial-Robotics/A-LOAM)
- [F-LOAM](https://github.com/wh200720041/floam)

> IMU 标定
- [Allan方差分析](https://github.com/gaowenliang/imu_utils)
- [内参误差标定](https://github.com/Kyle-ak/imu_tk)
- （A Robust and Easy to Implement Method for IMU Calibration without External Equipments）

> 回环检测
- [LeGO-LOAM + scan context 闭环检测](https://github.com/irapkaist/SC-LeGO-LOAM)
- [A fast, complete, point cloud based loop closure for LiDAR odometryand mapping](https://github.com/hku-mars/loam_livox)
- [LeGO-LOAM: Lightweight and Ground-Optimized Lidar Odometry and Mapping on Variable Terrain](https://github.com/RobustFieldAutonomyLab/LeGO-LOAM)

> [IMU数据仿真程序地址](https://github.com/Aceinna/gnss-ins-sim)

> 滤波融合
- Quaternion kinematics for the error-state Kalman filter
- [LINS: A Lidar-Inertial State Estimator for Robust and Efficient Navigation](https://github.com/ChaoqinRobotics/LINS---LiDAR-inertial-SLAM)
- [FAST-LIO: A Fast, Robust LiDAR-inertial Odometry Package by Tightly-Coupled
Iterated Kalman Filter](https://github.com/hku-mars/FAST_LIO)

> 预积分
- [LIO-SAM: Tightly-coupled Lidar Inertial Odometry via Smoothing and Mapping](https://github.com/TixiaoShan/LIO-SAM)

> 参数标定
- 雷达内参，论文： Calibration of a rotating multi-beam Lidar
- 雷达内参，论文： Improving the Intrinsic Calibration of a Velodyne LiDAR Sensor
- 雷达内参，论文： 3D LIDAR–camera intrinsic and extrinsic calibration: Identifiability and analytical least-squares-based initialization
- IMu内参 [A Robust and Easy to Implement Method for IMU Calibration without External Equipments](https://github.com/Kyle-ak/imu_tk)
- 编码器内参 论文： Simultaneous Calibration of Odometry and Sensor Parameters for Mobile Robots
- 相机内参标定， 张正友经典方法

> 雷达和相机外参标定
- 论文： LiDAR-Camera Calibration using 3D-3D Point correspondences
- 代码：https://github.com/ankitdhall/lidar_camera_calibration
- 论文： Automatic Extrinsic Calibration for Lidar-Stereo Vehicle Sensor Setups
- 代码： https://github.com/beltransen/velo2cam_calibration

> 多雷达外参标定
- 论文： A Novel Dual-Lidar Calibration Algorithm Using Planar Surfaces
- 代码： https://github.com/ram-lab/lidar_appearance_calibration

> 手眼标定
- 手眼标定适用于所有无共视，但是能输出位姿的传感器之间标定。包括：
  - • 无共视的相机、雷达，或雷达与雷达之间；
  - • 相机与IMU，或雷达与IMU之间(前提是IMU要足够好，或直接使用组合导航)。
- 论文： LiDAR and Camera Calibration using Motion Estimated by Sensor Fusion Odometry
- 代码： https://github.com/ethz-asl/lidar_align

> 时间标定
- 离散时间： Online Temporal Calibration for Monocular Visual-Inertial Systems
- Online Temporal Calibration for Camera-IMU Systems: Theory and Algorithms
- 3D Lidar-IMU Calibration based on Upsampled Preintegrated Measurements for Motion Distortion Correction
- a. kalibr 系列
- 论文：Continuous-Time Batch Estimation using Temporal Basis Functions
- 论文： Unified Temporal and Spatial Calibration for Multi-Sensor Systems
- 论文： Extending kalibr Calibrating the Extrinsics of Multiple IMUs and of Individual Axes
- 代码：https://github.com/ethz-asl/kalibr
- b. 其他
- 论文： Targetless Calibration of LiDAR-IMU System Bas
- 代码：https://github.com/APRIL-ZJU/lidar_IMU_calib

### 参考书籍
- 《机器人学中的状态估计》第8.1.3节
- 《视觉SLAM十四讲》第6.2节. 
- Quaternion kinematics for the error-state Kalman filter
- 《捷联惯导算法与组合导航原理》（严恭敏等著）

### 应用：
- 自动驾驶
- 高精地图
- 机器人

### Tech lists

[1-5] 概念，原理，算法，应用，项目

### 传感器
- LiDAR
  - Lidar分类： 机械雷达 和 固态激光雷达
- Camera
- GPS - GNSS
- IMU - INS
- RTK
- 组合导航
- Encode 编码器
- 轮速计
- Radar
- Ultra Snoic 超声波雷达

### 环境搭建
- Docker
- Ubbuntu
- ROS
- Vscode

### 前端里程计

- 1，基于直接匹配
  - ICP（迭代）
    - SVD: 
      > [参考文献](https://igl.ethz.ch/projects/ARAP/svd_rot.pdf)
      > Arun, K. Somani, Thomas S. Huang, and Steven D. Blostein. "Least-squares fitting of two 3-D point sets." IEEE Transactions on pattern analysis and machine intelligence 5 (1987): 698-700.
    - 最小二乘法
    - 凸优化：最速度下降法，牛顿法，高斯牛顿法，LM
    - 点云预处理（均匀采样，随机，法向量采样）
    - LOSS模型（ICP, PLICP, 点到面，面到面GICP）
    - 求解方法： SVD分解，四元数，迭代优化
    - NICP
    - 实现参考 https://github.com/tttamaki/SICP-test
  - NDT（概率）
    -  将空间划分为栅格，统计落在各栅格中的点; 根据各栅格中的点，计算各栅格均值、协方差，构建高斯分布;根据预测姿态，计算联合概率
    - 点云预处理（均匀采样，随机，法向量采样）
    - 珊格策略（固定尺寸，八叉树）
    - 增加鲁棒性，三线插值
  - 点云运动畸变 & 畸变补偿
  - 里程计精度评价
    - EVO `pip install evo --upgrade --no-binary evo`

- 2，基于直接匹配
  - 向量运算
  - LOAM
    - LOAM: Lidar Odometry and Mapping in Real-time, Ji Zhang and Sanjiv Singh 
    - 特征匹配（线特征，面特征）
    - Eigen & Ceres 优化库
  
### 回环检测
- 1， 有初始相对位姿
  - ICP
  - NDT 


- 2， 无初始相对位姿
  - 非学习方法： scan context & 特征直方图
  - 基于学习方法： segmap & PointNetVLAD


### 后端优化
- 李群、李代数

### 点云地图建立

### 地图的定位

### 惯性器件
- 陀螺仪（机械陀螺-激光陀螺-光纤陀螺-MEMS陀螺）
- 加速度计
- 惯性器件误差（内参：零偏，刻度系数误差，安装误差，）
- Allan方差分析
- 惯性器件温补
- 三维运动
  - 姿态有三种表示形式：欧拉角、旋转矩阵、四元数，此外还有等效旋转矢量 

### 滤波的融合方法
- 概率知识：概率密度，条件概率， 联合概率， 贝叶斯，贝叶斯推断，高斯概率密度函数，
- 状态估计模型：马尔可夫性
- 贝叶斯滤波： 高斯滤波（KF，EKF，IEKF），粒子滤波(PF, UKF)
- 编码器 & 编码器运动以及标定

### 基于图优化的建图
- 预积分, IMU惯性积分
- 图优化，
  - 核心思路是把融合方法从滤波换成图优化，其元素不再是简单的惯性解算，而是预积分；
  - 缺陷：随着时间的进行，图模型会越来越大，导致无法达到实时性。
- 边缘化，舒尔补


### 多传感器时空标定
- 内参标定
  - lidar：平面拟合
  - IMU ： 分立级/基于优化
  - 编码器： 运动模型+最小二乘
  - 相机： 张正友
- 外参标定
  - 有共视： lidar与camera:pnp & 多lidar：特征拟合
  - 无共视： 手眼标定 & 融合中标定
- 时间标定
  - 一般以IMU/组合导航时间为基准
  - 离散时间
  - 连续时间
- 融合中标定,众多vio/lio系统，如vins、lio-mapping、M-Loam 等