多传感器融合

> 学习使用卡尔曼滤波器融合激光雷达点云、雷达特征和相机图像，以随着时间的推移感知环境并检测和跟踪车辆和行人。

### **第 01 部分：** 欢迎来到纳米学位项目

### **第 02 部分：** 激光雷达障碍物检测

#### **第 01 课：** 激光雷达和点云简介

了解激光雷达和点云。使用模拟高速公路环境探索激光雷达传感并生成点云。

介绍：

在本课程中，我们将讨论传感器融合，这是从多个传感器获取数据并将其组合起来以让我们更好地了解周围世界的过程。我们将主要关注两个传感器，激光雷达和雷达。到最后，您将融合来自这两个传感器的数据来跟踪道路上的多辆汽车，估计它们的位置和速度。

在传感器融合中，通过将激光雷达的高分辨率成像与雷达测量物体速度的能力相结合，我们可以比单独使用其中一个传感器更好地了解周围环境。
不过，在开始将多个传感器信息融合在一起之前，您将首先完成从原始激光雷达数据中获取障碍物位置的过程。因此，首先让我们检查一下激光雷达传感器和它们生成的高分辨率点云。

###### 什么是激光雷达?

激光雷达传感通过发送数千个激光信号为我们提供高分辨率数据。这些激光从物体上反弹，返回到传感器，然后我们可以通过计算信号返回所需的时间来确定物体的距离。我们还可以通过测量返回信号的强度来了解一些关于被击中的物体的信息。每条激光射线都在红外光谱中，并以许多不同的角度发出，通常在 360 度范围内。虽然激光雷达传感器为我们周围的世界提供了非常高精度的 3D 模型，但它们目前非常昂贵，一个标准单元的价格超过 60,000 美元。

* 激光雷达以不同的角度发射数千条激光。
* 激光被发射，被障碍物反射，然后被接收器检测到。
* 根据发射和接收激光之间的时间差，可以计算距离。
* 还接收激光强度值，可用于评估激光反射的物体的材料特性。

