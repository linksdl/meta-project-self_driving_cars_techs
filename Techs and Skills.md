
## 自动驾驶技能学习
> For single skill or tech learning includes notes, docs and source code.
> 自动驾驶技能学习（C/C++，PCL，Ceres, G2o etc.）笔记，文档 和代码片段。


### L-SALAM 定位建图
- Docker, Ubuntu, ros, rviz, kitti数据集, evo（评估工具）
- 数学知识：矩阵，向量运算，概率&贝叶斯，李群&李代数，
- 定位传感器：Lidar, Camera, GPS, IMU, RTK, Encoder =
- 3D激光前端里程计
    - 点云采样
    - ICPs & NDT 
    - SVD分解 & 四元数 & 最小二乘法 & 凸优化算法（最速下降法，牛顿法，高斯牛顿法，LM）
    - LOAM, A-LOAM, F-LOAM, LEGO-LOAM, V-LOAM
    - LINS, LIO-SAM, LIO-mapping， FAST_LIO
    - LOAM_livox
    - cartographer
    - suma
    - seggmap
    - suma ++
- 运动畸变 & 畸变补偿
- 回环检测：ICP& NDT
- 后端优化：预积分，图优化，边缘化
- 建图：PCL, Ceres, Eigen, G2O 优化库
- 滤波器： 状态估计，KF，EKF，IEKF， UKF， PF等
- 惯性器件：误差分析，标定，
- 姿态表示：欧拉角、旋转矩阵、四元数，此外还有等效旋转矢量
- 传感器时空标定：内参，外参，时间标定。


### CenterNet
CenterNet 中心点的问题
- 中心点处的特征表示性不够
- 对于形变比较大的物体，例如拖挂车，转弯处的两节公交车