![Velodyne 激光雷达传感器，从左到右依次为 HDL 64、HDL 32、VLP 16。 传感器越大，分辨率越高。](http://127.0.0.1:8887/Part%2002-Module%2001-Lesson%2001_Introduction%20to%20Lidar%20and%20Point%20Clouds/img/lidar-velodyne.png)

Velodyne 激光雷达传感器，从左到右依次为 HDL 64、HDL 32、VLP 16。传感器越大，分辨率越高。

###### 激光雷达原理图

以下是 HDL 64 激光雷达的规格。激光雷达有 64 层，其中每一层都以与 z 轴不同的角度发出，因此倾斜度不同。每层覆盖 360 度视图，角分辨率为 0.08 度。激光雷达平均每秒扫描十次。激光雷达可以识别最远 120M 的汽车和树叶物体，并且可以感应最远 50M 的路面。

![VLP 64 示意图，显示激光雷达发射器、接收器和外壳。](http://127.0.0.1:8887/Part%2002-Module%2001-Lesson%2001_Introduction%20to%20Lidar%20and%20Point%20Clouds/img/hdl-64e.png)

VLP 64 示意图，显示激光雷达发射器、接收器和外壳。

![VLP 传感器规格](http://127.0.0.1:8887/Part%2002-Module%2001-Lesson%2001_Introduction%20to%20Lidar%20and%20Point%20Clouds/img/vlp-sensor-specs.png)

VLP 传感器规格

###### 什么是点云?

激光打到物体表面得到的点

###### 点云数据

让我们深入了解激光雷达数据的存储方式。激光雷达数据以称为点云数据（简称 PCD）的格式存储。.pcd 文件是 (x,y,z) 笛卡尔坐标和强度值的列表，它是环境的单个快照，因此在单次扫描之后。这意味着对于 VLP 64 激光雷达，一个 pcd 文件将具有大约 256,000 (x,y,z,i) 个值。

一个城市街区的 PCD，有停放的汽车和一辆路过的货车。强度值显示为不同的颜色。大黑点是装有激光雷达传感器的汽车所在的位置。

###### PCD坐标系

点云数据的坐标系与汽车的局部坐标系相同。在这个坐标系中，x 轴指向汽车的前方，y 轴指向汽车的左侧。此外，由于此坐标系是右手坐标系，因此 z 轴指向汽车上方。

![PCD坐标系](http://127.0.0.1:8887/Part%2002-Module%2001-Lesson%2001_Introduction%20to%20Lidar%20and%20Point%20Clouds/img/pcd-coordinates.png)

PCD坐标系

在使用 VLP 64 扫描时，来自顶层的激光信号需要 66.7 ns 才能发射和再次接收。激光从 X 轴倾斜 -24.8 度发射，并沿 X 轴水平传播。已知光速为 299792458 米/秒，该激光点 (X,Y,Z) 的坐标（以米为单位）是多少？

(9.08, 0, -4.19)

###### The PCL Library

![1681043602177](image/LearningNotes/1681043602177.png)

在本模块中，您将处理点云数据以查找障碍。所有代码都将在 C++ 环境中完成，因此熟悉 C++ 肯定会有所帮助。PCL 是一个用于处理点云的开源 C++ 库。您将使用它来可视化数据、渲染形状，并熟悉它的一些内置处理功能。可以[在此处](http://pointclouds.org/)找到 PCL 的一些文档。

![img](http://127.0.0.1:8887/Part%2002-Module%2001-Lesson%2001_Introduction%20to%20Lidar%20and%20Point%20Clouds/img/pcl-logo.png)

PCL 在机器人社区中广泛用于处理点云数据，并且有许多在线教程可以使用它。PCL 中有很多内置函数可以帮助检测障碍物。稍后将在本模块中使用的内置 PCL 函数是分段、提取和聚类。

###### 什么位置安装激光雷达?

###### The Starter Code Structure

All the code for doing lidar obstacle detection is contained in a GitHub repository. The classroom has workspace environments that already include all the dependencies for getting started right way. You can also clone the repo, and use the README to get started on your own machine as well. Here is the [link](https://github.com/udacity/SFND_Lidar_Obstacle_Detection)

You will mostly be working out of two main files, which are `environment.cpp` and `processPointClouds.cpp`. The `environment.cpp` file contains the `main` function and will generate the runnable executable. The `processPointClouds.cpp` file will contain all your function placeholders to process the pcd.

There are some other files worth mentioning, like `sensors/lidar.h`, which simulates lidar sensing and creates point cloud data. Also `render.cpp` and `render.h` which have functions for rendering objects onto the screen.

###### Code Structure

* Top-level CMakeLists.txt
* Readme
* src
  * render
  * box.h - this file has the struct definitions for box objects
  * render.h
  * render.cpp - this file, along with the header, define the classes and methods for rendering objects.
  * sensors
  * data - this directory contains pcd data used in the course.
  * lidar.h - has functions using ray casting for creating pcd.
  * environment.cpp - the main file for using pcl viewer and processing and visualizing pcd.
  * processPointClouds.h
  * processPointClouds.cpp - Functions for filtering, segmenting, clustering, boxing, loading, and saving pcd.

###### Compilation Instructions

* In the terminal workspace below,  **make sure that GPU is enabled** .
* Click on `Desktop` button on lower right.
* Click on `Terminator` to load up work space desktop terminal.
* From the terminal, go to the project root directory, `cd /home/workspace/SFND-Lidar-Obstacle-Detection`.
* Create a new directory from the project root named `build` with the following command: `mkdir build`.
* Then go into the build directory: `cd build`.
* Run cmake pointing to the CMakeLists.txt in the root: `cmake ..`.
  If everything went well you should see something like

###### 运行模拟器

指示

构建可执行文件后，您可以通过执行 `./environment`.
现在您应该看到一个弹出窗口，看起来像上图。

在这里，您有一个简单的高速公路模拟器环境，绿色的自我汽车在中央车道（那是您的汽车），其他交通汽车为蓝色。一切都使用 PCL 以简单的方框、线条和颜色呈现。
您可以使用鼠标在您的环境中移动。尝试按住鼠标左键围绕场景旋转。您还可以通过按住鼠标中键并移动来在场景中平移。要缩放，请在移动时使用鼠标中键或鼠标右键。

回顾

* 在虚拟桌面中使用终结器，使用 ./environment 从构建目录运行可执行文件。
* 您应该会看到一个带有道路和汽车的 3D 弹出窗口。
* 您可以在环境中移动。
* 缩放：按住鼠标右键并向前/向后移动鼠标，或使用鼠标滚轮。
* 平移：按住鼠标中键（滚动条）并移动鼠标。
* 旋转：按住鼠标左键并移动鼠标。

![](http://127.0.0.1:8887/Part%2002-Module%2001-Lesson%2001_Introduction%20to%20Lidar%20and%20Point%20Clouds/img/environment.png)

###### PCL Viewer

![1681045698655](image/LearningNotes/1681045698655.png)

###### 添加激光雷达

您要做的第一件事是创建一个激光雷达对象。`src/sensors/lidar.h`激光雷达对象由包含在 environment.cpp 顶部的头文件定义。同样在 `environment.cpp`函数中，它采用前面讨论的 `simpleHighway`PCL 可视化器的参考参数。`viewer`

练习说明

`Lidar`您将在函数中实例化一个指向对象的指针 `simpleHighway`。
您应该 `Lidar`使用关键字在堆上创建指针对象 `new`。
构造 `Lidar`函数有两个参数：汽车和地面的坡度——这些参数对于建模射线碰撞是必需的。该 `Lidar`对象应以 0 的斜率创建。

笔记

激光雷达参数对于建模射线碰撞是必需的。
激光雷达对象将保存可能非常大的点云数据。通过在堆上初始化，我们可以使用比堆栈上的 2MB 更多的内存。但是，在堆上查找对象需要更长的时间，而堆栈查找非常快。

###### 激光雷达传感

要进一步处理新创建的 `Lidar`对象，请查看 `src/sensors/lidar.h`所有内容是如何定义的。在这个头文件中，您可以看到正在定义的射线对象。激光雷达将使用这些射线通过射线投射来感知周围环境。激光雷达结构的功能 `scan`将是进行光线投射的功能。

现在让我们调用激光雷达扫描函数，看看激光雷达射线的样子。回到您的环境文件，在调用激光雷达构造函数之后，您可以使用扫描函数，然后渲染激光雷达射线。

![1681046242451](image/LearningNotes/1681046242451.png)

模拟激光雷达射线

![激光雷达传感](http://127.0.0.1:8887/Part%2002-Module%2001-Lesson%2001_Introduction%20to%20Lidar%20and%20Point%20Clouds/img/rays.png)

###### 激光雷达对象使用说明

练习

* 要创建点云，请 `scan()`在激光雷达对象上调用激光雷达方法。
* 您将结果存储在 PointCloud 指针对象中，`pcl::PointCloud<pcl::PointXYZ>::Ptr`
* PointCloud 的点类型将为 `pcl::PointXYZ`.
* 使用生成的 PointCloud 指针调用 `renderRays`函数。

笔记

[带有模板](http://www.cplusplus.com/doc/oldtutorial/templates/)的 PointCloud 语法类似于向量或其他标准容器库的语法：`ContainerName<ObjectName>`.

PointCloud 中的 Ptr 类型表示该对象实际上是一个指针 - 一个 32 位整数，其中包含您的点云对象的内存地址。pcl 中的很多函数都使用点云指针作为参数，因此以这种形式返回 inputCloud 很方便。

renderRays 函数定义在 `src/render`. 它包含允许我们将点和形状呈现给 pcl 查看器的功能。您将使用它在查看器中将激光雷达射线渲染为线段。

renderRaysfunction 的参数是 viewer，它通过引用传入。这意味着在 renderRays 函数主体中对查看器的任何更改都会直接影响函数范围之外的查看器。激光雷达位置以及扫描函数生成的点云也被传入。PointCloud 的点类型将为 `pcl::PointXYZ`. 我们稍后会讨论其他一些不同类型的点云。

###### Templates and Different Point Cloud Data

![1681046925509](image/LearningNotes/1681046925509.png)

###### Overview of PCD types

**Why Use Templates?**

The lidar scan function used previously produced a pcl PointCloud object with pcl::PointXYZ points. The object uses a [template](http://www.cplusplus.com/doc/oldtutorial/templates/) because there are many different types of point clouds: some that are 3D, some that are 2D, some that include color and intensity. Here you are working with plain 3D point clouds so PointXYZ is used. However, later in the course you will have points with an intensity component as well.

Instead of defining two separate functions one with an argument for PointXYZ and the other for PointXYZI, templates can automate this process. With templates, you only have to write the function once and use the template like an argument to specify the point type.

**Templates and Pointers**

If you haven’t used templates with pointers before, you may have noticed in the code that `typename` is used whenever a pointer is used that depends on a template. For example in the function signature here:

```cpp
typename pcl::PointCloud<PointT>::Ptr ProcessPointClouds<PointT>::FilterCloud(typename pcl::PointCloud<PointT>::Ptr cloud, float filterRes, Eigen::Vector4f minPoint, Eigen::Vector4f maxPoint)
```

The reason for this is the following: Given a piece of code with a type name parameter, like `pcl::PointCloud<PointT>::Ptr`, the compiler is unable to determine if the code is a value or a type without knowing the value for the type name parameter. The compiler will assume that the code represents a value. If the code actually represents a typename, you will need to specify that.

Test your own intuition with the quiz below. You can use this [documentation](http://docs.pointclouds.org/1.8.1/classpcl_1_1_point_cloud.html#a86473dec40d705190c6b2c2f795b9f15) for help.

###### PCD 类型概述

**为什么使用模板？**

之前使用的激光雷达扫描函数生成了一个带有 pcl::PointXYZ 点的 pcl PointCloud 对象。该对象使用[模板，](http://www.cplusplus.com/doc/oldtutorial/templates/)因为有许多不同类型的点云：一些是 3D 的，一些是 2D 的，一些包括颜色和强度。此处您使用的是普通 3D 点云，因此使用了 PointXYZ。然而，在课程的后面，您也会有带有强度分量的点。

模板可以自动执行此过程，而不是定义两个单独的函数，一个带有 PointXYZ 的参数，另一个带有 PointXYZI 的参数。使用模板，您只需编写一次函数并将模板用作参数来指定点类型。

**模板和指针**

`typename`如果您以前没有使用过带指针的模板，您可能已经注意到在使用依赖于模板的指针时使用的代码。例如，在此处的函数签名中：

```cpp
typename pcl::PointCloud<PointT>::Ptr ProcessPointClouds<PointT>::FilterCloud(typename pcl::PointCloud<PointT>::Ptr cloud, float filterRes, Eigen::Vector4f minPoint, Eigen::Vector4f maxPoint)
```

原因如下：给定一段带有类型名称参数的代码，如 `pcl::PointCloud<PointT>::Ptr`，编译器无法在不知道类型名称参数值的情况下确定代码是值还是类型。编译器会假定代码表示一个值。如果代码实际上表示类型名称，则需要指定它。

用下面的测验测试你自己的直觉。您可以使用此[文档](http://docs.pointclouds.org/1.8.1/classpcl_1_1_point_cloud.html#a86473dec40d705190c6b2c2f795b9f15)寻求帮助。

###### 调整激光雷达参数

![1681047233298](image/LearningNotes/1681047233298.png)

**激光雷达参数**

您可以绕着场景旋转和移动以查看正在投射的不同光线。但是，当前的激光雷达设置将限制您的操作。分辨率很低，正如您从场景中看到的那样，只有一条光线接触到汽车。因此，您的下一个任务是提高激光雷达的分辨率，以便您可以清楚地看到周围的其他车辆。为此，请按照 lidar.h 中 TODO 语句的说明进行操作。

这些变化包括增加最小距离，这样您就不会包括与车顶的接触点，增加水平和垂直角度分辨率，最后，增加噪音。由于单位是米，因此您要添加的噪声实际上相当高，但它会在场景中产生更有趣和更真实的点数据。也可以完全自由地试验和使用这些激光雷达超参数！

练习

* 现在，您将通过增加垂直层数和围绕 z 轴的角分辨率来提高激光雷达分辨率。
  * `numLayers`应该从 3 变为 8。
  * `horizontalLayerIncrement`应该从 pi/6 变为 pi/64。
* 设置 `minDistance`为 5（米）以移除车辆车顶的点。
* 添加噪音，大约 0.2 以获得更有趣的 pcd。

完成练习后，您的输出应如下图所示。

增加激光雷达范围

Examining the Point Cloud

现在您可以看到激光雷达射线的样子，那么您将使用和处理的实际点云数据呢？可以使用 `renderPointCloud`render中的函数查看点云数据。您还可以选择关闭高速公路场景的渲染，这样您就可以看到点云本身的样子。

上图中的结果没有噪声，激光雷达 `minDistance`设置为零。使用高激光雷达 `minDistance`，您可以移除上面撞击汽车车顶的点，因为这些不会帮助您检测其他汽车。此外，一些噪声方差有助于创建更有趣的点云。此外，添加噪声将帮助您开发更强大的点处理功能。

**练习**

现在您将单独查看激光雷达的点云，没有射线。

* 为此，请在函数中 `renderPointCloud`调用而不是。`renderRays``simpleHighway`
* `renderScene`您还可以通过设置为 `false`in来无障碍地查看点云 `environment.cpp`。

完成后，您的输出应如下图所示。

模拟PCD

#### [ **第 02 课：** 点云分割](http://127.0.0.1:8887/Part%2002-Module%2001-Lesson%2002_Point%20Cloud%20Segmentation/index.html)

在本课中，您将使用带有平面模型的 Ransac 来分割点云数据，并将其分成属于道路的点和不属于道路的点。

##### Segmentation

我们希望能够定位场景中的障碍物。然而，我们场景中的一些物体并不是障碍物。出现在 pcd 中但不是障碍物的物体是什么？在大多数情况下，道路上的任何空闲空间都不是障碍物，如果道路平坦，从非道路点中挑选出道路点是相当简单的。为此，我们将使用一种称为平面分割的方法，该方法使用 **RANSAC（随机样本一致性）算法**。

##### 如何使用激光雷达检测环境中的物体?

点云分割

##### 创建点处理器

![1681129014146](image/LearningNotes/1681129014146.png)

您要做的第一件事是创建一个 `processPointClouds`对象。这是由 `src/processPointClouds.cpp`和 `src/processPointClouds.h`文件定义的。该对象将包含您将在此模块中用于处理激光雷达数据的所有方法。进程对象还有用于加载和保存 PCD 文件的辅助方法。当您完成此练习时，代码应该可以编译，但您仍需要完成接下来的几个概念才能获得结果。

指示

* 打开 `src/environment.cpp`文件。
* 在函数内部 `simpleHighway`，创建一个 `processPointClouds`对象。您可以在堆栈或堆上执行此操作。
* 处理器应使用点云类型的 `pcl::PointXYZ`.

##### Using PCL to segment Plane

![1681129177134](image/LearningNotes/1681129177134.png)

##### 使用 PCL 分割平面

在本练习中，您将把属于道路的点与属于场景的点分开。

SegmentPlane 函数存根

让我们现在使用点处理器。

`SegmentPlane`您将在 中定义函数 `src/processPointClouds.cpp`。该函数已经有声明，您只需要填写定义即可。在函数的顶部，您会注意到一个模板参数 `PointT`。您将使用它作为变量来表示任何类型的点云，稍后当您处理具有强度值的点云时它会派上用场。

SegmentPlane 函数签名

```cpp
 std::pair<typename pcl::PointCloud<PointT>::Ptr, typename pcl::PointCloud<PointT>::Ptr> SegmentPlane(typename pcl::PointCloud<PointT>::Ptr cloud, int maxIterations, float distanceThreshold);
```

该函数接受点云、最大迭代次数和距离公差作为参数。分段使用迭代过程。更多的迭代有可能返回更好的结果，但需要更长的时间。分割算法将平面与点相匹配，并使用距离公差来决定哪些点属于该平面。较大的公差包括平面中的更多点。

查看上面代码中的返回类型。`SegmentPlane`将返回一个 `std::pair`持有点云的指针类型。如果您不熟悉配对，请查看[此处的](http://www.cplusplus.com/reference/utility/pair/pair/)文档。您将使用 pair 对象来保存障碍物点云和道路点云的分割结果。这样，您稍后可以在 pcl 查看器中可视化两个点云并分析结果。

分段平面体

```cpp
// Time segmentation process
auto startTime = std::chrono::steady_clock::now();

// TODO:: Fill in the function to segment cloud into two parts, the drivable plane and obstacles

auto endTime = std::chrono::steady_clock::now();
auto elapsedTime = std::chrono::duration_cast<std::chrono::milliseconds>(endTime - startTime);
std::cout << "plane segmentation took " << elapsedTime.count() << " milliseconds" << std::endl;
```

在上面的代码中，您在函数存根中首先看到的 `SegmentPlane`是一个计时器。这对于测量运行该函数需要多长时间很有用。如果处理分割需要很长时间，那么在自动驾驶汽车上实时运行该功能就没有用了。

指示

要开始填写函数，您可以使用 pcl 的分段对象。[作为参考，请查看关于分段的](http://pointclouds.org/documentation/tutorials/extract_indices.php#extract-indices)pcl 教程。特别检查第 38-48 行。查看下面的演练以了解这些行的解释，并尝试在工作区中自己实现它们。

##### 分离点云

在前面的练习中，你得到了内点，它们是拟合平面的索引。现在您将使用这些内点来创建平面点云和障碍物点云

![1681129771170](image/LearningNotes/1681129771170.png)

指示

您可以通过调用 `SeparateClouds`函数来分离点云 `processPointCloud`。`SegmentPlane`您可以在计算出的内点和输入云中使用此函数。

在函数存根内部 `SeparateClouds`，创建两个新的点云指针，一个用于障碍物（非平面点），一个用于道路（平面点）。通过遍历内点索引并将相应的内点推入平面云的点向量，可以将内点添加到平面云中。

要生成障碍物云，使用 PCL 的一种方法是使用对象 `extract`，从输入云中减去平面云。现在您可以返回 `std::pair`新创建的障碍物和平面云：

```cpp
std::pair<typename pcl::PointCloud<PointT>::Ptr, typename pcl::PointCloud<PointT>::Ptr> segResult(obstCloud,planeCloud);
```

pcl 分割[教程](http://pointclouds.org/documentation/tutorials/extract_indices.php#extract-indices)在第 67-70 行展示了如何使用 `extract`对象。

回到 environment.cpp，然后您可以在输入云上调用 pointProcessor 函数，并以不同的颜色渲染两个分段的点云。

```cpp
std::pair<pcl::PointCloud<pcl::PointXYZ>::Ptr, pcl::PointCloud<pcl::PointXYZ>::Ptr> segmentCloud = pointProcessor->SegmentPlane(inputCloud, 100, 0.2);
renderPointCloud(viewer,segmentCloud.first,"obstCloud",Color(1,0,0));
renderPointCloud(viewer,segmentCloud.second,"planeCloud",Color(0,1,0));
```

笔记

上面的示例使用 100 次迭代，距离公差为 0.2 米。我们强烈鼓励您尝试这些价值观！这个点云非常简单，100 次迭代远远超过需要。您还可以使用函数预定义的计时器日志来监视更改迭代如何影响分段函数处理所需的时间。
在渲染这两个云之前，您需要记住关闭在上一课中完成的输入云的渲染，否则云将全部重叠，并且很难区分分段的云。renderPointCloud 函数包括颜色选项（红色、绿色、蓝色）。如果没有指定颜色，云默认为白色。此处障碍物云 as 呈现为红色，平面云呈现为绿色。

![分割和分离点云：道路点为绿色，其他障碍点为红色](http://127.0.0.1:8887/Part%2002-Module%2001-Lesson%2002_Point%20Cloud%20Segmentation/img/seg1.png)

分割和分离点云：道路点为绿色，其他障碍点为红色

##### RANSAC

RANSAC代表随机样本共识，是一种检测数据异常值的方法。RANSAC 运行最大迭代次数，并返回最适合的模型。每次迭代随机选择数据的子样本并通过它拟合模型，例如直线或平面。然后将具有最多内点数或最低噪声的迭代用作最佳模型。

![用于异常值线拟合的 RANSAC 算法](http://127.0.0.1:8887/Part%2002-Module%2001-Lesson%2002_Point%20Cloud%20Segmentation/img/ransac-linie-animiert.gif)

用于异常值线拟合的 RANSAC 算法

RANSAC概览

一种类型的 RANSAC 版本选择尽可能小的点子集来拟合。对于一条线，这将是两个点，对于一个平面，这将是三个点。然后通过遍历每个剩余点并计算其与模型的距离来计算内点数。距模型一定距离内的点被计为内点。具有最多内点数的迭代就是最好的模型。这将是您将在此测验中实现的版本。

RANSAC 的其他方法可以对模型点的一定百分比进行采样，例如总点的 20%，然后对其拟合一条线。然后计算那条线的误差，误差最低的迭代就是最好的模型。这种方法可能有一些优势，因为不需要考虑每次迭代的每个点。最好尝试不同的方法和时间结果，看看哪种方法最有效。

##### Implementing RANSAC for Lines

![1681130489395](image/LearningNotes/1681130489395.png)

在这里，您将完成一个测验，该测验让您实现 RANSAC 来拟合带有离群值的 2D 点数据中的一条线。测验位于 中 `src/quiz/ransac/ransac2d.cpp`，要填写的函数是 `Ransac`，它接受点云的参数、要运行的最大迭代次数和距离公差。点云实际上是 `pcl::PointXYZ`，但 z 分量将设置为零，以便在 2D 空间中更容易可视化。

下面显示的数据是通过创建一条点稍微分散的线生成的，然后通过在场景中随机放置点来添加异常值。您希望能够识别哪些点属于最初生成的线，哪些点是异常值。为此，您将从云中随机抽取两个点并在这些点之间拟合一条线。下面可以看到一个有用的线方程来解决这个问题。

![简单的二维点云数据](http://127.0.0.1:8887/Part%2002-Module%2001-Lesson%2002_Point%20Cloud%20Segmentation/img/ransac2d.png)

简单的二维点云数据

![1681130562004](image/LearningNotes/1681130562004.png)

After fitting the line you can then iterate through all the points and determine if they are inliers by measuring how far away each point is from the line. You can do this for each iteration keeping track of which fitted line had the highest number of inliers. The line with the most inliers will be the best model. The equation for calculating distance between a point and line is shown below. For further details see, [https://brilliant.org/wiki/dot-product-distance-between-point-and-a-line/](https://brilliant.org/wiki/dot-product-distance-between-point-and-a-line/).

![1681130585850](image/LearningNotes/1681130585850.png)

Below are the results of doing RANSAC to fit a line from the data above. Inliers are green while outliers are red. The function had a max iteration count of 50 and a distance tolerance of 0.5. The max iteration size to run depends on the ratio of inliers to the total number of points. The more inliers our data contains the higher the probability of selecting inliers to fit the line to, and the fewer iterations you need to get a high probability of selecting a good model.

Point Data Segmented

![Fitted Line using RANSAC](http://127.0.0.1:8887/Part%2002-Module%2001-Lesson%2002_Point%20Cloud%20Segmentation/img/ransac2dfitted.png)

Fitted Line using RANSAC

Instructions

* Go to `src/quiz/ransac/ransac2d.cpp`
* Complete the function `Ransac` following the instructions above

Compile/Run

* Go to `src/quiz/ransac`
* `mkdir build`
* `cd build`
* `cmake ..`
* `make`
* `./quizRansac`

##### Extending RANSAC to Planes

Extending RANSAC to Plane

Now that you are getting the hang of RANSACing it, and understanding RANSAC for fitting a line, you can do the same thing for fitting a plane in a 3D point cloud. ***Your implementation will be used as part of your project, so be sure to complete the implementation in the exercise below!***

If you have completed the previous exercise, you can modify your code by using the equation for a plane using three points, and the distance formula for a point to a plane.

![1681133882224](image/LearningNotes/1681133882224.png)

![1681133894074](image/LearningNotes/1681133894074.png)

Instructions

* In the workspace below, change line 99, to use `CreateData3D`
* Once Ransac plane fitting is working well, copy the code and extend it to `pointProcessor`, `Segment` function

```
/ Create data
pcl::PointCloud<pcl::PointXYZ>::Ptr cloud = CreateData3D();
```

* Modify the `Ransac` function or create a new `RansacPlane` function and use the same implementation as before but now with Plane and Point formulas.

#### [ **第 03 课：** 聚类障碍](http://127.0.0.1:8887/Part%2002-Module%2001-Lesson%2003_Clustering%20Obstacles/index.html)

执行欧几里德聚类，并学习如何构建 KD 树以使用它们进行高效的最近邻搜索以进行聚类。

##### What is Clustering?

##### Clustering Obstacles

![1681216981226](image/LearningNotes/1681216981226.png)

集群概述

您有办法分割点并识别哪些点代表您的汽车的障碍。将这些障碍点分解和分组会很棒，尤其是如果您想对**汽车、行人和骑自行车**的人进行多目标跟踪时。对点云数据进行分组和聚类的一种方法称为**欧氏聚类**。

欧氏聚类

这个想法是你通过它们之间的接近程度来关联点组。为了有效地进行最近邻搜索，您可以使用 KD-Tree 数据结构，平均而言，它可以将查找时间从 O(n) 加速到 O(log(n))。这是因为树可以让您更好地分解搜索空间。通过将点分组到 KD 树中的区域，您可以避免计算可能数千个点的距离，因为您知道它们甚至没有被考虑在足够近的区域中。

在本课中，您将首先了解如何使用内置 PCL 函数进行欧氏聚类。接下来，您将使用 KD 树编写自己的聚类算法。***您的实施将在您的项目提交中使用，因此请务必在接下来的练习中完成实施！***

##### 使用 PCL 的欧几里德聚类

![1681217070533](image/LearningNotes/1681217070533.png)

Inside `pointProcessor`, the `Clustering` function is located right under the `SegmentPlane` function that you previously were working on.

PCL provides some documentation for using its built in [euclidean clustering](http://pointclouds.org/documentation/tutorials/cluster_extraction.php) functions. In particular check out lines 71-82.

##### Euclidean Clustering Arguments

The euclidean clustering object `ec` takes in a distance tolerance. Any points within that distance will be grouped together. It also has min and max arguments for the number of points to represent as clusters. The idea is: if a cluster is really small, it’s probably just noise and we are not concerned with it. Also a max number of points allows us to better break up very large clusters. If a cluster is very large it might just be that many other clusters are overlapping, and a max tolerance can help us better resolve the object detections. The last argument to the euclidean cluster object is the Kd-Tree. The tree is created and built using the input cloud points, which in this case are going to be the obstacle cloud points.

Back in environment.cpp let's see how to render the different clusters.

```cpp
std::vector<pcl::PointCloud<pcl::PointXYZ>::Ptr> cloudClusters = pointProcessor->Clustering(segmentCloud.first, 1.0, 3, 30);

int clusterId = 0;
std::vector<Color> colors = {Color(1,0,0), Color(0,1,0), Color(0,0,1)};

for(pcl::PointCloud<pcl::PointXYZ>::Ptr cluster : cloudClusters)
{
      std::cout << "cluster size ";
      pointProcessor->numPoints(cluster);
      renderPointCloud(viewer,cluster,"obstCloud"+std::to_string(clusterId),colors[clusterId]);
      ++clusterId;
}
```

In the code above, the `Clustering` method is called and then there is a loop to iterate through each cluster and call `renderPointCloud` on each cluster. The renderPointCloud is expecting each pcl viewer point cloud to have a unique identifier, so clusters are counted with `clusterId` and appended to the `obstCloud` string.
To get different colors for each of the clusters, a list of colors is defined. Here we simply use red, blue and green.

As a bonus the number of points for each cluster is logged. This can be a helpful debugging tool later when trying to pick good min and max point values.

In this example the min points for a cluster are set to 3, and the max set to 30. The distance tolerance is also set to 1. Some time and effort will be needed to pick good hyperparameters, but many cases actually there won't be a perfect combination to always get perfect results.

在 中 `pointProcessor`，该 `Clustering`函数位于 `SegmentPlane`您之前使用的函数的正下方。

PCL 提供了一些使用其内置[欧氏聚类](http://pointclouds.org/documentation/tutorials/cluster_extraction.php)函数的文档。特别检查第 71-82 行。

##### 欧几里得聚类参数

欧几里德聚类对象 `ec`采用距离公差。该距离内的任何点都将组合在一起。它还具有表示为簇的点数的最小和最大参数。这个想法是：如果一个集群真的很小，它可能只是噪音，我们不关心它。此外，最大点数允许我们更好地分解非常大的集群。如果一个集群非常大，可能只是许多其他集群重叠，最大容差可以帮助我们更好地解决对象检测问题。欧氏簇对象的最后一个参数是 Kd-Tree。使用输入云点创建和构建树，在本例中将成为障碍物云点。

回到 environment.cpp 让我们看看如何渲染不同的集群。

```cpp
std::vector<pcl::PointCloud<pcl::PointXYZ>::Ptr> cloudClusters = pointProcessor->Clustering(segmentCloud.first, 1.0, 3, 30);

int clusterId = 0;
std::vector<Color> colors = {Color(1,0,0), Color(0,1,0), Color(0,0,1)};

for(pcl::PointCloud<pcl::PointXYZ>::Ptr cluster : cloudClusters)
{
      std::cout << "cluster size ";
      pointProcessor->numPoints(cluster);
      renderPointCloud(viewer,cluster,"obstCloud"+std::to_string(clusterId),colors[clusterId]);
      ++clusterId;
}
```

在上面的代码中，`Clustering`调用了该方法，然后有一个循环遍历每个集群并调用 `renderPointCloud`每个集群。renderPointCloud 期望每个 pcl 查看器点云都有一个唯一的标识符，因此集群被计算并附 `clusterId`加到 `obstCloud`字符串。
要为每个集群获得不同的颜色，定义了一个颜色列表。这里我们简单地使用红色、蓝色和绿色。

作为奖励，记录了每个集群的点数。稍后尝试选择好的最小和最大点值时，这可能是一个有用的调试工具。

在此示例中，集群的最小点设置为 3，最大值设置为 30。距离公差也设置为 1。选择好的超参数需要一些时间和精力，但实际上很多情况下不会是一个完美的组合，总能得到完美的结果。

##### 聚类结果

![集群以不同颜色显示，红色、绿色和蓝色。](http://127.0.0.1:8887/Part%2002-Module%2001-Lesson%2003_Clustering%20Obstacles/img/clusters1.png)

集群以不同颜色显示，红色、绿色和蓝色。

指示

* `pointProcessor`使用上面的 pcl 文档指南中定义功能集群以供参考。
* 为聚类算法试验不同的超参数。
* `environment.cpp`使用上面的代码示例渲染不同的集群。

##### Implementing KD-Tree

![1681217801501](image/LearningNotes/1681217801501.png)

A KD-Tree is a binary tree that splits points between alternating axes. By separating space by splitting regions, nearest neighbor search can be made much faster when using an algorithm like euclidean clustering. In this quiz you will be looking at a 2D example, so the the tree will be a 2D-Tree. In the first part of the quiz you will be working from `src/quiz/cluster/kdtree.h` and filling in the function `insert` which takes a 2D point represented by a vector containing two floats, and a point ID. The ID is a way to uniquely identify points and a way to tell which index the point is referenced from on the overall point cloud. To complete the `insert` function let's first talk about how a KD-Tree splits information.

##### Inserting Points into the Tree

![2D points to cluster](http://127.0.0.1:8887/Part%2002-Module%2001-Lesson%2003_Clustering%20Obstacles/img/2dpoints.png)

##### Building KD-Tree

The image above shows what the 2D points look like. In this simple example there are only 11 points, and there are three clusters where points are in close proximity to each other. You will be finding these clusters later.

In `src/quiz/cluster/cluster.cpp` there is a function for rendering the tree after points have been inserted into it. The image below shows line separations, with blue lines splitting x regions and red lines splitting y regions. The image shows what the tree looks like after all 11 points have been inserted, and you will be writing the code to do this over the next concepts.

##### Built KD-Tree

![Tree separating x and y regions.](http://127.0.0.1:8887/Part%2002-Module%2001-Lesson%2003_Clustering%20Obstacles/img/kdtree.png)

Tree separating x and y regions.

##### 将点插入 KD-Tree

##### Inserting Points Into KD-Tree Solution

##### Improving the Tree

![1681219045964](image/LearningNotes/1681219045964.png)

##### Improving the Tree

Having a balanced tree that evenly splits regions improves the search time for finding points later. To improve the tree, insert points that alternate between splitting the x region and the y region evenly. To do this pick the median of sorted x and y points. For instance if you are inserting the first four points that we used above (-6.3, 8.4), (-6.2, 7), (-5.2, 7.1), (-5.7, 6.3) we would first insert (-5.2,7.1) since it is the median along the x axis. If there is an even number of elements the lower median is chosen. The next point to be inserted would be (-6.2, 7), the median of the three points for y. This would be followed by (-5.7,6.3) the lower median between the two for x, and then finally (-6.3,8.4). This ordering will allow the tree to more evenly split the region space and improve search time later.

##### 插入点

![1681219126055](image/LearningNotes/1681219126055.png)

插入点

前面的概念展示了如何将点插入到树中。用 C++ 做这个怎么样？实现递归辅助函数来插入点可能是更新节点的一种非常好的方法。基本思想是遍历树，直到它到达的节点为 NULL，在这种情况下，将创建一个新节点并替换 NULL 节点。对于分配节点，一种方法是使用双指针。您可以传入一个指向该节点的指针，从根开始，然后当您想要替换一个节点时，您可以取消引用双指针并将其分配给新创建的节点。实现此目的的另一种方法是也使用指针引用。作为参考，请查看下面的代码以在 C++ 中使用二叉树进行插入。KD-Tree 的插入与此非常相似。

二叉树的插入示例

双指针

```cpp
void insert(BinaryTreeNode **node, int data)
   {
      if(*node == NULL)
      {
        *node = getNewNode(data);
      }
      else if(data < (*node)->data)
      {
        insert(&(*node)->left, data);
      }
      else
      {
        insert(&(*node)->right, data);
      }
   }
```

指针参考

```cpp
void insert(BinaryTreeNode *&node, int data)
   {
      if(node == NULL)
      {
        node = getNewNode(data);
      }
      else if(data < node->data)
      {
        insert(node->left, data);
      }
      else
      {
        insert(node->right, data);
      }
   }
```

指示

查看测验并尝试从之前的概念中获取结果图像，直观地显示每个点如何分隔 x/y 区域。

* 在 `src/quiz/cluster/kdtree.h`填写 `insert`功能。

编译/运行

* 在 `src/quiz/cluster`,`mkdir build`
* `cd build`
* `cmake ..`
* `make`
* `./quizCluster`

![1681219363677](image/LearningNotes/1681219363677.png)

##### Searching Points in KD-Tree

Once points are able to be inserted into the tree, the next step is being able to search for nearby points inside the tree compared to a given target point. Points within a distance of `distanceTol` are considered to be nearby. The KD-Tree is able to split regions and allows certain regions to be completely ruled out, speeding up the process of finding nearby neighbors.

The naive approach of finding nearby neighbors is to go through every single point in the tree and compare their distances with the target, selecting point indices that fall within the distance tolerance of the target. Instead with the KD-Tree you can compare distance within a boxed square that is 2 x `distanceTol` for length, centered around the target point. If the current node point is within this box then you can directly calculate the distance and see if the point id should be added to the list of nearby ids. Then you see if your box crosses over the node division region and if it does compare that next node. You do this recursively, with the advantage being that if the box region is not inside some division region you completely skip that branch.

Instructions

* In `src/quiz/cluster/kdtree.h` fill in the `search` function.
* Verify that when the code is run, line 115 of `cluster.cpp` produces the following output:

```
Test Search
0,1,2,3,
```

* Experiment by using different point values in the call to `search` in line 115 of `cluster.cpp`. Use target points that are close to points in the tree. If the distance tolerance is large enough then those expected nearby point ids should be returned.

Compile/Run

* In `src/quiz/cluster`, `mkdir build`
* `cd build`
* `cmake ..`
* `make`
* `./quizCluster`

##### 欧氏聚类

![1681220422746](image/LearningNotes/1681220422746.png)

使用 KD 树聚类

一旦实现了用于搜索附近点的 KD-Tree 方法，就很容易实现欧几里德聚类方法，该方法根据它们的接近度对各个聚类索引进行分组。里面 `cluster.cpp`有一个调用的函数 `euclideanCluster`，它返回一个向量整数向量，这是集群索引列表。

要执行聚类，遍历云中的每个点并跟踪哪些点已被处理。`search`对于每个点，将其添加到定义为聚类的点列表中，然后使用上一个练习中的函数获取与该点非常接近的所有点的列表。对于每个尚未处理的非常接近的点，将其添加到集群中并重复调用接近点的过程。一旦第一个集群的递归停止，创建一个新集群并在点列表中移动，对新集群重复上述过程。处理完所有点后，将找到一定数量的聚类，并以聚类列表的形式返回。

伪代码

```python
Proximity(point,cluster):
    mark point as processed
    add point to cluster
    nearby points = tree(point)
    Iterate through each nearby point
        If point has not been processed
            Proximity(cluster)

EuclideanCluster():
    list of clusters 
    Iterate through each point
        If point has not been processed
            Create cluster
            Proximity(point, cluster)
            cluster add clusters
    return clusters
```

`EuclideanCluster`在第 123 行调用 `cluster.cpp`：

```
std::vector<std::vector<int>> clusters = euclideanCluster(points, tree, 3.0);
```

下图显示了预期的输出结果。

欧氏星团

![附近的三个星团中的每一个都有不同的颜色，红色、蓝色和绿色。](http://127.0.0.1:8887/Part%2002-Module%2001-Lesson%2003_Clustering%20Obstacles/img/clusterkdtree.png)
附近的三个星团中的每一个都有不同的颜色，红色、蓝色和绿色。

指示

指示

* 在 `src/quiz/cluster/cluster.cpp`填写 `euclideanCluster`功能。
* 一旦该方法适用于 2D 点示例，请尝试通过执行相同的逻辑但包括额外的第三维来将其扩展为适用于 3D 点云。

编译/运行

* 在 `src/quiz/cluster`,`mkdir build`
* `cd build`
* `cmake ..`
* `make`
* `./quizCluster`

##### Bounding Boxes

##### Bounding Boxes Best Way To Track Objects In Point Cloud

##### Extra Challenge: PCA Boxes

Some comments from the previous concept about the way bounding boxes are calculated. That method of generating bounding boxes the boxes are always oriented along the X and Y axis. This is ok if the cluster that you are looking at has its majority of points orientated along these axes , but what if the cluster was a very long rectangular object at a 45 degree angle to the X axis. The resulting bounding box would be a unnecessarily large, and would constrain your car's available space to move around. See the image below for reference.

![PCA fitted box](http://127.0.0.1:8887/Part%2002-Module%2001-Lesson%2003_Clustering%20Obstacles/img/boxexample2.png)

PCA Discussion

In the above image, the bounding box on the right is more efficient, containing all the points with the minimum area required. It would be nice to take into account box rotation in the XY plane, about the Z axis. Rotation about the X or Y axes would yield weird results, since the car in the majority of situations is not concerned with the Z dimension, or has any control over Z movement.

The file containing the box struct is located in `src/render/box.h` and contains an additional struct called `BoxQ`. This struct has a quaternion member that allows rotations. Also there is an additional `renderBox` function in render.cpp that takes a BoxQ argument and renders the rotational box. There is a blog post about fitting the smallest possible 3D box around a 3D point cloud [here](http://codextechnicanum.blogspot.com/2015/04/find-minimum-oriented-bounding-box-of.html). The solution in the post uses [PCA](https://en.wikipedia.org/wiki/Principal_component_analysis), principal component analysis and includes Z axis rotations as well. A challenge problem is then to find the smallest fitting box but which is oriented flat with the XY plane.

#### [ **第 04 课：** 使用真实 PCD](http://127.0.0.1:8887/Part%2002-Module%2001-Lesson%2004_Working%20with%20Real%20PCD/index.html)

将您在前面的课程中学到的知识应用到视频中正在播放的真实 pcd 中。

##### 加载真实 PCD

在前面的课程中，您学习了如何分割和聚类简单的模拟点云。现在您将学习如何将这些相同的技能应用于来自自动驾驶汽车的实际点云数据。您还将学习如何执行其他过滤技术并创建管道以跨多个流式 pcd 文件执行障碍物检测。因此，让我们开始从自动驾驶汽车加载一些实际的点云数据。

##### 加载PCD

![1681221617342](image/LearningNotes/1681221617342.png)

![1681221657154](image/LearningNotes/1681221657154.png)

![从自动驾驶汽车加载 pcd。](http://127.0.0.1:8887/Part%2002-Module%2001-Lesson%2004_Working%20with%20Real%20PCD/img/pcd2.png)

要首先加载汽车记录的 pcd 文件之一，您需要创建一个新的点处理器，类似于我们之前在函数中创建的那个 `simpleHighway`。然而，这一次您将使用 pcl `PointXYZI`类型，“I”代表强度，现在它将成为云中每个点的附加特征。
在 `environment.cpp`你应该创建一个新的函数调用 `CityBlock`，它将与函数的布局相同 `simpleHighway`。的参数 `CityBlock`将与 相同 `simpleHighway`，是对 pcl 查看器的引用。
在新 `CityBlock`函数中，您将使用模板参数创建一个新的点处理器 `PointXYZI`。您将使用点处理器加载汽车的点云之一，然后使用 `renderPointCloud`功能来查看它。不要忘记现在而不是 `simpleHighway`在 `main`函数中调用 cityBlock。查看下面的代码以供参考。
汽车的所有 pcd 文件位于 `src/sensors/data/pcd/data_1/`

```cpp
void cityBlock(pcl::visualization::PCLVisualizer::Ptr& viewer)
{
  // ----------------------------------------------------
  // -----Open 3D viewer and display City Block     -----
  // ----------------------------------------------------

  ProcessPointClouds<pcl::PointXYZI>* pointProcessorI = new ProcessPointClouds<pcl::PointXYZI>();
  pcl::PointCloud<pcl::PointXYZI>::Ptr inputCloud = pointProcessorI->loadPcd("../src/sensors/data/pcd/data_1/0000000000.pcd");
  renderPointCloud(viewer,inputCloud,"inputCloud");
}
```

下图是加载和运行它的结果，如果 `renderPointCloud`函数参数中没有指定颜色，它将默认使用强度颜色编码。
环顾 pcd，你可以看到几辆汽车停在路边，一辆卡车驶过左侧的 ego 汽车。您的目标是在这些汽车和经过的卡车周围设置边界框，以便您的系统稍后可以在其路径规划器中使用该信息，尽量避免与这些障碍物发生任何碰撞。

##### 在现实世界中使用激光雷达时会出现哪些挑战

- 环境：大雨，停电，灰尘
- 反射问题

##### 你曾经对激光雷达数据进行下采样

- 很多数据
- 

##### 使用 PCL 过滤

![1681221890775](image/LearningNotes/1681221890775.png)

在查看之前加载的点云时，您可能会注意到的第一件事是它具有相当高的分辨率并且跨越了相当远的距离。您希望您的处理器管道能够尽快消化点云，因此您需要过滤云。以下是将用于执行此操作的两种方法。

体素网格

体素网格过滤将创建一个立方体网格，并通过只为每个体素立方体留下一个点来过滤点云，因此立方体长度越大，点云的分辨率越低。

![1681222075554](image/LearningNotes/1681222075554.png)

什么是体素

兴趣区

定义了一个带框的区域，并且该框外的任何点都被删除。

要应用这些方法，您将填写点处理函数 `FilterCloud`。此函数的参数将是您的输入云、体素网格大小和代表您感兴趣区域的最小/最大点。该函数将返回仅包含指定区域内的点的下采样云。要开始检查 PCL 的[体素网格过滤](http://pointclouds.org/documentation/tutorials/voxel_grid.php)和[感兴趣区域](http://docs.pointclouds.org/trunk/classpcl_1_1_crop_box.html)文档。

结果

要应用过滤功能，请使用加载的 pcd `cityBlock`调用 pointProcessor函数。`FilterCloud`

```cpp
// Experiment with the ? values and find what works best
filterCloud = pointProcessorI->FilterCloud(inputCloud, ? , Eigen::Vector4f (?, ?, ?, 1), Eigen::Vector4f ( ?, ?, ?, 1));
renderPointCloud(viewer,filterCloud,"filterCloud");
```

在下面的过滤器云图像中，您现在可以看到点分辨率比原始分辨率低得多，并且它裁剪了指定框点内的所有内容。试验和使用过滤器输入超参数很重要。体素大小应该足够大以帮助加快处理速度，但又不能大到对象定义完全丢失。要选择一个好的区域，请尝试在汽车前方留出足够的空间，以便它能够及时对向它移动的任何障碍物做出快速反应。同样对于两侧，请尝试至少覆盖道路的宽度。最重要的是我们要检测的障碍物在区域内。还可以设置摄像机角度 `environment.cpp`可以帮助选择一个好的兴趣区域。通过这种方式，您可以轻松地将相机设置为具有自上而下的概览或侧面概览。最后一件事是移除撞击自我汽车车顶的点将是有益的。您可以使用 pcl CropBox 找到屋顶点索引，然后将这些索引提供给 pcl ExtractIndices 对象以删除它们（类似于您的分割算法用于提取点的方法）。该 `renderBox`函数对于确定场景中的盒子看起来有多大也非常有用。

区域和体素网格过滤。

![区域和体素网格过滤。](http://127.0.0.1:8887/Part%2002-Module%2001-Lesson%2004_Working%20with%20Real%20PCD/img/filtered.png)

指示

* `FilterCloud`在函数中填写 `pointProcessor`
* 调用超 `FilterCloud`参数 `cityBlock`并进行实验
* （可选）删除自我车顶点
* 观察结果

##### 障碍物检测步骤

检测流水线概述

现在 pcd 已过滤，您已准备好部署我们在之前课程中应用的相同分割和聚类技术，现在使用内部的新强度点处理器 `cityBlock`。

步骤 1. 将过滤后的云分割成道路和障碍物两部分。

过滤点云后，下一步是对其进行分割。下图显示了过滤后的点云分割（绿色道路），（红色障碍物），点仅位于过滤后的感兴趣区域。该图像还显示了一个紫色框，其中显示了汽车车顶点所在的空间，并已将其移除。

![分段点云。 紫色框显示了自我车顶点被移除的位置。](http://127.0.0.1:8887/Part%2002-Module%2001-Lesson%2004_Working%20with%20Real%20PCD/img/seg2.png)

步骤 2. 聚类障碍物云。

接下来，根据相邻点的接近程度对障碍物云进行聚类。下图以红色、黄色和蓝色的循环颜色显示了星团。在该图像中，我们看到迎面而来的卡车实际上分成两种颜色，正面和背面。这说明了基于接近度的聚类的挑战，卡车前部和卡车后部之间的间隙足够大，以至于它们看起来是分开的。您可能会考虑通过增加距离容差来解决此问题，但您也可以看到卡车非常接近其中一辆停在侧面的汽车。增加距离容差会冒卡车和停放的汽车被组合在一起的风险。

聚类点云。不同的簇以循环颜色、红色、黄色和蓝色显示。

![聚类点云。 不同的簇以循环颜色、红色、黄色和蓝色显示。](http://127.0.0.1:8887/Part%2002-Module%2001-Lesson%2004_Working%20with%20Real%20PCD/img/cluster2.png)

第 3 步。找到集群的边界框

最后，您在各个集群周围放置边界框。由于该场景中所有可检测到的车辆都与我们的汽车位于同一轴上，因此点处理器中已经设置的简单边界框功能应该会产生良好的结果。



边界框

惊人的！恭喜您在真实的 pcd 文件上完成了点处理管道。一旦您对单帧的结果感到满意，让我们看看处理帧流。



##### Streamed PCD

![Playing back the pcd files.](http://127.0.0.1:8887/Part%2002-Module%2001-Lesson%2004_Working%20with%20Real%20PCD/img/pcdstream.gif)

Playing back the pcd files.


Stream PCD with PCL

In the previous concept you were able to process obstacle detections on a single pcd file, now you are going to be using that same processing pipeline on multiple pcd files. To do this you can slightly modify the previous used `cityBlock` function from `environment.cpp` to support some additional arguments. Now, you will be passing in the point processor to the `cityBlock` function, this is because you don't want to have to recreate this object at every frame. Also the point cloud input will vary from frame to frame, so input point cloud will now become an input argument for `cityBlock`. The `cityBlock` function header should now look like this, and you no longer create the point processor or load a point cloud from inside the function.

cityBlock new Function Signature

```cpp
void cityBlock(pcl::visualization::PCLVisualizer::Ptr& viewer, ProcessPointClouds<pcl::PointXYZI>* pointProcessorI, const pcl::PointCloud<pcl::PointXYZI>::Ptr& inputCloud)
```

Notice that in the function header you can optionally make `inputCloud` a constant reference by doing `const` and `&` at the end of the variable definition. You don't have to do this but you are not actually changing the `inputCloud` at all, just using it as an input for your point processor function. The benefit of using a constant reference is better memory efficiency, since you don't have to write to that variable's memory, just read from it, so it's a slight performance increase. If you do make this a const reference though, make sure not to modify it, or else you will get a compile error.

Code inside main

So now instead of creating your point processor, and loading pcl files from inside `cityBlock` you will do this inside the `main` function in `environment.cpp` right after where the pcl viewer camera position is set up.

```cpp
ProcessPointClouds<pcl::PointXYZI>* pointProcessorI = new ProcessPointClouds<pcl::PointXYZI>();
std::vector<boost::filesystem::path> stream = pointProcessorI->streamPcd("../src/sensors/data/pcd/data_1");
auto streamIterator = stream.begin();
pcl::PointCloud<pcl::PointXYZI>::Ptr inputCloudI;
```

In the code above, you are making use of a new method from point processor called, `streamPcd`. You tell `streamPcd` a folder directory that contains all the sequentially ordered pcd files you want to process, and it returns a chronologically ordered vector of all those file names, called `stream`. You can then go through the `stream` vector in a couple of ways, one option is to use an iterator. At the end of the above code block, a variable for the input point cloud is also set up.

PCL Viewer Update Loop

The final thing to look at is the pcl viewer run cycle which is down at the bottom of `envrionment.cpp`. while the pcl viewer hasn't stopped, you want to process a new frame, do obstacle detection on it, and then view the results. Let's see how to set up this pcl viewer run cycle method below.

```cpp
while (!viewer->wasStopped ())
{

  // Clear viewer
  viewer->removeAllPointClouds();
  viewer->removeAllShapes();

  // Load pcd and run obstacle detection process
  inputCloudI = pointProcessorI->loadPcd((*streamIterator).string());
  cityBlock(viewer, pointProcessorI, inputCloudI);

  streamIterator++;
  if(streamIterator == stream.end())
    streamIterator = stream.begin();

  viewer->spinOnce ();
}
```

The first thing the above method does is clear any previous rendered point clouds or shapes. Next it loads up your point cloud using your point processor and stream iterator. Then it calls your `cityBlock` function, and updates the iterator. If the iterator hits the end of the vector it simply sets it back to the beginning and that's it. The `viewer->spinOnce()` call controls the frame rate, by default it waits 1 time step, which would make it run as fast as possible. Depending on how timing efficient your obstacle detection functions were set up the faster the viewer's frame rate will be. If you want to check out the input pcd data at the fastest rate then run the code above and only run a single `renderPointCloud` on the input cloud inside `cityBlock`. Let's check out the results of the streaming pcd viewer below.


Streamed Obstacle Detection

![](http://127.0.0.1:8887/Part%2002-Module%2001-Lesson%2004_Working%20with%20Real%20PCD/img/pcdstreamdetection.gif)


Instructions

* Modify `environment.cpp` with the above changes
* Call `cityBlock` to perform obstacle detection on each frame


##### 激光雷达障碍物检测项目

项目详情

在本项目中，您将运用所学的所有知识来处理点云，并使用它来使用激光雷达检测狭窄街道上的汽车和卡车。检测管道应遵循涵盖的方法、过滤、分割、聚类和边界框。此外，应该使用上一课的参考指南从头开始创建分割和聚类方法。完成的结果将如下图所示，在道路上的所有障碍物周围放置边界框。

![激光雷达障碍物检测。](http://127.0.0.1:8887/Part%2002-Module%2001-Lesson%2004_Working%20with%20Real%20PCD/img/obstacledetectionfps.gif)



##### Tracking and Challenge Problem


关于跟踪的讨论

您已经完成了整个激光雷达障碍物检测过程。您能够流回多个 pcd 文件并执行过滤、分割、聚类和边界框检测。现在您能够检测单帧中的障碍物，您可以通过跟踪帧历史上的检测来使您的管道更加健壮。您可以在帧中的检测之间创建关联，并使用它来跟踪对象。

在两个不同帧之间创建关联的一种方法是通过两个检测彼此之间的接近程度以及它们看起来的相似程度。您还可以探索更多的过滤程序，例如在考虑连续帧之前查看在连续帧中看到的检测。您还可以根据边界框、它们的体积和形状进行过滤。通过部署跟踪方法和关联，您可以尝试动态构建障碍物的形状。这方面的例子可能是，也许你看到一辆长卡车的背面，激光雷达只会首先看到卡车的背面。然后你开车经过卡车。让激光雷达看到卡车的一侧。有很多方法可以继续探索并使检测过程更加稳健。



##### 挑战题：追踪骑在车前的骑车人。

![挑战题：追踪骑在车前的骑车人。](http://127.0.0.1:8887/Part%2002-Module%2001-Lesson%2004_Working%20with%20Real%20PCD/img/challengeset.gif)


##### Challenge PCD Set

挑战题

如果您准备好迎接额外的挑战，请查看 `src/sensors/data/pcd/data_2`您检测/跟踪骑在车前的自行车手以及检测/跟踪场景中其他周围障碍物的能力。


#### [ **第 05 课：** 激光雷达障碍物检测项目](http://127.0.0.1:8887/Part%2002-Module%2001-Lesson%2005_Lidar%20Obstacle%20Detection%20Project/index.html)



### **第 03 部分：** 雷达


#### 第 01 课：简介


在本课程中，我们将详细讨论雷达如何为自动驾驶汽车生成感知。从头开始，我们将从雷达的基本原理开始构建。我们将介绍信号传播和目标响应生成。然后我们将深入研究实时定位目标所需的距离多普勒生成。

我们将在 MATLAB 中编写代码以生成目标场景、创建 FMCW 波形，然后使用 FFT、CFAR 等处理技术创建距离多普勒图 (RDM)。对于项目的第二部分，我们将致力于基于 MATLAB 的驾驶场景模拟器来部署多目标跟踪和聚类并研究结果。

让我们开始吧！


在整个雷达课程中，您将从 Andrei Vatavu 那里了解有关雷达的观点。[Andrei 在MBRDNA](https://mbrdna.com/)开发传感器融合算法。在下一个视频中，Andrei 将向您介绍一些关于他自己和他在 MBRDNA 的角色。

##### MATLAB

![](http://127.0.0.1:8887/Part%2003-Module%2001-Lesson%2001_Introduction/img/matlab-1.png)


In this course, you will be using [MATLAB](https://www.mathworks.com/products/matlab.html) to complete all of the exercises and the projects locally on your computer. To get started, you can follow these steps:

1. If you do not already have a MathWorks account, create one [here](https://www.mathworks.com/mwaccount/register). Be sure to verify your email (check your Junk/Spam folders) before moving on to step 2.
2. Download the installer [here](https://www.mathworks.com/licensecenter/classroom/udacity_sf_radar/). This link also provides your MATLAB license to be used for the duration of the course.
3. Run the installer – it will guide you through the steps for your OS.

Some of the toolboxes included in the installation are not used in the course (e.g. Computer Vision and Image Processing toolboxes), but feel free to test them out if you like!



##### Using MATLAB

If you've never used MATLAB before, there is no need for concern - the language has an intuitive syntax, and you can try to pick up parts of the syntax as-needed while you go through the course. If you'd prefer to have a more formal introduction, there is a great series of tutorials provided by MathWorks, the creators of MATLAB. You can find the tutorials [here](https://www.mathworks.com/learn/tutorials/matlab-onramp.html).


#### [ **第 02 课：** 雷达原理](http://127.0.0.1:8887/Part%2003-Module%2001-Lesson%2002_Radar%20Principles/index.html)

查看雷达功能、FMCW 波形、雷达硬件、原理图和雷达方程
