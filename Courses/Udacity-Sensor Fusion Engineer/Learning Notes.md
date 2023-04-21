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

##### 为什么自动驾驶汽车专门用雷达

- 测量径向速度
- 不受环境影响
- 可以区分静态障碍物和动态障碍物

##### 雷达传感器FMCW

雷达自 1930 年代以来一直在使用，当时它们主要被军方用来探测飞机，但从那时起，雷达技术已经取得了长足的进步，如今它们越来越多地被用作高级驾驶员辅助系统 (ADAS) 的汽车雷达传感器。下图显示了雷达传感器如何与自动驾驶汽车中的全套其他传感器一起使用：

![1681737254424](image/LearningNotes/1681737254424.png)

![汽车空间中的雷达传感器 来源：cdn.rohde-schwarz.com](http://127.0.0.1:8887/Part%2003-Module%2001-Lesson%2002_Radar%20Principles/img/image21.png)

汽车领域的雷达传感器

##### RADAR 特性

- 射频技术和数字信号处理的进步使得以低成本和更小尺寸设计高效雷达成为可能。
- 雷达利用准确的速度和空间信息确定远距离目标的能力使其成为自动驾驶应用的重要传感器。
- 此外，它在黑暗和恶劣天气（雨、雾）条件下感知物体的能力也有助于它覆盖激光雷达或相机可能失败的领域。

##### 雷达如何探测物体

雷达使用电磁波的传输和检测工作，如下图所示：

![雷达操作<span data-type=](http://127.0.0.1:8887/Part%2003-Module%2001-Lesson%2002_Radar%20Principles/img/image16.png)\[来源：electricalelibrary\]" />

##### 雷达物理学

如果遇到障碍物，电磁波会被反射。如果这些反射波在它们的原点再次被接收到，那么这意味着在传播方向上有障碍物。

用于雷达的电磁能频率不受黑暗影响，也能穿透雾和云。这允许雷达系统确定由于距离、黑暗或天气而肉眼看不见的道路目标的位置。

现代雷达可以从目标的回波信号中提取比其范围更多的信息。

博世汽车雷达

![博世汽车雷达](http://127.0.0.1:8887/Part%2003-Module%2001-Lesson%2002_Radar%20Principles/img/image26.png)

汽车雷达是小型传感器，可以轻松安装在前格栅或保险杠下方。如上图所示，雷达模块由不同的部分组成。

* **雷达罩或雷达罩** ：*天线罩*是一种结构性、防风雨的外壳，可保护雷达天线。天线罩由对天线发射或接收的电磁信号衰减最小的材料构成，对无线电波有效透明。
* **雷达印刷电路板** ：这是模拟硬件，包括无线电波生成所需的雷达收发器和天线。
* **印刷电路板和处理** ：这包括数字信号处理 (DSP) 单元。

##### 雷达与激光雷达

![雷达和激光雷达的比较<span data-type=](http://127.0.0.1:8887/Part%2003-Module%2001-Lesson%2002_Radar%20Principles/img/image27.png)\[来源：cleantechnica\]" />

人们可以找到许多比较 LIDAR 和 RADAR 的文章，但实际上，这些传感器是相互补充的。

激光雷达可以根据目标对激光的反射生成高分辨率成像。但激光雷达在恶劣天气条件下会失效，因为非常小的波长无法在雾天或雨天正常工作。此外，激光雷达是一种昂贵的传感器，截至 2019 年，成本从 35,000 美元到 100,000 美元不等。激光雷达是 Waymo 的首选技术。

雷达缺乏生成高分辨率图像的能力，但它具有基于多普勒现象的高精度速度估计，我们将在本课程后面详细介绍。
此外，雷达波长也使其能够在恶劣天气条件下感知目标。最重要的是雷达的制造成本低。一个雷达单元的成本可能低至几百美元，允许汽车制造商部署多个雷达传感器以实现 360 度全方位感知。特斯拉依靠雷达作为其主要传感器，并没有将激光雷达纳入其传感器融合系统。

[了解 Delphi 如何](https://www.mathworks.com/company/user_stories/delphi-develops-radar-sensor-alignment-algorithm-for-automotive-active-safety-system.html) 使用 MATLAB 和代码生成来实现雷达安全系统

[ ] 对于低价汽车，汽车制造商更愿意安装雷达而不是激光雷达。

[ ] 雷达是一种更好的传感器，可以估算迎面而来的汽车到达自我车辆所需的时间

##### 信号属性

在这个概念中，您将看到信号属性的一般概述，包括信号波长的定义和信号方程的一般形式。

##### 单波参数

![1681737919004](image/LearningNotes/1681737919004.png)

![信号的波长<span data-type=](http://127.0.0.1:8887/Part%2003-Module%2001-Lesson%2002_Radar%20Principles/img/image.png)\[来源：techplayon\]" />

##### 频率、振幅

波的频率是每秒通过的波数，单位为赫兹 (Hz)  *。* 汽车雷达一般工作在W波段（76GHz-81GHz）。由于波长以毫米为单位，因此该频率的信号称为毫米波。

信号的带宽是连续频带中最高和最低频率分量之间的差异*。*

幅度*是*信号的强度。通常它对应于以 dB/dBm 定义的射频信号/电磁场的功率。它与配置雷达输出功率和感知接收信号有关。雷达信号的幅度越高，雷达的可见度就越高。汽车雷达可在最大 55 dBm 输出功率 (316 W) 下运行

[可以在此处](https://www.rapidtables.com/electric/dBm.html)找到 dB、dBm、mW 和 W 转换。

![信号的频率<span data-type=](http://127.0.0.1:8887/Part%2003-Module%2001-Lesson%2002_Radar%20Principles/img/image25.png)\[来源\]" />

![信号幅度<span data-type=](http://127.0.0.1:8887/Part%2003-Module%2001-Lesson%2002_Radar%20Principles/img/image1.png)\[来源\]" />

![1681738047971](image/LearningNotes/1681738047971.png)

![Phase of sinusoidal waveform

source : Wikipedia](http://127.0.0.1:8887/Part%2003-Module%2001-Lesson%2002_Radar%20Principles/img/image.png)

![正弦波形的相位来源：维基百科](http://127.0.0.1:8887/Part%2003-Module%2001-Lesson%2002_Radar%20Principles/img/image.png)

##### 阶段

两个周期信号的相位之差称为*相位差* *。*
当差值为零时，两个信号被称为同相，否则它们彼此异相。

当我们经历多普勒处理以及雷达的到达角技术时，相位信息处理很重要。

![信号的相位](http://127.0.0.1:8887/Part%2003-Module%2001-Lesson%2002_Radar%20Principles/img/image15.png)

##### General Equation of a Wave

![1681738211729](image/LearningNotes/1681738211729.png)

##### 调频连续波的特点

FMCW雷达（Frequency-Modulated Continuous Wave radar）是一种辐射连续发射功率的特殊雷达传感器。FMCW 雷达能够测量到目标的非常小的距离，并且能够同时测量目标距离及其相对速度，这使其成为汽车应用的首选雷达类型。

##### What is Chirp?

FMCW 波形

![FMCW波形来源：emagtech](http://127.0.0.1:8887/Part%2003-Module%2001-Lesson%2002_Radar%20Principles/img/image5.png)

![1681738402029](image/LearningNotes/1681738402029.png)

##### Further Research

Additional information can be found on radartutorial.eu [here](http://www.radartutorial.eu/02.basics/Frequency%20Modulated%20Continuous%20Wave%20Radar.en.html).

##### FMCW 硬件概述

![FMCW 雷达的硬件实现](http://127.0.0.1:8887/Part%2003-Module%2001-Lesson%2002_Radar%20Principles/img/image11.png)

 **频率合成器** ：*频率合成器*是产生频率的组件，在汽车雷达的情况下，将线性调频频率一直提高到 77GHz。

 **功率放大器** ：*功率放大器*放大信号，使信号可以到达很远的距离。由于信号在辐射时会衰减，因此需要更高的功率（幅度）才能到达更远距离的目标。

 **天线** ：*天线*将电能转换为电磁波，电磁波通过空气辐射，击中目标，然后反射回雷达接收天线。天线还通过将能量集中在所需方向来增加信号强度。此外，天线方向图决定了雷达的视野。

 **混频器** ：在 FMCW 雷达中，*混频器*将返回信号与频率合成器生成的扫描信号相乘。该操作用作频率减法以提供频率增量 - 也称为频移或中频 (IF)。IF = 合成器频率 - 返回信号频率。

 **处理器** ：*处理器*是所有数字信号处理、检测、跟踪、聚类和其他算法发生的处理单元。该单元可以是微控制器，甚至是 FPGA。

##### 天线细节

##### 天线特性

按照 FMCW 硬件定义中的定义，天线是一种将电能转换为电磁波的换能器。在雷达的情况下，这些波通过空气传播并击中目标。根据目标的表面类型和形状，波会部分反射回雷达方向。雷达的接收天线进一步放大接收到的信号，并将其发送到接收链进行进一步处理。

##### 天线模式

雷达天线方向图

![道路场景中的雷达照明 来源：sciencedirect.com](http://127.0.0.1:8887/Part%2003-Module%2001-Lesson%2002_Radar%20Principles/img/image24.png)

##### 天线方向图

天线*方向图*是天线发射的相对场强度的几何方向图。

*天线的波束宽度*决定了雷达传感器的视野。如果对雷达的要求只是检测其自己车道上的目标，则波束宽度需要足够小以覆盖整个车道，达到所需范围。如果波束宽度比车道宽度宽，它也会感应到其他车道上的目标。

![天线方向图](http://127.0.0.1:8887/Part%2003-Module%2001-Lesson%2002_Radar%20Principles/img/image2.png)

##### 天线旁瓣

天线辐射不仅包括主波束，还包括旁瓣。天线*旁瓣*很重要，因为它们会产生误报并从不需要的方向拾取干扰。从图中可以看出，天线的旁瓣指向不同的方向，可以感应到不在主波束中的目标。为避免旁瓣检测，将旁瓣电平抑制到距主波束峰值 30dB 以上至关重要。

##### 天线阵列

![贴片阵列天线\[[来源](https://www.fhr.fraunhofer.de/en/businessunits/traffic/antenna-development-for-the-automotive-sector.html)]](http://127.0.0.1:8887/Part%2003-Module%2001-Lesson%2002_Radar%20Principles/img/image14.png)

可以在 77GHz 下使用的天线类型有很多种（偶极子、贴片、喇叭），但汽车雷达中最常用的天线类型是贴片天线。贴片阵列天线的低成本、易于制造和薄型使其成为汽车雷达应用的理想选择。

* 远程雷达 (LRR) 使用更强的主波束（峰值输出功率）。
* 窄波束宽度用于覆盖较少的车道。

##### 雷达截面RCS

目标的大小和反射雷达能量的能力由一个术语定义，�σ，称为雷达截面，单位为 米2个米2个. 这个单位表示雷达截面积是一个区域。目标雷达截面积取决于：

* 目标的物理几何形状和外部特征：
  * 光滑的边缘或表面会向各个方向散射波，因此 RCS 较低。然而，尖角会将返回信号聚焦回源方向，从而导致更高的 RCS。（下图针对不同的目标几何形状）
* 照明雷达的方向，
* 雷达发射机的频率，
* 用于汽车、卡车、自行车的材料，甚至在某些情况下，用于行人的服装材料。

![目标车辆的RCS来源：https://arxiv.org/pdf/1607.02434.pdf](http://127.0.0.1:8887/Part%2003-Module%2001-Lesson%2002_Radar%20Principles/img/image13.png)

目标车辆的RCS

资料来源：[https ://arxiv.org/pdf/1607.02434.pdf](https://arxiv.org/pdf/1607.02434.pdf)

如果目标上的所有入射雷达能量在所有方向上均等反射，则雷达横截面将等于发射机看到的目标横截面面积。实际上，一些能量被吸收，反射能量在所有方向上的分布并不均匀。因此，雷达截面积很难估计，通常通过测量来确定。

##### 从不同的目标几何形状返回

![来自不同目标几何形状的回报来源：http://www.radartutorial.eu](http://127.0.0.1:8887/Part%2003-Module%2001-Lesson%2002_Radar%20Principles/img/image7.png)
从不同的目标几何形状返回资料来源： http: //www.radartutorial.eu

![1681739305344](image/LearningNotes/1681739305344.png)

![RCS of different targets

![1681739449015](image/LearningNotes/1681739449015.png)

source : http://www.radartutorial.eu](http://127.0.0.1:8887/Part%2003-Module%2001-Lesson%2002_Radar%20Principles/img/image12.png)

RCS of different targetssource : http://www.radartutorial.eu

![1681739393618](image/LearningNotes/1681739393618.png)

##### 是什么让隐形飞机不被雷达发现？

* 飞机的光滑表面
* 不反光漆
* 飞机的几何形状

##### 雷达距离方程

### 距离方程

使用雷达距离方程，我们可以设计雷达发射器、接收器和天线，使其具有所需的功率、增益和噪声性能，以满足距离要求。

设计用于覆盖 300 米范围并检测横截面较小的目标的远程雷达与设计用于检测类似目标的仅 50 米的短程雷达相比，需要更高的发射功率和更大的天线增益。与横截面较小的目标相比，横截面较大的目标可以在更远的距离内被检测到。

![雷达方程来源：http://www.radartutorial.eu](http://127.0.0.1:8887/Part%2003-Module%2001-Lesson%2002_Radar%20Principles/img/image9.png)

Radar Equation

source : [http://www.radartutorial.eu](http://www.radartutorial.eu/)

![1681739691125](image/LearningNotes/1681739691125.png)

![The image above shows the variation in the signal strength level as it travels through transmitter, over the air and at the receiver](http://127.0.0.1:8887/Part%2003-Module%2001-Lesson%2002_Radar%20Principles/img/image15.png)

上图显示了信号强度水平在通过发射器、空中和接收器时的变化

上图显示了信号强度水平的变化：

##### * 发射功率

* 功率放大器进一步提高信号强度 - 传输链增益
* 使用天线进一步放大信号
* 单向路径损耗表示信号强度在向目标传播时的损失
* 从目标反射后，信号根据目标的 RCS 被放大
* 在 RCS 获得信号后，信号传回雷达，强度损失与前进相似
* 接收器天线在将返回信号发送到处理单元之前将其放大

##### 范围方程测验

##### 哪些因素有助于远距离行人的成功检测？

* 更高的天线增益
* 更高的发射功率

##### 雷达探测

##### 信噪比

下图显示了雷达距离检测的输出。峰值对应于目标返回信号的强度，频率与范围相关。频率和范围之间的关系将在下一课讨论。

雷达无法检测到低于噪声水平的信号。噪声电平由接收器产生的热噪声决定。要成功检测到目标，返回信号强度需要大于噪声水平。*这是由称为信噪比*或 _SNR 的属性定义的。

SNR 是信号强度与噪声水平相比的定量测量。如果 SNR 太低，雷达就很难区分信号和噪声。因此，为了成功检测目标，需要更高的 SNR。通常，7-13 dB 的 SNR 可确保在道路场景中成功检测。

![信噪比](http://127.0.0.1:8887/Part%2003-Module%2001-Lesson%2002_Radar%20Principles/img/image10.png)

The image above shows the logarithmic value of SNR = power level (in dBm) - noise level (dBm). The plot shows the output of Range FFT (discussed in Lesson 2). In general, the higher the SNR value, the greater are the chances of successful Radar detection.

上图显示了 SNR = 功率电平（以 dBm 为单位）- 噪声电平（dBm）的对数值。该图显示了范围 FFT 的输出（在第 2 课中讨论）。一般来说，信噪比值越高，雷达探测成功的几率就越大。

##### Matlab Exercise: Maximum Range Calculation

The following MATLAB code provides some parameters which can be used in the range equation given above. Your task is to complete the TODOs in the following code:

1. Use the speed of light **c** to compute the wavelength **λ**.
2. Use the results from part 1. along with the range equation to compute the radar range.
3. Print the range to screen using `disp(range)`.

```matlab
%Operating frequency (Hz)
fc = 77.0e9;

%Transmitted power (W)
Pt = 3e-3;

%Antenna Gain (linear)
G =  10000;

%Minimum Detectable Power
Ps = 1e-10;

%RCS of a car
RCS = 100;

%Speed of light
c = 3*10^8;

%TODO: Calculate the wavelength


%TODO : Measure the Maximum Range a Radar can see. 
```

##### 传感器融合工程师需要了解的有关雷达的知识?

- 了解传感器的背景
- 必须深入了解传感器的细节及其局限性

#### [ **第 03 课：** 距离多普勒估计](http://127.0.0.1:8887/Part%2003-Module%2001-Lesson%2003_Range-Doppler%20Estimation/index.html)

使用 FMCW 雷达估计目标的距离和速度

##### 01. 距离、速度和角度分辨率

**=== Range/Doppler Estimation**

在本课中，您将学习使用**多普勒和傅里叶变换技术**估算距离和速度的基础知识。在开始之前，让我们看一下雷达分辨率的三个主要测量维度。

**距离、速度和角度分辨率**

![雷达根据距离、角度和速度的差异分辨两个目标的能力。](http://127.0.0.1:8887/Part%2003-Module%2001-Lesson%2003_Range-Doppler%20Estimation/img/image8.png)

雷达根据距离、角度和速度的差异分辨两个目标的能力。

![1681822898210](image/LearningNotes/1681822898210.png)

##### 解决目标

雷达分辨目标的能力对于准确感知非常关键。

 **距离分辨率** ：雷达区分距离非常接近的两个目标的能力。如果雷达的距离分辨率为 4 米，则它无法根据距离将站在距离汽车 1 米处的行人分开。

距离分辨率完全取决于线性调频信号的带宽乙秒�电子电子�乙扫一扫_ _ _的:

��电子秒=�2个乙秒�电子电子�d回复_ _的=2乙扫一扫_ _ _的C的

 **速度分辨率** ：如果两个目标具有相同的距离，如果它们以不同的速度行进，它们仍然可以被解析。速度分辨率取决于线性调频信号的数量。正如针对我们的案例所讨论的，我们选择发送 128 个线性调频信号。线性调频次数越多，速度分辨率越高，但处理信号所需的时间也越长。

 **角度分辨率** ：雷达能够在空间上分离两个目标。如果两个目标以相同的速度处于相似的距离，那么它们仍然可以根据它们在雷达坐标系中的角度来解决。角度分辨率取决于不同的参数，具体取决于所使用的角度估计技术。我们将在下一课中更详细地介绍这一点。

##### 对于密集的城市交通场景，FMCW 雷达有什么有用的功能？

更高的线性调频带宽

##### Range Estimation

![Signal trip time for a radar signal.](http://127.0.0.1:8887/Part%2003-Module%2001-Lesson%2003_Range-Doppler%20Estimation/img/image5.png)

Signal trip time for a radar signal.

##### 范围估计方程

雷达通过测量其辐射的电磁信号的跳闸时间来确定目标的范围。众所周知，EM 波以已知速度 (300,000,000 m/s) 传播，因此要确定雷达需要计算行程时间的范围。如何？

答：通过测量频率的偏移。

使用 FMCW 进行范围估计

![使用 FMCW 来源的范围估计：Delft University of Technology](http://127.0.0.1:8887/Part%2003-Module%2001-Lesson%2003_Range-Doppler%20Estimation/img/image3.png)

![1681823518343](image/LearningNotes/1681823518343.png)

##### 系统电平范围计算

![范围计算 - 系统级来源：electronicdesign.com](http://127.0.0.1:8887/Part%2003-Module%2001-Lesson%2003_Range-Doppler%20Estimation/img/image2.png)

![1681823618198](image/LearningNotes/1681823618198.png)

##### Range Estimation Exercise

Using the following MATLAB code sample, complete the TODOs to calculate the range in meters of four targets with respective measured beat frequencies [0 MHz, 1.1 MHz, 13 MHz, 24 MHz].

You can use the following parameter values:

* The radar maximum range = 300m
* The range resolution = 1m
* The speed of light c = 3*10^8

Note : The sweep time can be computed based on the time needed for the signal to travel the maximum range. In general, for an FMCW radar system, the sweep time should be at least 5 to 6 times the round trip time. This example uses a factor of 5.5:

��ℎ���=5.5⋅2⋅����/�**T**c**h**i**r**p=**5**.**5**⋅**2**⋅**R**m**a**x****/**c**

Print your answer using the `disp` function.

![1681823850878](image/LearningNotes/1681823850878.png)

##### 多普勒估计

![多普勒测速](http://127.0.0.1:8887/Part%2003-Module%2001-Lesson%2003_Range-Doppler%20Estimation/img/image19.png)

##### 多普勒估计理论

雷达的速度估计是基于一种古老的现象，称为多普勒效应。根据多普勒理论，接近的目标会将发射和反射的频率偏移得更高，而后退的目标会使这两个频率都偏移到低于发射频率。

同样的原理被用在雷达枪中以捕捉速度违规者，甚至在运动中用来测量球的速度。

![](http://127.0.0.1:8887/Part%2003-Module%2001-Lesson%2003_Range-Doppler%20Estimation/img/image18.png)

##### 什么是多普勒效应

FMCW 多普勒测量

![FMCW 多普勒估计来源：Delft University of Technology](http://127.0.0.1:8887/Part%2003-Module%2001-Lesson%2003_Range-Doppler%20Estimation/img/image8.png)

![1681824361398](image/LearningNotes/1681824361398.png)

![1681824450595](image/LearningNotes/1681824450595.png)

![](http://127.0.0.1:8887/Part%2003-Module%2001-Lesson%2003_Range-Doppler%20Estimation/img/image-1.png)

##### Doppler Estimation Exercises

Using the following MATLAB code sample, complete the TODOs to calculate thevelocity in m/s of four targets with following doppler frequency shifts: [3 KHz, 4.5 KHz, 11 KHz, -3 KHz].

You can use the following parameter values:

* The radar's operating frequency = 77 GHz
* The speed of light c = 3*10^8

Doppler Estimation Further Research

For additional resources related to doppler estimation, see these [lecture notes](http://www.phys.uconn.edu/~gibson/Notes/Section6_3/Sec6_3.htm).

##### 快速傅立叶变换 (FFT)

什么是快速傅立叶变换

![使用 FFT 的时域到频域转换。 资料来源：mriquestions.com](http://127.0.0.1:8887/Part%2003-Module%2001-Lesson%2003_Range-Doppler%20Estimation/img/image22.png)

使用 FFT 的时域到频域转换。

到目前为止，我们讨论了距离和多普勒估计的理论以及计算它们的方程式。但是，对于雷达以数字方式有效地处理这些测量，需要将信号从模拟域转换为数字域，并进一步从时域转换为频域。

ADC（模拟数字转换器）将模拟信号转换为数字信号。但是，在 ADC 之后，快速傅立叶变换用于将信号从时域转换为频域。转换到频域对于进行信号的频谱分析和确定由于范围和多普勒引起的频率偏移很重要。

行进信号在时域中。时域信号由多个频率分量组成，如上图所示。为了分离出所有频率分量，使用了 FFT 技术。

出于本课程的目的，我们不必深入研究 FFT 的数学细节。但是，了解 FFT 在雷达数字信号处理中的使用非常重要。它给出了返回信号的频率响应，频谱中的每个峰值代表检测到的目标的特性。

[在此处](https://www.youtube.com/watch?v=t_NMmqTRPIY&feature=youtu.be)了解有关 FFT 实施的更多信息。

##### FFT 和 FMCW

快速傅里叶变换

范围 FFT

如下图所示，范围 FFT 针对每个线性调频上的每个样本运行。由于每个线性调频脉冲被采样 N 次，它将生成 N *（线性调频脉冲数）的范围 FFT 块。这些 FFT 块也称为 FFT bin。

![Range FFT 来源：Delft University of Technology](http://127.0.0.1:8887/Part%2003-Module%2001-Lesson%2003_Range-Doppler%20Estimation/img/image1.png)

每个线性调频脉冲都被采样 N 次，并且对于每个样本，它都会产生一个范围箱。对每个线性调频重复该过程。因此创建 N*（线性调频数）的 FFT 块。

块的每一列中的每个 bin 代表增加的范围值，因此最后一个 bin 的末尾代表雷达的最大范围。

![MATLAB 中范围 FFT 的输出。 X 轴 = 拍频，Y 轴 = 以 dBm 为单位的信号功率](http://127.0.0.1:8887/Part%2003-Module%2001-Lesson%2003_Range-Doppler%20Estimation/img/image11.png)

MATLAB 中范围 FFT 的输出。
X 轴 = 拍频，
Y 轴 = 以 dBm 为单位的信号功率

##### Output of Range FFT

Above is the output of the 1st stage FFT (i.e Range FFT). The three peaks in the frequency domain corresponds to the beat frequencies of three different cars located at 150, 240 and 300 m range from the ego vehicle.

Fast Fourier Transform Exercise

##### Steps to Implement Range FFT

In the following exercise, you will use a Fourier transform to find the frequency components of a signal buried in noise. Specify the parameters of a signal with a sampling frequency of 1 kHz and a signal duration of 1.5 seconds.

To implement the 1st stage FFT, you can use the following steps:

1. Define a signal. In this case (amplitude = A, frequency = f)

```
signal = A*cos(2*pi*f*t)
```

2. Run the fft for the signal using MATLAB fft function for dimension of samples N.

```
signal_fft = fft(signal,N);
```

3. The output of FFT processing of a signal is a complex number (a+jb). Since, we just care about the magnitude we take the absolute value (sqrt(a^2+b^2)) of the complex number.

```
signal_fft = abs(signal_fft);
```

4. FFT output generates a mirror image of the signal. But we are only interested in the positive half of signal length L, since it is the replica of negative half and has all the information we need.

```
signal_fft  = signal_fft(1:L/2-1)   
```

5. Plot this output against frequency.

You can use the following MATLAB starter code:

```matlab
Fs = 1000;            % Sampling frequency    
T = 1/Fs;             % Sampling period   
L = 1500;             % Length of signal
t = (0:L-1)*T;        % Time vector

% TODO: Form a signal containing a 77 Hz sinusoid of amplitude 0.7 and a 43Hz sinusoid of amplitude 2.
S = ?

% Corrupt the signal with noise 
X = S + 2*randn(size(t));

% Plot the noisy signal in the time domain. It is difficult to identify the frequency components by looking at the signal X(t). 
plot(1000*t(1:50) ,X(1:50))
title('Signal Corrupted with Zero-Mean Random Noise')
xlabel('t (milliseconds)')
ylabel('X(t)')

% TODO : Compute the Fourier transform of the signal. 

% TODO : Compute the two-sided spectrum P2. Then compute the single-sided spectrum P1 based on P2 and the even-valued signal length L.


% Plotting
f = Fs*(0:(L/2))/L;
plot(f,P1) 
title('Single-Sided Amplitude Spectrum of X(t)')
xlabel('f (Hz)')
ylabel('|P1(f)|')
```

##### 二维 FFT

##### 二维快速傅里叶变换

一旦通过跨所有线性调频信号运行距离 FFT 确定距离区间，第二个 FFT 将沿第二个维度实施以确定多普勒频移。如所讨论的，多普勒是通过处理跨多个线性调频的相位变化率来估计的。因此，多普勒 FFT 是在发送段中的所有线性调频信号并对其运行距离 FFT 之后实施的。

第一个 FFT 的输出给出了每个目标的拍频、振幅和相位。由于目标的小位移，当我们从一个线性调频信号移动到另一个线性调频信号（每行一个 bin 到另一个 bin）时，这个阶段会发生变化。一旦实施了第二个 FFT，它就会确定相位的变化率，这只不过是多普勒频移。

![在 FFT 块的行上运行第二次 FFT 后，我们得到了多普勒 FFT。 完整的实现称为 2D FFT。 在 2D FFT 之后，块的每一列中的每个 bin 表示增加的范围值，并且行中的每个 bin 对应一个速度值。](http://127.0.0.1:8887/Part%2003-Module%2001-Lesson%2003_Range-Doppler%20Estimation/img/image23.png)

在 FFT 块的行上运行第二次 FFT 后，我们得到了多普勒 FFT。完整的实现称为 2D FFT。

在 2D FFT 之后，块的每一列中的每个 bin 表示增加的范围值，并且行中的每个 bin 对应一个速度值。

距离多普勒响应的输出代表一个图像，一个轴上有距离，另一个轴上有多普勒。该图像称为距离多普勒图 (RDM)。这些地图通常用作用户界面以了解目标的感知。

![](http://127.0.0.1:8887/Part%2003-Module%2001-Lesson%2003_Range-Doppler%20Estimation/img/image11.png)

二维 FFT 输出

![单个目标的 2D FFT 输出。 这里的 x 轴是速度，y 轴是范围。](http://127.0.0.1:8887/Part%2003-Module%2001-Lesson%2003_Range-Doppler%20Estimation/img/image6.png)

单个目标的 2D FFT 输出。这里的 x 轴是速度，y 轴是范围。

![距离多普勒地图来源：rohde-schwarz](http://127.0.0.1:8887/Part%2003-Module%2001-Lesson%2003_Range-Doppler%20Estimation/img/image14.png)

![距离多普勒地图来源：rohde-schwarz](http://127.0.0.1:8887/Part%2003-Module%2001-Lesson%2003_Range-Doppler%20Estimation/img/image14.png)

##### 2D FFT In MATLAB

Steps to implement 2D FFT

The following steps can be used to compute a 2D FFT in MATLAB:

1. Take a 2D signal matrix
2. In the case of Radar signal processing. Convert the signal in MxN matrix, where M is the size of Range FFT samples and N is the size of Doppler FFT samples:

```matlab
signal  = reshape(signal, [M, N]);
```

3. Run the 2D FFT across both the dimensions.

```matlab
signal_fft = fft2(signal, M, N);
```

Note the following from the [documentation](https://www.mathworks.com/help/matlab/ref/fft2.html):

> `Y = fft2(X)` returns the 2D FFT of a matrix using a fast Fourier transform algorithm, which is equivalent to computing `fft(fft(X).').'`. If `X` is a multidimensional array, then fft2 takes the 2-D transform of each dimension higher than 2. The output `Y` is the same size as `X`. `Y = fft2(X,M,N)` truncates `X` or pads `X` with trailing zeros to form an m-by-n matrix before computing the transform. `Y` is m-by-n. If `X` is a multidimensional array, then fft2 shapes the first two dimensions of `X` according to m and n.

4. Shift zero-frequency terms to the center of the array

```matlab
signal_fft = fftshift(signal_fft);
```

6. Take the absolute value

```matlab
signal_fft = abs(signal_fft);
```

7. Here since it is a 2D output, it can be plotted as an image. Hence, we use the `imagesc` function

```matlab
imagesc(signal_fft);
```

2D FFT Exercise

In the following exercise, you will practice the 2D FFT in MATLAB using some generated data. The data generated below will have the correct shape already, so you should just need to use steps 3-6 from above. You can use the following starter code:

```matlab
% 2-D Transform
% The 2-D Fourier transform is useful for processing 2-D signals and other 2-D data such as images.
% Create and plot 2-D data with repeated blocks.

P = peaks(20);
X = repmat(P,[5 10]);
imagesc(X)

% TODO : Compute the 2-D Fourier transform of the data.  
% Shift the zero-frequency component to the center of the output, and 
% plot the resulting 100-by-200 matrix, which is the same size as X.
```

2D FFT Further Research

[Solution](https://www.mathworks.com/help/matlab/ref/fft2.html) to above workspace

Further Research

For more information about the 2D FFT, see these [notes](http://people.ciirc.cvut.cz/~hlavac/TeachPresEn/11ImageProc/12FourierTxEn.pdf).

##### 雷达工程师应该知道什么样的数学

- 线性代数
- 三角函数
- 统计学
- 快速傅里叶变换

#### [ **第 4 课：** 杂波、CFAR、AoA](http://127.0.0.1:8887/Part%2003-Module%2001-Lesson%2004_Clutter,%20CFAR,%20AoA/index.html)

讨论 - 杂波的形成，然后使用 CFAR 技术将其去除。在那之后

##### Clutter、CFAR、AoA

##### Clutter

雷达不仅接收来自感兴趣物体的反射信号，还接收来自环境和不需要的物体的反射信号。来自这些不需要的源的反向散射被称为杂波。

这些不需要的信号通常是由地面、海洋、建筑物、树木、雨、雾等的反射产生的。杂波信号的大小取决于：

* 地表的性质——地面、水、雪（例如沙漠反射率低，而冰雪反射率高）
* 表面光滑度
* 掠角 - 雷达波束与表面形成的角度
* 雷达频率

![来自多个目标的返回信号以及一些来自杂波的信号。 资料来源：http://www.redalyc.org/jatsRepo/911/91149521004/index.html](http://127.0.0.1:8887/Part%2003-Module%2001-Lesson%2004_Clutter,%20CFAR,%20AoA/img/image4.png)

来自多个目标的返回信号以及一些来自杂波的信号。

资料来源：[http ://www.redalyc.org/jatsRepo/911/91149521004/index.html](http://www.redalyc.org/jatsRepo/911/91149521004/index.html)

什么是Clutter以及如何克服它?

##### Clutter阈值

##### 消除混乱

滤除杂波对于成功检测目标非常重要。这在驾驶场景中至关重要，可以避免汽车在没有有效目标的情况下突然刹车。当雷达检测到杂波产生的反射时，就会发生这种突然制动。

一种去除杂波的技术是去除多普勒速度为 0 的信号。由于驾驶场景中的杂波通常是由静止目标造成的，因此 0 多普勒滤波可以帮助消除它们。

0 多普勒滤波的缺点是雷达无法检测到其路径中的静止目标。这将导致检测失败。

另一种技术是使用 *固定的杂波阈值* 。使用固定阈值，拒绝低于阈值的信号。采用这种方法，如果检测阈值设置过高，误报很少，但也会掩盖有效目标。如果阈值设置得太低，则会导致过多的误报。换句话说，*误报率*太高了。

误报率是雷达因噪声或其他干扰信号而检测到错误的比率。当不存在有效目标时，它是对检测到的雷达目标存在的度量。

![修复了导致误报和漏检弱目标的阈值](http://127.0.0.1:8887/Part%2003-Module%2001-Lesson%2004_Clutter,%20CFAR,%20AoA/img/image9.png)

修复了导致误报和漏检弱目标的阈值

##### 动态阈值CFAR

杂波阈值的另一种方法是使用  *动态阈值* 。动态阈值处理涉及改变阈值水平以降低误报率。

在本课的其余部分，您将了解一种称为 CFAR（恒定误报率）的动态阈值技术。使用这种技术，可以监测每个或一组距离/多普勒频段的噪声，并将信号与本地噪声水平进行比较。该比较用于创建一个阈值，该阈值保持误报率恒定。让我们看看下一个概念！

##### 如果检测阈值设置得太高，那么会导致什么?

* 目标检测失败
* 减少误报

您认为以下哪项应归类为汽车场景中的杂波？

* 铁隧道
* 路面

##### 进一步的研究

请参阅资源 [此处]( [http://www.radartutorial.eu/11.coherent/co04.en.html](http://www.radartutorial.eu/11.coherent/co04.en.html)) 和 [此处]( [https://journals.sagepub.com/doi/pdf/10.1177/1550147717729793](https://journals.sagepub.com/doi/pdf/10.1177/1550147717729793)) 有关杂波的更多信息。

##### CFAR

![CA-CFAR 和 OS-CFAR 来源：http://www.radartutorial.eu](http://127.0.0.1:8887/Part%2003-Module%2001-Lesson%2004_Clutter,%20CFAR,%20AoA/img/image2.png)

CA-CFAR 和 OS-CFAR

资料来源： http: [//www.radartutorial.eu](http://www.radartutorial.eu/)

##### CFAR

误报问题可以通过实施恒定的误报率来解决。CFAR 根据车辆周围环境改变检测阈值。CFAR 技术估计雷达范围内的干扰水平和位于“被测单元”一侧或两侧的多普勒单元“训练单元”。然后使用该估计来确定目标是否在受测单元 (CUT) 中。

该过程遍历所有范围单元格，并根据噪声估计确定目标的存在。该过程的基础是，当存在噪声时，感兴趣单元格周围的单元格将包含对噪声的良好估计，即它假设噪声或干扰在空间或时间上是均匀的。从理论上讲，它会产生一个恒定的误报率，与噪声或杂波水平无关

CFAR 有多种类别：

* 单元平均 CFAR (CA-CFAR)
* 有序统计 CFAR (OS CFAR)
* 最大最小统计量 (MAMIS CFAR)
* 并且，CA-CFAR 的多个变体。

在这里，我们将介绍基本的 CA-CFAR。

##### CA-CFAR

![CA-CFAR
Training Cells : 3
Guard Cell : 1](http://127.0.0.1:8887/Part%2003-Module%2001-Lesson%2004_Clutter,%20CFAR,%20AoA/img/image5.png)

CA-CFAR
Training Cells : 3
Guard Cell : 1

### CA-CFAR

CA-CFAR is the most commonly used CFAR detection technique. As seen in the previous lesson, the FFT blocks are generated on implementing range and doppler FFTs across the number of chirps. The CFAR process includes the sliding of a window across the cells in FFT blocks. Each window consists of the following cells.

**Cell Under Test** : The cell that is tested to detect the presence of the target by comparing the signal level against the noise estimate (threshold).

 **Training Cells** ：噪声水平是在Training Cells上测量的。训练单元可以分为两个区域，落后于 CUT 的单元称为滞后训练单元，领先于 CUT 的单元称为领先训练单元。通过平均训练单元下的噪声来估计噪声。在某些情况下，采用超前或滞后单元平均值，而在另一种情况下，结合超前和滞后单元平均值，并考虑两者中的较高者用于噪声水平估计。

训练单元的数量应根据环境决定。如果交通密集，则应使用较少的训练单元，因为间隔很近的目标会影响噪声估计。

 **Guard Cells** ：CUT 旁边的单元格被指定为 Guard Cells。保护单元的目的是避免目标信号泄漏到可能对噪声估计产生不利影响的训练单元中。
保护单元的数量应根据目标信号从被测单元的泄漏情况来确定。如果目标反射很强，它们通常会进入周围的垃圾箱。

 **阈值因子（偏移）** ：使用偏移值来缩放噪声阈值。如果信号强度以对数形式定义，则将此偏移值添加到平均噪声估计，否则将其相乘。

CFAR 一维图形

![](http://127.0.0.1:8887/Part%2003-Module%2001-Lesson%2004_Clutter,%20CFAR,%20AoA/img/image7.png)

CFAR 一维和大图

![1681827527574](image/LearningNotes/1681827527574.png)

##### CFAR 1D Implementation

The following steps here can be used to implement CFAR in the next MATLAB exercise. You can use the code template below to get started as well.

**T** : Number of Training Cells

**G** : Number of Guard Cells

**N** : Total number of Cells

1. Define the number of training cells and guard cells
2. Start sliding the window one cell at a time across the complete FFT 1D array. Total window size should be: 2(T+G)+CUT
3. For each step, sum the signal (noise) within all the leading or lagging training cells
4. Average the sum to determine the noise threshold
5. Using an appropriate offset value scale the threshold
6. Now, measure the signal in the CUT, which is T+G+1 from the window starting point
7. Compare the signal measured in 5 against the threshold measured in 4
8. If the level of signal measured in CUT is smaller than the threshold measured, then assign 0 value to the signal within CUT.

##### CFAR 1D Further Research

```matlab
% Implement 1D CFAR using lagging cells on the given noise and target scenario.

% Close and delete all currently open figures
close all;

% Data_points
Ns = 1000;

% Generate random noise
s=randn(Ns,1);

%Targets location. Assigning bin 100, 200, 300 and 700 as Targets with the amplitudes of 8, 9, 4, 11.
s([100 ,200, 300, 700])=[8 9 4 11];

%plot the output
plot(s);

% TODO: Apply CFAR to detect the targets by filtering the noise.

% 1. Define the following:
% 1a. Training Cells
% 1b. Guard Cells 

% Offset : Adding room above noise threshold for desired SNR 
offset=3;

% Vector to hold threshold values 
threshold_cfar = [];

%Vector to hold final signal after thresholding
signal_cfar = [];

% 2. Slide window across the signal length
for i = 1:(Ns-(G+T))   

    % 2. - 5. Determine the noise threshold by measuring it within the training cells

    % 6. Measuring the signal within the CUT

    % 8. Filter the signal above the threshold

    signal_cfar = [signal_cfar, {signal}];
end




% plot the filtered signal
plot (cell2mat(signal_cfar),'g--');

% plot original sig, threshold and filtered signal within the same figure.
figure,plot(s);
hold on,plot(cell2mat(circshift(threshold_cfar,G)),'r--','LineWidth',2)
hold on, plot (cell2mat(circshift(signal_cfar,(T+G))),'g--','LineWidth',4);
legend('Signal','CFAR Threshold','detection')
```

![1681827657697](image/LearningNotes/1681827657697.png)

![1681827888365](image/LearningNotes/1681827888365.png)

##### Further Research

For further research, see the articles [here](http://www.radartutorial.eu/01.basics/False%20Alarm%20Rate.en.html) and [here](https://arxiv.org/pdf/1709.09786.pdf).

##### CFAR 2D

CFAR 2D Heading

The 2D CFAR is similar to 1D CFAR, but is implemented in both dimensions of the range doppler block. The 2D CA-CFAR implementation involves the training cells occupying the cells surrounding the cell under test with a guard grid in between to prevent the impact of a target signal on the noise estimate.

![1681827993177](image/LearningNotes/1681827993177.png)

##### 2D CFAR Implementation

You won't need to implement a 2D-CFAR yet, but you will implement a 2D CFAR on the range doppler output for your final project! The following steps can be used to implement 2D-CFAR in MATLAB:

1. Determine the number of Training cells for each dimension Tr and Td. Similarly, pick the number of guard cells Gr and Gd.
2. Slide the Cell Under Test (CUT) across the complete cell matrix
3. Select the grid that includes the training, guard and test cells. Grid Size = (2Tr+2Gr+1)(2Td+2Gd+1).
4. The total number of cells in the guard region and cell under test. (2Gr+1)(2Gd+1).
5. This gives the Training Cells : (2Tr+2Gr+1)(2Td+2Gd+1) - (2Gr+1)(2Gd+1)
6. Measure and average the noise across all the training cells. This gives the threshold
7. Add the offset (if in signal strength in dB) to the threshold to keep the false alarm to the minimum.
8. Determine the signal level at the Cell Under Test.
9. If the CUT signal level is greater than the Threshold, assign a value of 1, else equate it to zero.
10. Since the cell under test are not located at the edges, due to the training cells occupying the edges, we suppress the edges to zero. Any cell value that is neither 1 nor a 0, assign it a zero.

Further Research

You can find out more about this [here]([http://www.radartutorial.eu/01.basics/False%20Alarm%20Rate.en.html](http://www.radartutorial.eu/01.basics/False%20Alarm%20Rate.en.html))
) and [here](https://arxiv.org/pdf/1709.09786.pdf).

##### Angle of Arrival Introduction

##### Phase Array Introduction Heading

A *phased array antenna* is an antenna array that steers the beam electronically in the desired direction. The array steers the beam if each antenna element in an array is excited by the signal with certain phase values. This phenomenon is referred to as beam scanning.

![1681828156260](image/LearningNotes/1681828156260.png)

Beam Steering Design. Here the Φ**Φ** represents the phase shifters. Phase shifters are the electronic components that changes the phase to make the beam steer in a desired direction.

source : analog.com

![1681828175630](image/LearningNotes/1681828175630.png)

##### Phase Array Graphic

![Radar Module for Automotive Applications from D3 Engineering](http://127.0.0.1:8887/Part%2003-Module%2001-Lesson%2004_Clutter,%20CFAR,%20AoA/img/image3.png)

Radar Module for Automotive Applications from D3 Engineering

##### Angle of Arrival

![Road scenario for beam steering radar](http://127.0.0.1:8887/Part%2003-Module%2001-Lesson%2004_Clutter,%20CFAR,%20AoA/img/image11.png)

Road scenario for beam steering radar

As the radar scans the surroundings by steering the beam at the programmed angles, it measures the SNR of reflected signals from targets located at different angles spatially. This helps in creating an angle of arrival vs SNR grid for radar’s spatial perception.

![](http://127.0.0.1:8887/Part%2003-Module%2001-Lesson%2004_Clutter,%20CFAR,%20AoA/img/image3.png)

Start Quiz:

Unknown quiz type. Please contact the developer to make it compatible with this atom type!

Further Research

For more information about phased array antennas see [here](http://www.radartutorial.eu/06.antennas/Phased%20Array%20Antenna.en.html).

#### 第 05 课_聚类和跟踪

##### 01.聚类和跟踪

##### 02.聚类

![汽车和自行车来源的聚类：https://ieeexplore.ieee.org/document/7226315](http://127.0.0.1:8887/Part%2003-Module%2001-Lesson%2005_Clustering%20and%20Tracking/img/image7.png)

汽车和自行车的聚类

资料来源： https: [//ieeexplore.ieee.org/document/7226315](https://ieeexplore.ieee.org/document/7226315)

项目概况

##### 为了增强自动驾驶的感知能力，需要分别跟踪多个目标。对象跟踪的计算成本很高，同时跟踪多个目标需要大量的处理能力和内存。

由于雷达技术的进步和传感分辨率的提高，雷达可以从目标上的大量散射点生成检测结果。如果将跟踪器分配给来自同一目标的每个检测，那么它会使处理单元负担过重。因此，重要的是对每个目标的检测进行聚类并为每个目标分配一个轨道。

这就是聚类算法对于成功的对象跟踪变得重要的地方。

##### 系统要求

这里我们将讨论基于欧氏距离的基本聚类算法。这里的算法根据检测点之间的欧几里得距离测量的接近度对检测点进行分组。

所有在目标尺寸范围内的检测点被认为是一个簇，合并到一个质心位置。现在每个集群都被分配了一个新的范围和速度，这是构成集群的所有检测点的测量范围和速度的平均值。

这允许对每个目标进行有效跟踪。

![](http://127.0.0.1:8887/Part%2003-Module%2001-Lesson%2005_Clustering%20and%20Tracking/img/image2.png)

##### 聚类

以上是集群场景的说明。在图像中，蓝色汽车是一辆自我车辆（带传感器的车辆），检测是从橙色和黄色车辆生成的。使用聚类算法将与单个目标相关的所有检测合并为一个点。这有助于检测并将轨迹分配给目标.

![](http://127.0.0.1:8887/Part%2003-Module%2001-Lesson%2005_Clustering%20and%20Tracking/img/image5.png)

![](http://127.0.0.1:8887/Part%2003-Module%2001-Lesson%2005_Clustering%20and%20Tracking/img/image9.png)

信号传播和移动目标场景

上面的集群实现使用以下步骤：

1. 如果检测来自同一个传感器，则循环遍历每个检测点并测量所有检测点之间的欧氏距离。
2. 继续运行循环，直到检测列表为空

在 while 循环中实现以下内容：

3. 选择检查列表中的第一个检测并检查其聚类邻居。
4. 如果第一个拾取和其余检测之间的距离小于车辆尺寸，则将这些检测及其各自的雷达传感器测量值（包括距离和速度）分组。
5. 对于该组，取范围和速度测量值的平均值。
   **注意：** 雷达测量矢量有 6 个值 - 其中 x 和 y 坐标的范围和速度位于索引 1、2、4 和 5 处：`[x, y, - , Vx, Vy, -]`
6. 创建一个新的集群 ID。然后，将所有组检测分配给相同的 ID。
7. 此外，分配集群、平均范围和速度。
8. 最后，从列表中删除已经分配给集群的检测。
9. 不断重复这个过程，直到检测列表为空。

##### 卡尔曼跟踪 Kalman Tracking

![1681828907956](image/LearningNotes/1681828907956.png)

![1681828985915](image/LearningNotes/1681828985915.png)

##### Implementation of 2D CFAR

The purpose of the Kalman filter is to estimate the *state* of a tracked vehicle. Here, "state" could include the position, velocity, acceleration or other properties of the vehicle being tracked. The Kalman filter uses measurements that are observed over time that contain noise or random variations and other inaccuracies, and produces values that tend to be closer to the true values of the measurements and their associated calculated values. It is the central algorithm to the majority of all modern radar tracking systems.

Here, we will be keeping the Kalman Filter limited to a basic introduction. You will be covering Kalman filters in detail in the fourth course of this Nanodegree program.

![1681829065219](image/LearningNotes/1681829065219.png)

##### Kalman Tracking and MATLAB

The trackingKF class creates a discrete-time linear Kalman filter used for tracking positions and velocities of objects which can be encountered in an automated driving scenario, such as automobiles, pedestrians, bicycles, and stationary structures or obstacles.

You can learn more about different parameters for the filter [here](https://www.mathworks.com/help/driving/ref/trackingkf-class.html), and you can learn more about the theory behind Kalman filters [here](https://www.mathworks.com/help/driving/ug/linear-kalman-filters.html).

##### Implementation in MATLAB

The following guidelines can be used to implement a basic Kalman filter for the next project.

* You will define the Kalman filter using the `trackingKF` function. The function signature is as follows:

```matlab
       filter = trackingKF('MotionModel', model, 'State', state, 'MeasurementModel', measurementModel, 'StateCovariance', stateCovrariance, 'MeasurementNoise', measurementNoise)
```

In this function signature, each property (e.g. `'MotionModel`) is followed by the value for that property (e.g. `model`).

* For the `model` variable, you can pass the string `'2D Constant Velocity'`, which will provides the 2D constant velocity motion model.
* For the 2D constant velocity model the state vector (x) can be defined as:

```matlab
[x;vx;y;vy]
```

Here, `x` and `y` are 2D position coordinates. The variables `vx` and `vy` provide the velocity in 2D.

* A `RadarDetectionGenerator` function is used to generate detection points based on the returns after reflection. Every Radar detection generates a **detection measurement** and **measurement noise** matrix:
  `detection.Measurement` and `detection.MeasurementNoise`.The detection **measurement vector (z)** has the format `[x;y;vx;vy]`.
  **Measurement Models**
  Measurements are what you observe about your system. Measurements depend on the state vector but are not always the same as the state vector.The measurement model assumes that the actual measurement at any time is related to the current state by

```matlab
z  = H*x
```

As a result, for the case above the **measurement model** is `H = [1 0 0 0; 0 0 1 0; 0 1 0 0; 0 0 0 1]`

Using this measurement model, the state can derived from the measurements.

```matlab
 x = H'*z
state = H'*detection.Measurement
```

Further, using the generated measurement noise and measurement model define the state covariance matrix:

```matlab
stateCovariance =H'*detection.MeasurementNoise*H
```

Further Research

For further explanation of Kalman Filters with MATLAB, you can refer to [this video series](https://www.youtube.com/watch?v=mwn8xhgNpFY&list=PLn8PRpmsu08pzi6EMiYnR-076Mh-q3tWr).

##### MATLAB 传感器融合引导演练

以下步骤将引导您使用 MATLAB 在模拟环境中执行卡尔曼滤波。您可以在本课的参考资料 `Sensor_Fusion_with_Radar.m<span> </span>`部分下载本演练的入门代码文件。

![雷达传感器融合小型项目](http://127.0.0.1:8887/Part%2003-Module%2001-Lesson%2005_Clustering%20and%20Tracking/img/image6.png)

雷达传感器融合小型项目

项目介绍

自动驾驶系统的传感器融合和控制算法需要进行严格的测试。基于车辆的测试不仅设置耗时，而且难以重现。Automated Driving System Toolbox 提供定义道路网络、参与者、车辆和交通场景的功能，以及用于模拟合成雷达和摄像头传感器检测的统计模型。此示例说明如何生成场景、模拟传感器检测以及使用传感器融合来跟踪模拟车辆。使用场景生成和传感器模拟而不是传感器记录的主要好处是能够创建罕见且具有潜在危险的事件并使用它们测试车辆算法。这个例子涵盖了整个合成数据工作流程。

##### 生成场景

场景生成包括生成道路网络、定义在道路上移动的车辆以及移动车辆。在此示例中，您将测试传感器融合跟踪从自我车辆左侧通过的车辆的能力。该场景模拟高速公路设置，并且在自我车辆的前后有其他车辆。在此处查找有关如何生成这些场景的更多信息：[Automated Driving Toolbox](https://www.mathworks.com/videos/driving-scenario-designer-1529302116471.html)

```matlab
% Define an empty scenario

scenario = drivingScenario;
scenario.SampleTime = 0.01;

% Add a stretch of 500 meters of typical highway road with two lanes. 
% The road is defined using a set of points, where each point defines the center of the 
% road in 3-D space, and a road width.

roadCenters = [0 0; 50 0; 100 0; 250 20; 500 40];
roadWidth = 7.2; % Two lanes, each 3.6 meters
road(scenario, roadCenters, roadWidth);

% Create the ego vehicle and three cars around it: one that overtakes the ego vehicle 
% and passes it on the left, one that drives right in front of the ego vehicle and 
% one that drives right behind the ego vehicle. 
% All the cars follow the path defined by the road waypoints by using the path driving 
% policy. The passing car will start on the right lane, move to the left lane to pass, 
% and return to the right lane.

% Create the ego vehicle that travels at 25 m/s along the road.
egoCar = vehicle(scenario, 'ClassID', 1);
path(egoCar, roadCenters(2:end,:) - [0 1.8], 25); % On right lane


% Add a car in front of the ego vehicle.
leadCar = vehicle(scenario, 'ClassID', 1);
path(leadCar, [70 0; roadCenters(3:end,:)] - [0 1.8], 25); % On right lane

% Add a car that travels at 35 m/s along the road and passes the ego vehicle.
passingCar = vehicle(scenario, 'ClassID', 1);
waypoints = [0 -1.8; 50 1.8; 100 1.8; 250 21.8; 400 32.2; 500 38.2];
path(passingCar, waypoints, 35);

% Add a car behind the ego vehicle
chaseCar = vehicle(scenario, 'ClassID', 1);
path(chaseCar, [25 0; roadCenters(2:end,:)] - [0 1.8], 25); % On right lane
```

##### 定义雷达传感器

定义雷达

在此示例中，您模拟了一辆具有 6 个雷达传感器的自我车辆，覆盖 360 度视野。传感器有一些重叠和一些覆盖间隙。ego 车辆在车辆的前部和后部都配备了远程雷达传感器。车辆的每一侧都有两个短程雷达传感器，每个传感器覆盖 90 度。每侧各有一个传感器，从车辆中部一直覆盖到后部。每侧的另一个传感器从车辆中间向前覆盖。下一节中的图显示了覆盖范围。

```matlab
sensors = cell(6,1);

% Front-facing long-range radar sensor at the center of the front bumper of the car.
sensors{1} = radarDetectionGenerator('SensorIndex', 1, 'Height', 0.2, 'MaxRange', 174, ...
 'SensorLocation', [egoCar.Wheelbase + egoCar.FrontOverhang, 0], 'FieldOfView', [20, 5]);
```

其余的雷达传感器在项目代码中定义。

##### 创建一个多对象跟踪器

创建一个 `multiObjectTracker`跟踪靠近自我车辆的车辆。跟踪器使用
`initSimDemoFilter`支持函数来初始化与位置和速度一起工作的恒速线性卡尔曼滤波器。跟踪是在 2-D 中完成的。尽管传感器以 3-D 形式返回测量值，但运动本身仅限于水平面，因此无需跟踪高度。

```matlab
tracker = multiObjectTracker('FilterInitializationFcn', @initSimDemoFilter, ...
 'AssignmentThreshold', 30, 'ConfirmationParameters', [4 5]);

positionSelector = [1 0 0 0; 0 0 1 0]; % Position selector
velocitySelector = [0 1 0 0; 0 0 0 1]; % Velocity selector
```

MultiObjectTracker Function 有几个参数，可以针对不同的驾驶场景进行调整。[它控制轨道的创建和删除。您可以在此处](https://www.mathworks.com/help/driving/ref/multiobjecttracker-system-object.html)了解更多信息。

![](http://127.0.0.1:8887/Part%2003-Module%2001-Lesson%2005_Clustering%20and%20Tracking/img/image4.png)

![](http://127.0.0.1:8887/Part%2003-Module%2001-Lesson%2005_Clustering%20and%20Tracking/img/image10.png)

##### 模拟场景

以下循环移动车辆、调用传感器模拟并执行跟踪。请注意，场景生成和传感器模拟可以有不同的时间步长。为场景和传感器指定不同的时间步长使您能够将场景模拟与传感器模拟分离。这对于独立于传感器的测量速率对演员运动进行高精度建模非常有用。

另一个例子是当传感器具有不同的更新率时。假设一个传感器每 20 毫秒提供一次更新，而另一个传感器每 50 毫秒提供一次更新。您可以指定更新率为 10 毫秒的场景，传感器将在正确的时间提供更新。在此示例中，场景生成的时间步长为 0.01 秒，而传感器每 0.1 秒检测一次。

传感器返回一个逻辑标志，`isValidTime`如果传感器生成检测，则该标志为真。此标志用于仅在有检测时调用跟踪器。另一个重要的注意事项是传感器可以模拟每个目标的多次检测，特别是当目标非常靠近雷达传感器时。由于跟踪器假定每个传感器对每个目标进行一次检测，因此您必须在跟踪器处理检测之前对检测进行聚类。这是通过实施聚类算法来完成的，就像我们上面讨论的那样。

```matlab
toSnap = true;
while advance(scenario) && ishghandle(BEP.Parent)  
    % Get the scenario time
    time = scenario.SimulationTime;

    % Get the position of the other vehicle in ego vehicle coordinates
    ta = targetPoses(egoCar);

    % Simulate the sensors
    detections = {};
    isValidTime = false(1,6);
    for i = 1:6
        [sensorDets,numValidDets,isValidTime(i)] = sensors{i}(ta, time);
        if numValidDets
            detections = [detections; sensorDets]; %#ok<AGROW>
        end
    end

    % Update the tracker if there are new detections
    if any(isValidTime)
        vehicleLength = sensors{1}.ActorProfiles.Length;
        detectionClusters = clusterDetections(detections, vehicleLength);
        confirmedTracks = updateTracks(tracker, detectionClusters, time);

        % Update bird's-eye plot
        updateBEP(BEP, egoCar, detections, confirmedTracks, positionSelector, velocitySelector);
    end

    % Snap a figure for the document when the car passes the ego vehicle
    if ta(1).Position(1) > 0 && toSnap
        toSnap = false;
        snapnow
    end
end
```

##### 定义卡尔曼滤波器

在这里定义要与 一起使用的卡尔曼滤波器 `multiObjectTracker`。

在 MATLAB 中，一个 `trackingKF`函数可用于为任何类型的运动模型启动卡尔曼滤波器。这包括 1D、2D 或 3D 恒定速度甚至恒定加速度。[您可以在此处](https://www.mathworks.com/help/driving/ref/trackingkf-class.html)阅读更多相关信息。

initSimDemoFilter
此函数根据检测初始化恒速滤波器。

```matlab
function filter = initSimDemoFilter(detection)

% Use a 2-D constant velocity model to initialize a trackingKF filter.
% The state vector is [x;vx;y;vy]
% The detection measurement vector is [x;y;vx;vy]
% As a result, the measurement model is H = [1 0 0 0; 0 0 1 0; 0 1 0 0; 0 0 0 1]

H = [1 0 0 0; 0 0 1 0; 0 1 0 0; 0 0 0 1];
filter = trackingKF('MotionModel', '2D Constant Velocity', ...
 'State', H' * detection.Measurement, ...
 'MeasurementModel', H, ...
 'StateCovariance', H’ * detection.MeasurementNoise * H, ...
 'MeasurementNoise', detection.MeasurementNoise);
end
```

##### 集群检测

该功能将疑似同一车辆的多个检测结果合并为一个检测结果。该函数寻找比车辆尺寸更近的检测。符合这个标准的检测被认为是一个集群，并在集群的质心处合并为一个单一的检测。测量噪声被修改以表示每次检测可以在车辆上的任何地方的可能性。因此，噪声的大小应与车辆大小相同。此外，此函数删除了测量的第三个维度（高度）并将测量向量减少为 `[x;y;vx;vy]`。

我们已经在本课的集群概念中完成了它的实现。

##### 运行你的代码

现在，是时候运行代码并查看输出了！

强烈建议花一些时间在这个传感器融合代码上。这是开始学习和实施传感器融合技术的好地方。

#### 第 06 课_雷达目标生成和检测

以下视频将概述该项目。您可以在课堂资源 `Radar_Target_Generation_and_Detection.m`部分的文件中找到项目起始代码。此外，可以在此处找到项目规则。

![](http://127.0.0.1:8887/Part%2003-Module%2001-Lesson%2006_Radar%20Target%20Generation%20and%20Detection/img/image11.png)

![1681909103660](image/LearningNotes/1681909103660.png)

* 根据系统要求配置 FMCW 波形。
* 定义目标的范围和速度并模拟其位移。
* 对于相同的仿真环路，处理发送和接收信号以确定拍频信号
* 对接收到的信号执行 Range FFT 以确定 Range
* 最后，对 2nd FFT 的输出执行 CFAR 处理以显示目标。

##### 雷达系统要求

![](http://127.0.0.1:8887/Part%2003-Module%2001-Lesson%2006_Radar%20Target%20Generation%20and%20Detection/img/image14.png)

![1681909271453](image/LearningNotes/1681909271453.png)

##### Initial Range and velocity of the Target

You will provide the initial range and velocity of the target. Range cannot exceed the max value of 200m and velocity can be any value in the range of -70 to + 70 m/s.

##### 02. 目标生成与检测

![信号传播](http://127.0.0.1:8887/Part%2003-Module%2001-Lesson%2006_Radar%20Target%20Generation%20and%20Detection/img/image.png)

![1681909378228](image/LearningNotes/1681909378228.png)

##### FFT运算

* 对混合信号实施 1D FFT
* 将向量重塑为 Nr*Nd 数组。
* 沿范围 bin 维度 (Nr) 对拍频信号运行 FFT
* 标准化 FFT 输出。
* 取该输出的绝对值。
* 保留二分之一的信号
* 绘制输出
* 目标的初始位置应该有一个峰值

![位于 110 米处的目标的第一个 FFT 输出](http://127.0.0.1:8887/Part%2003-Module%2001-Lesson%2006_Radar%20Target%20Generation%20and%20Detection/img/image10.png)

位于 110 米处的目标的第一个 FFT 输出

第二次 FFT 已在代码中实现。它将生成如下图所示的距离多普勒图，并将由变量“RDM”给出。下一个任务是在此距离多普勒地图上实施 CFAR。

![二维 FFT 输出 - 距离多普勒图](http://127.0.0.1:8887/Part%2003-Module%2001-Lesson%2006_Radar%20Target%20Generation%20and%20Detection/img/image12.png)

二维 FFT 输出 - 距离多普勒图

##### 二维CFAR

* 确定每个维度的训练单元数。同样，选择保卫细胞的数量。
* 将被测电池滑过整个矩阵。确保 CUT 从边缘为训练和保护单元留出余量。
* 对于每次迭代，对所有训练单元内的信号电平求和。要求和，请使用 db2pow 函数将值从对数转换为线性。
* 平均所有使用的训练单元的总和值。平均后使用 pow2db 将其转换回对数。
* 进一步向其添加偏移量以确定阈值。
* 接下来，将 CUT 下的信号与该阈值进行比较。
* 如果 CUT level > threshold 赋值 1，否则赋值为 0。

上述过程将生成一个阈值块，该块小于距离多普勒图，因为由于目标和保护单元的存在，CUT 不能位于矩阵的边缘。因此，这些细胞不会被阈值化。

* 要保持地图大小与 CFAR 之前相同，请将所有非阈值单元等于 0。

![2D CFAR 过程的输出](http://127.0.0.1:8887/Part%2003-Module%2001-Lesson%2006_Radar%20Target%20Generation%20and%20Detection/img/image13.png)

2D CFAR 过程的输出

一旦你完成了这个，你就完成了。祝贺你在这个最终项目上做得很好！

### **第 04 部分：** 相机

#### 第 01 课：简介

![1681909724991](image/LearningNotes/1681909724991.png)

蒂莫简介

在整个相机课程中，您将从 Timo Rehfeld 那里了解相机。[Timo 在MBRDNA](https://mbrdna.com/)开发传感器融合算法。在下一个视频中，Timo 将向您介绍一些关于他自己和他在 MBRDNA 的角色。

- 相关性的跟踪
- 校准
- 分割
- 分类

#### 第 02 课： 自动驾驶汽车和计算机视觉

##### 01. 自动驾驶级别

根据[CB Insights 的数据](https://www.cbinsights.com/research/autonomous-driverless-vehicles-corporations-list/)，目前有 46 家公司在研发自动驾驶汽车（截至 2019 年 4 月）。这包括奥迪、特斯拉、宝马、沃尔沃或通用汽车等汽车制造商，也包括来自完全不同行业的 Alphabet / Waymo、优步或百度等汽车领域的新成员。

[据Allied Market Research 估计](https://www.techworld.com/picture-gallery/data/-companies-working-on-driverless-cars-3641537/)，预计自动驾驶汽车市场将从 2019 年的 540 亿美元增长到 2026 年的 5560 亿美元。这样的增长率，加上近年来的技术突破，解释了为什么事情发展得如此之快，以及为什么每个人都想在这个新兴市场中分得一杯羹。

除了自动驾驶车辆之外，还有一些系统可以协助驾驶员完成各种驾驶任务，例如变换车道、记住速度标志或及时制动以防前方车辆突然减速。此类系统被称为高级驾驶员辅助系统 (ADAS)，它们是全自动驾驶汽车的前身。然而，市场上有些车辆意味着完全自主（例如特斯拉自动驾驶仪），但“仅”是 ADAS 系统。

在我们分析精选的自动驾驶汽车原型及其各自的传感器之前，让我们看看如何定义自动驾驶——因为并非所有的自动驾驶汽车和驾驶员辅助系统都是生而平等的。下图显示了自主工程师协会 (SAE) 定义的“自动驾驶级别”。

##### 自动驾驶的 SAE 级别

![https://www.nhtsa.gov/technology-innovation/automated-vehicles-safety](http://127.0.0.1:8887/Part%2004-Module%2001-Lesson%2002_Autonomous%20Vehicles%20and%20Computer%20Vision/img/nhtsa-sae-automation-levels.png)

[https://www.nhtsa.gov/technology-innovation/automated-vehicles-safety](https://www.nhtsa.gov/technology-innovation/automated-vehicles-safety)

多年来，前向碰撞警告 (FCW) 或自适应巡航控制 (ACC) 等 ADAS 产品是唯一可以在选定数量的驾驶情况下（例如高速公路、低海拔城市）至少提供一定程度自动化的可用系统速度）。

特斯拉是全球首批向市场推出承诺高度自治的系统 Auto Pilot 的公司之一。然而，在 SAE 图表上，该系统“仅”处于 2 级，这意味着驾驶员必须保持参与并应始终监控环境。

升级到 3 级是一个很大的步骤，因为驾驶员不再需要监控环境，尽管他必须能够随时收回控制权。从法律的角度来看，这意味着驾驶任务的责任在于汽车，因此也在于制造商。这就是为什么我们还没有看到大量配备 3 级系统的商用车辆。几家制造商已经发布了此类系统，但在撰写本文时（2019 年 5 月），我们在市场上找不到它们。这样做的原因有三：

1. 这样的系统必须构建得足够可靠，以尽量减少错误决策的数量。工程师通常通过在汽车上添加大量传感器来解决这个问题，这使得此类系统（非常）昂贵。
2. 对因事故引起的法律诉讼的恐惧导致系统的可用性有意降低，例如通过限制行驶速度或场景（例如，仅在高速公路上的交通拥堵中，车道标记清晰可见，速度低于 60 公里/小时）。
3. 无法保证驾驶员随时准备好控制车辆。由于人类的反应时间和警觉水平，在许多情况下这是不可能的。

因此，许多专家认为，3 级系统只是向在 4 级和 5 级运行的更先进系统的过渡步骤。在这些级别上，车辆能够执行所有驾驶任务，“驾驶员”不需要控制住。显然，此类系统需要强大的工程设计才能始终保证驾驶员和道路使用者的安全。

在下一节中，我们将仔细研究部分自动驾驶汽车及其各自的传感器套件。但是现在，您应该尝试通过回答以下测验问题来测试您的知识。

- FCW
- ACC
- NOA

##### 自动驾驶汽车传感器组

在上一节中，您了解了不同级别的自动驾驶以及从 2 级到 3 级甚至更高级别所需的飞跃。现在应该很明显，实现 4 级和 5 级自动驾驶的一个关键是传感器和感知算法的智能组合，以始终监控车辆环境，以确保对所有交通事件做出适当和安全的反应。

为了让您了解在实践中如何解决这个问题，本节简要概述了一些旨在实现 4 级甚至 5 级驾驶的车辆。由于本课程主要是关于相机和计算机视觉，并在一定程度上涉及激光雷达，因此让我们主要关注这两种传感器类型。现在让我们来看看一些自动驾驶汽车及其各自的传感器套件。

##### Uber ATG 自动驾驶汽车

当前版本的 Uber 自动驾驶汽车结合了顶部安装的 360° 激光雷达扫描仪和放置在汽车周围的多个摄像头和雷达传感器。

![](http://127.0.0.1:8887/Part%2004-Module%2001-Lesson%2002_Autonomous%20Vehicles%20and%20Computer%20Vision/img/uber-atg-volvo.jpg)

让我们一一了解这些传感器类别：

1. *摄像头* ：优步改装的沃尔沃 XC90 SUV 车队在车顶配备了一系列摄像头，另外还有指向汽车侧面和后方的摄像头。车顶摄像头能够聚焦近场和远场，观察刹车车辆、过马路的行人、交通信号灯和标志。摄像头将它们的材料传送到中央车载计算机，该计算机还接收其他传感器的信号，以创建车辆周围环境的精确图像。就像人眼一样，摄像头系统在夜间的性能会大大降低，这使得它们无法以所需的检测率和位置精度定位物体。这就是优步车队配备两种额外传感器类型的原因。
2. *雷达* ：雷达系统发射的无线电波被（许多但不是全部）物体反射。可以根据它们的运行时间（给出距离）以及它们的偏移频率（给出相对速度）来分析返回波。后一种特性清楚地将雷达与其他两种传感器类型区分开来，因为它是唯一能够直接测量物体速度的传感器。此外，雷达在大雪和浓雾等恶劣天气条件下也非常强大。巡航控制系统使用多年，雷达在识别具有良好反射特性的较大物体时效果最佳。在检测反射特性降低的较小或“软”物体（人、动物）时，雷达检测性能会下降。即使相机和雷达结合得很好，
3. *激光雷达* ：激光雷达的工作方式与雷达类似，但它不发射无线电波，而是使用红外线。屋顶安装的传感器高速旋转，并构建其周围环境的详细 3D 图像。在 Velodyne VLS-128 的情况下，总共使用 128 束激光束来检测最远 300 米距离的障碍物。在单次旋转 360 度期间，每秒总共生成多达 400 万个数据点。与相机类似，激光雷达是一种光学传感器。然而，它具有“自带光源”的显着优势，而摄像头则依赖于环境光和车辆前照灯。但必须注意的是，激光雷达在恶劣的环境条件下（例如雪、大雨）也会降低性能或雾。再加上某些材料的低反射特性，因此，激光雷达可能无法为交通中的某些物体生成足够密集的点云，只留下几个 3D 点可供使用。因此，将激光雷达与其他传感器相结合是一个好主意，以确保检测性能足以在交通中自主导航。

以下场景显示了优步自动驾驶汽车生成的激光雷达 3D 点云以及左上角叠加的前置摄像头图像。重建场景的整体印象非常积极。但是，如果仔细观察，您会发现场景中不同对象的激光雷达点数差异很大。

[https://eng.uber.com/atg-dataviz/](https://eng.uber.com/atg-dataviz/)

![https://eng.uber.com/atg-dataviz/](http://127.0.0.1:8887/Part%2004-Module%2001-Lesson%2002_Autonomous%20Vehicles%20and%20Computer%20Vision/img/camera-2-2.gif)

车辆日志描述了车辆正在做什么、看到了什么以及如何行动。基于传感器数据运行算法的三个关键阶段：感知（测量）、预测（forecasting）和运动规划（acting）。为了成功运行，车辆需要能够通过其传感器*感知*周围的活动。基于这些信息，它可以*预测*这些物体在不久的将来会在哪里，这将提供足够的信息来正确*规划*它的下一步行动（想想：改变车道或在停车标志处停车）

![](http://eng.uber.com/wp-content/uploads/2017/08/triage-2-1.gif)

![](http://eng.uber.com/wp-content/uploads/2017/08/camera-2-1.gif)

![](http://eng.uber.com/wp-content/uploads/2017/08/debug.gif)

##### 梅赛德斯奔驰自主原型车

目前，德国汽车制造商梅赛德斯奔驰正在开发一款配备摄像头、激光雷达和雷达传感器的自动驾驶汽车原型，类似于优步汽车。梅赛德斯使用多个摄像头扫描车辆周围的区域。特别感兴趣的是由两个同步相机组成的立体设置，它能够通过在两个图像中找到相应的特征来测量深度。下图显示了系统使用的所有摄像机。梅赛德斯表示，单是立体摄像头，每行驶一公里就会产生总计 100 GB 的数据。

https://www.mercedes-benz.com/en/mercedes-benz/innovation/successful-autonomous-driving-a-pilot-project-by-daimler-and-bosch/

![https://www.mercedes-benz.com/en/mercedes-benz/innovation/successful-autonomous-driving-a-pilot-project-by-daimler-and-bosch/](http://127.0.0.1:8887/Part%2004-Module%2001-Lesson%2002_Autonomous%20Vehicles%20and%20Computer%20Vision/img/draggedimage.png)

##### 特斯拉自动驾驶仪

当 Autopilot 系统首次销售时，它基本上是自适应巡航控制和变道辅助的组合——全球其他制造商长期以来一直提供的一组功能。然而，“Autopilot”这个名字暗示着汽车将是真正的自动驾驶。事实上，许多特斯拉车主通过爬上后座、读书或在系统驱动下小睡来测试系统的极限。然而，在 SAE 等级上，Autopilot 只能“仅”归类为 2 级，即驾驶员始终负责驾驶任务。

2016 年 10 月，特斯拉 Model S 和 X 传感器组得到显着升级，自动驾驶仪的功能通过定期机载软件更新得到扩展。

该图像显示了特斯拉的内部，相机视图叠加在右侧。该图像显示了左右后置摄像头以及用于中距离感知的前向摄像头。

![](http://127.0.0.1:8887/Part%2004-Module%2001-Lesson%2002_Autonomous%20Vehicles%20and%20Computer%20Vision/img/screen-shot-2018-04-25-at-10-14-46-pm.jpg)

从概述中可以看出，该系统将多个具有部分重叠视野的摄像头传感器与一个前向雷达传感器结合在一起。

![https://www.tesla.com/de_DE/autopilot](http://127.0.0.1:8887/Part%2004-Module%2001-Lesson%2002_Autonomous%20Vehicles%20and%20Computer%20Vision/img/tesla-autopilot-hardware.png)

https://www.tesla.com/de_DE/autopilot

让我们依次看看每种传感器类型：

1. *相机* ：前向光学阵列由四个不同焦距的相机组成。窄前摄像头拍摄前方 250m 的镜头，稍大开口角度的前摄像头可拍摄前方 150m，广角摄像头可拍摄前方 60m，一组前视侧摄像头可在汽车前方和侧面拍摄 80 米的镜头。广角摄像头旨在读取道路标志和交通信号灯，让汽车做出相应的反应。然而，是否可以在流量中可靠地使用此功能存在争议。
2. *雷达* ：前视雷达最多可看到汽车前方 160 米。根据特斯拉创始人埃隆·马斯克的说法，它能够看穿“沙子、雪、雾——几乎任何东西”。
3. *声纳* ：360°超声波声纳检测汽车周围八米半径内的障碍物。超声波传感器可以在任何速度下工作，用于发现汽车附近的物体。超声波传感器还可用于在自动切换车道时辅助汽车。然而，与该组中的其他传感器相比，它们的范围非常有限，并且在大约 8 米的距离处结束。

您可能已经注意到，尽管特斯拉计划通过此设置提供 4 级甚至 5 级自动驾驶，但它并未使用激光雷达传感器。与 Uber、Waymo 和其他几家以完全自主为目标的许多其他制造商不同，特斯拉相信，一套高性能摄像头加上强大的雷达传感器就足以实现 4 级/5 级自主。在撰写本文时，关于自动驾驶汽车的最佳传感器组的争论仍在激烈进行。特斯拉辩称，激光雷达的价格和包装劣势会使自动驾驶仪对客户没有吸引力。通用汽车自动驾驶汽车集成总监斯科特·米勒等严厉的批评者不同意自动驾驶汽车的高度安全要求，仅靠摄像头和雷达无法满足这些要求。

然而，必须注意的是，在所有传感器设置中，无论是优步、特斯拉、Waymo 还是传统制造商，如梅赛德斯或奥迪，始终使用摄像头。尽管关于雷达或激光雷达或两者的组合哪个更好的争论一直在持续，但相机永远不会受到质疑。因此，学习相机和计算机视觉是个好主意，我们将在本课程中详细介绍。

##### 传感器选择标准

自动驾驶或配备 ADAS 的车辆的设计涉及选择合适的传感器组。正如您在上一节中了解到的，目前正在讨论需要哪种传感器组合才能实现完全（甚至部分）自主。在本节中，您将了解传感器选择标准以及相机、激光雷达和雷达在每个标准方面的差异。

下面简要讨论最典型的选择标准。

1. **范围** ：激光雷达和雷达系统可以检测距离从几米到 200 多米不等的物体。许多激光雷达系统难以检测非常近距离的物体，而雷达可以检测不到一米的物体，具体取决于系统类型（长距离、中距离或短距离）。单声道相机无法可靠地测量到物体的公制距离——这只能通过对世界的性质（例如平面路面）做出一些假设来实现。另一方面，立体相机可以测量距离，但最多只能测量大约 10 米的距离。80m，精度从那里显着下降。
2. **空间分辨率** ：由于发射的红外激光波长较短，激光雷达扫描的空间分辨率约为 0.1°。这允许进行高分辨率 3D 扫描，从而表征场景中的对象。另一方面，雷达不能很好地分辨小特征，尤其是随着距离的增加。相机系统的空间分辨率由光学器件、图像上的像素大小及其信噪比决定。一旦从小物体发出的光线扩散到图像传感器上的几个像素（模糊），小物体的细节就会丢失。此外，当存在很少的环境光来照亮物体时，空间分辨率会随着物体细节通过增加成像器的噪声水平而叠加而增加。
3. **黑暗中的鲁棒性** ：雷达和激光雷达在黑暗中具有出色的鲁棒性，因为它们都是主动传感器。虽然激光雷达系统的白天性能非常好，但它们在夜间的性能甚至更好，因为没有可能干扰红外激光反射检测的环境阳光。另一方面，摄像头在夜间的检测能力非常低，因为它们是依赖环境光的被动传感器。尽管图像传感器的夜间性能有所提高，但它们在三种传感器类型中的性能最低。
4. **在雨、雪、雾中的稳健性** ：雷达传感器的最大优势之一是它们在恶劣天气条件下的性能。它们不会受到雪、大雨或空气中的任何其他障碍物（如雾或沙粒）的显着影响。作为一种光学系统，激光雷达和相机容易受到恶劣天气的影响，其性能通常会随着逆境程度的增加而显着下降。
5. **物体分类** ：相机擅长对车辆、行人、速度标志等物体进行分类。这是相机系统的主要优势之一，人工智能的最新进展更加强调了这一点。具有高密度 3D 点云的激光雷达扫描也允许进行一定程度的分类，尽管对象多样性不如相机。雷达系统不允许进行太多的对象分类。
6. **感知二维结构** ：摄像头系统是唯一能够解释二维信息（如速度标志、车道标记或交通信号灯）的传感器，因为它们能够测量颜色和光强度。这是相机相对于其他传感器类型的主要优势。
7. **测量速度** ：雷达可以利用多普勒频移直接测量物体的速度。这是雷达传感器的主要优势之一。激光雷达只能通过使用连续的距离测量来近似速度，这使得它在这方面不太准确。相机即使无法测量距离，也可以通过观察图像平面上物体的位移来测量碰撞时间。本课程稍后将使用此属性。
8. **系统成本** ：近年来，雷达系统已广泛用于汽车行业，目前的系统非常紧凑且价格适中。单色相机也是如此，在大多数情况下价格远低于 100 美元。由于硬件成本增加和市场上单位数量明显减少，立体相机更加昂贵。激光雷达在过去几年中越来越受欢迎，尤其是在汽车行业。由于技术进步，其成本已从 75,000 多美元降至 5,000 美元以下。许多专家预测，未来几年激光雷达模块的成本可能会降至 500 美元以下。
9. **封装尺寸** ：雷达和单摄像头都可以很好地集成到车辆中。立体摄像头在某些情况下体积庞大，这使得将它们集成到挡风玻璃后面变得更加困难，因为它们有时可能会限制驾驶员的视野。激光雷达系统有各种尺寸。360° 扫描激光雷达通常安装在屋顶顶部，因此非常清晰可见。行业转向更小的固态激光雷达系统将在不久的将来显着缩小激光雷达传感器的系统尺寸。
10. **计算要求** ：激光雷达和雷达几乎不需要后端处理。虽然相机是一种经济高效且易于使用的传感器，但它们需要进行大量处理才能从图像中提取有用信息，这会增加整体系统成本。

![1681911669571](image/LearningNotes/1681911669571.png)

![1681911718707](image/LearningNotes/1681911718707.png)

![1681911733946](image/LearningNotes/1681911733946.png)

![1681911753424](image/LearningNotes/1681911753424.png)

##### 相机技术概述

在本节中，您将了解相机的基本属性。我们将从称为“针孔相机”的最基本模型开始，然后逐步使用镜头，这是相机系统的关键组件。您需要这些知识才能了解相机如何创建图像，其哪些属性会影响图像外观和质量，以及您必须考虑哪些参数才能成功地从这些图像中提取有意义的信息。

针孔相机

可以通过在感兴趣的物体之间放置一个带有微小开口（针孔）的光栅来设计一个非常简单的相机。物体发出的光通过针孔到达感光表面，感光表面将光信息存储为图像。之所以将针孔做得如此之小，是为了避免由于来自感兴趣对象的各个部分的光线叠加而导致图像模糊。

这个简单的原则几个世纪以来一直广为人知，例如，艺术家使用它来创作逼真的肖像。

![https://owlcation.com/humanities/Leonardo-da-Vincis-Camera-Obscura](http://127.0.0.1:8887/Part%2004-Module%2001-Lesson%2002_Autonomous%20Vehicles%20and%20Computer%20Vision/img/draggedimage.png)

https://owlcation.com/humanities/Leonardo-da-Vincis-Camera-Obscura

针孔相机模型的正式模型如下所示。

![](http://127.0.0.1:8887/Part%2004-Module%2001-Lesson%2002_Autonomous%20Vehicles%20and%20Computer%20Vision/img/draggedimage-1.png)

左边的感光面称为 *像面* ，而针孔称为 *相机中心* 。相机中心和图像平面之间的距离称为 *焦距 f* 。

感兴趣对象上的点 P 可以映射到图像平面上的点 P'，方法是通过投影中心投射光束，直到它到达图像平面，如下图所示。

![](http://127.0.0.1:8887/Part%2004-Module%2001-Lesson%2002_Autonomous%20Vehicles%20and%20Computer%20Vision/img/draggedimage-2.png)

在三维空间中，之间的关系�P和�‘P‘由以下等式表示：

![](http://127.0.0.1:8887/Part%2004-Module%2001-Lesson%2002_Autonomous%20Vehicles%20and%20Computer%20Vision/img/draggedimage-3.png)

基于这些方程，我们能够计算物体在图像平面上的 2D 位置，给定物体在空间中的 3D 位置以及相机的焦距。但是请注意，生成的坐标 x' 和 y' 是公制坐标，而不是像素位置。

针孔相机的问题是通过针孔的光量不足以在图像传感器上生成像样的图像。如果像下图那样通过加宽针孔开口来增加光量，来自目标物体其他部分的光线会相互叠加，导致模糊效果：针孔越大，越亮图像，但同时，图像平面上物体的模糊会越严重。

![](http://127.0.0.1:8887/Part%2004-Module%2001-Lesson%2002_Autonomous%20Vehicles%20and%20Computer%20Vision/img/draggedimage-4.png)

解决此问题的一种方法是使用镜头，它能够捕获从感兴趣对象上的同一点发出的多条光线。接下来让我们看看镜头。

尺寸和位置适当的透镜会折射从空间中物体上的点 P1 发出的所有光线，使它们会聚到一个点�1个‘p1个‘的在图像平面中。穿过镜头中心的光线不会被折射，但是它们会继续保持直线直到与图像平面相交。

物体上较近或较远的点，例如�2个P2个的，在图像平面上看起来没有焦点，因为从它们发出的光线集不会会聚在一个点上，而是会聚在一个具有有限半径的圆上。这个模糊的圆圈通常被称为 *混乱圈（COF）* 。为减少模糊，可以使用光圈，这是一个通常可调节大小的同心开口，直接放置在镜头后面。下图说明了原理：

![](http://127.0.0.1:8887/Part%2004-Module%2001-Lesson%2002_Autonomous%20Vehicles%20and%20Computer%20Vision/img/draggedimage-5.png)

通过减小光圈的直径，在外边缘通过透镜的光线被阻挡，从而减小了像平面上的 COF 尺寸。很容易看出，较小的光圈会减少模糊，但会降低感光度。光圈越大，聚焦到图像区域的光线就越多，从而产生具有更好信噪比的更明亮的图像。

那么我们如何计算空间中的物体将出现在图像中的什么位置呢？给定一个空间中的 3D 点，它在通过镜头后在图像平面上的 2D 位置可以类似于针孔相机来计算。实际上，根据镜头类型，镜头会导致图像失真。与实践最相关的失真称为“径向失真”。这是由于镜头的焦距在其直径上不均匀造成的。因此，镜头的放大效果会根据相机中心（光轴）与穿过镜头的光线之间的距离而变化。如果放大倍数增加，所产生的失真效果称为“枕形失真”。如果它减小，则称为“桶形失真”。使用广角镜头时，通常会出现桶形畸变。

![](http://127.0.0.1:8887/Part%2004-Module%2001-Lesson%2002_Autonomous%20Vehicles%20and%20Computer%20Vision/img/rad027.png)

从相机图像中提取信息时，许多应用程序试图得出有关感兴趣对象（例如车辆）的空间位置的结论。为此，必须消除或至少减轻镜头的畸变效应。相关过程称为校准。对于每个相机镜头设置，必须执行 *校准程序，以便可以单独计算失真参数。* 这通常是通过拍摄一组众所周知的物体的照片来完成的，例如平面棋盘图案，从已知的几何形状中可以可靠地导出所有镜头和图像传感器参数。从相机图像中去除失真的过程称为 *校正* . 在下图中，显示了用于校正本课程中大部分图像的校准设置。很容易看出左右两边的线条都明显扭曲。

![](http://127.0.0.1:8887/Part%2004-Module%2001-Lesson%2002_Autonomous%20Vehicles%20and%20Computer%20Vision/img/0000000000.png)

然而，深入了解失真校正的细节超出了本课程的范围。您将使用的大多数图像都没有镜头失真。但是，当使用您自己的相机设置时，如果目标是精确测量和对象的空间重建，则必须执行校准程序。

*如前所述，3D 空间中的点在图像平面上的投影并不直接对应于我们在实际数字图像中看到的内容，这些图像由数千个图片元素*或*像素*组成。要了解图像如何以离散像素表示，我们需要再次仔细研究上述相机模型。在下图中，相机中心显示了一个位置欧欧在空间中以及它自己的带轴的坐标系我我,�j和�k， 在哪里�k指向图像平面的方向。职位�‘C‘在哪里�k与图像平面相交的点称为主点，代表图像坐标系的中心。

投影点后的第一步�P因此，在图像平面上的空间中减去主点坐标，以便离散图像具有其自己的坐标系，例如以图像平面的左下角为中心

![](http://127.0.0.1:8887/Part%2004-Module%2001-Lesson%2002_Autonomous%20Vehicles%20and%20Computer%20Vision/img/draggedimage-6.png)

转换过程的第二步是从公制坐标转换为像素坐标。为此，我们可以使用参数�k和升升由将米转换为像素的校准程序提供，并且可以很容易地集成到投影方程中，如下所示。请注意，在图像坐标中，y 轴的原点位于左上角并指向下方。

在本课程的后面部分，我们将把激光雷达 3D 点映射到相机图像中。为此，我们将使用这些方程式。具体来说，焦距的乘积�F和�k和升升 分别（也称为 alpha 和 beta）将用于校准矩阵以显着简化映射操作。

关于图像校正的最后一个注意事项：在许多应用程序（例如特征跟踪）中，当计算校正图像并且转换后的像素没有恰好落在校正图像中离散像素的中心时，处理原始图像以避免插值错误是有意义的图像但靠近另一个像素的边界。在这种情况下，建议在未修改的原始图像中定位特征，然后使用上述等式转换结果坐标。当使用基于一组训练权重的深度学习时，在将图像提供给网络之前首先纠正图像是有意义的——如果我们使用原始图像，失真（例如来自鱼眼镜头）将导致检测错误，因为网络通常是在无失真图像集上训练的。

##### Imagers and Bayer Pattern

在最后一节中，您将了解特定波长的光线如何转换为可以数字存储的彩色像素。

当相机拍摄图像时，光线穿过镜头并落在图像传感器上。该传感器由光敏元件组成，这些元件记录落在其上的光量并将其转换为相应数量的电子。光越多，产生的电子就越多。曝光时间结束后，产生的电子将转换为电压，最后通过 A/D 转换器转换为离散数。

目前，主要有两种图像技术，即CCD（电荷耦合器件）和CMOS（互补金属氧化物半导体）。这两种技术都将电子转换为电压，并且本质上是色盲的，因为它们无法区分产生电子的不同波长。为了实现色觉，微小的滤光元件（也称为微透镜）被放置在每个像素的前面，只允许特定波长通过。将波长映射到颜色的一种常见方法是以 RGB（红、绿、蓝）模式排列滤光片元件，以允许原色单独通过，这为我们提供了三个单独的图像——每个原色一个。

![](http://127.0.0.1:8887/Part%2004-Module%2001-Lesson%2002_Autonomous%20Vehicles%20and%20Computer%20Vision/img/color-filter-array.png)

以不同的组合混合，RGB 值可以产生人眼可见的大部分颜色。当每个离散颜色值用 8 位编码（即 256 个值）时，可以使用 RGB 滤镜概念创建总共 1670 万种不同的颜色。排列 RGB 滤镜的最常见方式称为 *拜耳模式* ，其中交替排列着红-绿和绿-蓝滤光片。由于人眼对绿色比对红色或蓝色更敏感，因此拜耳阵列具有两倍数量的绿色滤光片。在计算机视觉应用程序中处理彩色图像时，所有三个 RGB 层都可用，必须决定使用哪些颜色层。如果处理能力有限，则将不同的通道组合成灰度图像。在接下来的计算机视觉部分，您将了解 OpenCV 计算机视觉库。您可以在此处查看方法*cvtColor*中使用的从 RGB 到灰度的转换公式： https: [//docs.opencv.org/3.1.0/de/d25/imgproc_color_conversions.html](https://docs.opencv.org/3.1.0/de/d25/imgproc_color_conversions.html)

CCD 与 CMOS

在*CCD 传感器*中，每个像素中收集的电子通过单个或仅几个输出节点从芯片传输。然后将电荷转换为电压电平、缓冲并作为模拟信号发送出去。然后使用传感器外部的 A/D 转换器将该信号放大并转换为离散数字。最初，CCD 技术与 CMOS 相比有几个优势，例如更高的感光度和更低的噪声。然而，近年来，这些差异几乎消失了。CCD 的主要缺点是生产价格较高和功耗较高（高达 CMOS 的 100 倍），这通常会导致相机出现发热问题。

CMOS*传感器*最初用于机器视觉应用，但由于感光度差，图像质量较差。然而，对于现代 CMOS 传感器，质量和感光度都有显着提高。CMOS 技术有几个优点： 与 CCD 不同，CMOS 芯片集成了放大器和 A/D 转换器，这带来了巨大的成本优势。对于 CCD，这些组件位于芯片外部。CMOS 传感器还具有更快的数据读出速度、更低的功耗、更高的抗噪性和更小的系统尺寸。在汽车应用中，由于这些优势，几乎所有相机都使用 CMOS 传感器。可以在此处找到用于记录本课程中大部分图像序列的相机设置：[http://www.cvlibs.net/datasets/kitti/setup.php](http://www.cvlibs.net/datasets/kitti/setup.php)

审查

现在您应该了解从感兴趣的物体（例如行人）折射的光在通过镜头后如何进入图像传感器并最终转换为离散颜色值，可以由计算机视觉算法。让我们通过一个小测验来测试您的知识，然后我们继续下一节，这是关于操作和解释这些像素的基本操作。

##### 04. MBRDNA的相机技术

##### OpenCV 计算机视觉库

在本课程中，您将使用 OpenCV [，](https://opencv.org/)它是一个跨平台计算机视觉库，最初于 2000 年开发，旨在为计算机视觉应用程序提供通用基础设施，并加速机器视觉在科学和工程项目中的使用. 这个开源库最初由英特尔创立，现在得到了全球多家公司和数百名专家的支持。

![](http://127.0.0.1:8887/Part%2004-Module%2001-Lesson%2002_Autonomous%20Vehicles%20and%20Computer%20Vision/img/opencv-logo-with-text-svg-version.svg.png)

该库拥有 2500 多种算法，可用于检测和识别人脸、识别物体、对视频中的人类行为进行分类、跟踪摄像机运动、跟踪移动物体、执行机器学习等等。OpenCV 是用 C++ 编写的，但也有 Python、Java 和 Matlab 的接口。在本课程中，您将使用 C++ 版本的 OpenCV。

使用 OpenCV 库的主要优势是您将能够利用一组经过良好测试的最先进的计算机视觉算法。无需专注于 Sobel 算子、关键点检测或机器学习等计算机视觉概念的实际实施，您可以开箱即用并专注于以正确的方式组合它们以开发工作软件原型。然而，尽管使用起来很方便，但要正确使用它们，还需要很好地理解这些概念背后的理论。

在下文中，您将熟悉一些开始使用 OpenCV 所需的基本概念，并为课程后面的更高级课程做好准备。下面列出的库将在整个讲座中广泛使用。然而，它们只是整个 OpenCV 的一小部分。稍后，您还将包括一些专门的库，例如 *flann* （近似最近邻的快速库）或 *dnn* （深度神经网络），它们将仅在本课程中使用它们的部分进行描述。

关于命名空间的注意事项：大多数 OpenCV 函数都存在于*cv*命名空间中。通常，为了缩短代码，在许多应用程序中使用*using namespace cv*命令。然而，在本课程中，当我们使用来自 OpenCV 的函数调用时，并没有这样做以明确说明。

##### OpenCV 库概述

核心模块是包含所有基本对象类型及其操作的库部分。要在您的代码中使用该库，必须包含以下标头：

```cpp
#include "opencv2/core/core.hpp"
```

*highgui*模块包含可用于显示图像或进行简单用户输入的用户界面函数。要在您的代码中使用该库，必须包含以下标头：

```cpp
#include "opencv2/highgui/highgui.hpp"
```

在这个项目中，基本功能如 `cv::imshow`将用于在窗口中显示图像。

imgproc （图像处理）模块包含对图像*的*基本变换，例如图像过滤、几何变换、特征检测和跟踪。要在您的代码中使用该库，必须包含以下标头：

```cpp
#include "opencv2/imgproc/imgproc.hpp"
```

*features2d*模块包含用于检测、描述和匹配图像之间关键点的算法。要在您的代码中使用该库，必须包含以下标头：

```cpp
#include "opencv2/features2d/features2d.hpp"

```

##### OpenCV 矩阵数据类型

OpenCV 中用于存储和操作图像的基本数据类型是 `cv::Mat datatype`. 它可用于任意维数的数组。中存储的数据 `cv::Mat`以所谓的 `raster scan order`. 对于二维数组（如灰度图像），这意味着数据被组织成行，每一行一个接一个地出现。一个三维数组（如彩色图像）按平面排列，每个平面逐行填充，然后平面一个接一个地填充。`cv::Mat`要了解这是如何工作的，让我们更深入地研究数据类型：

变量中的数据 `cv::Mat`可以是单个数字或多个数字。在多个数字的情况下（例如用 表示 `cv::Scalar`），矩阵被称为多通道阵列。有几种方法可以创建和初始化 `cv::Mat`变量。下面工作区中的文件 `create_matrix.cpp`说明了如何完成此操作的一种方法。

 **注意：** 要构建和运行下面的代码，请使用以下步骤：

1. 确保 `GPU`已启用并单击按钮转到虚拟桌面 `Desktop`。您可以使用 Terminator 或 VSCode 终端运行以下命令：
2. 从 `/home/workspace/OpenCV_exercises`目录中，运行命令：`mkdir build && cd build`
3. `cmake ..`
4. `make`
5. 使用以下命令运行 `create_matrix`可执行文件 `build`：`./create_matrix`

在代码示例中，创建的变量*m18u*具有 480 行和 640 列，颜色深度为 8 位作为无符号字符和单个通道（因此为 _8UC1）。然后，将整个图像设置为 8 位最大值 255，对应白色。该函数 `cv::imshow`在屏幕上显示图像。当您执行代码时，您应该会看到一个白色图像出现在屏幕上的一个窗口中。

OpenCV 中的矩阵也可以用三个通道来表示颜色。

 **这是给你的一个小任务** ：在 `create_matrix.cpp`文件中，创建一个类型为 `cv::Mat`name的变量 `m3_8u`，它具有三个通道，每个通道的深度为 8 位。然后，使用数据类型将第一个通道设置为 255 `cv::Scalar`并显示结果。如果遇到困难，可以使用[此处的文档。](https://docs.opencv.org/4.1.0/d6/d6d/tutorial_mat_the_basic_image_container.html)

操作矩阵

现在您可以创建矩阵，让我们尝试更改它们的一些条目：通过使用命令，`cv::Mat::at<data type>(row, col) = data`可以用数据替换给定位置的元素。请注意，您提供给 -function 的数据类型 `at`必须与存储在您尝试访问的矩阵中的实际数据相匹配。

 **这是给您的另一个小任务** ：在 `change_pixels.cpp`文件中，编写一个嵌套循环，在下面的示例中遍历矩阵的整个宽度。然后，将每个元素设置为 255。请特别注意为给定格式选择正确的数据类型。结果图像是什么样的？

 **注意：** 您可以使用与上述相同的步骤为此任务构建和运行代码，除了本练习之外，可执行文件将命名为 `change_pixels`.

![来自“change_pixels.cpp”文件的代码](http://127.0.0.1:8887/Part%2004-Module%2001-Lesson%2002_Autonomous%20Vehicles%20and%20Computer%20Vision/img/draggedimage-1.png)

change_pixels.cpp文件中的代码

加载和处理图像

接下来我们要做的是从文件中加载图像。让我们假设图像与可执行文件位于同一路径中。通过调用 `cv::imread`我们可以从文件中加载图像并将其分配给一个 `cv::Mat`变量。查看以下代码示例，了解如何从文件加载单个图像。您可以像上面那样构建代码，并且可以使用可执行文件从虚拟桌面运行代码 `load_image_1`。

![load_image_1.cpp</code></code></code></code></code></code></code></code> 文件中的代码](http://127.0.0.1:8887/Part%2004-Module%2001-Lesson%2002_Autonomous%20Vehicles%20and%20Computer%20Vision/img/draggedimage-2.png)

load_image_1.cpp文件中的代码

假设代码目录中总共有 5 张图像 (img0005.png - img0009.png) ，使用字符串连接可以很容易地从文件中一个接一个地读取它们。下一个示例展示了如何使用字符串连接和 setfill 函数轻松地从单个元素组装文件名，这确保在将循环变量附加到文件名之前将前置零添加到循环变量中。您可以使用可执行文件运行下一个示例 `load_image_2`。

![load_image_2.cpp</code></code></code></code></code></code></code></code> 文件中的代码](http://127.0.0.1:8887/Part%2004-Module%2001-Lesson%2002_Autonomous%20Vehicles%20and%20Computer%20Vision/img/draggedimage-3.png)

load_image_2.cpp文件中的代码

在课程的后面，我们将一个接一个地加载和处理多张图像。以巧妙的方式处理大量数据非常重要，这样图像和其他结构就不会被不必要地复制。此外，我们希望灵活地重新排列数据以及定期删除和添加元素。在 C++ 中，这可以通过使用向量轻松实现。在下面的代码中，一组图像像以前一样从文件中加载并推送到类型为 的动态列表中 `vector<cv::Mat>`。然后，使用迭代器遍历列表并一张一张地显示加载的图像。

您可以使用可执行文件运行下面的代码 `load_image_3`。

![load_image_3.cpp</code></code></code></code></code></code></code></code> 文件中的代码](http://127.0.0.1:8887/Part%2004-Module%2001-Lesson%2002_Autonomous%20Vehicles%20and%20Computer%20Vision/img/draggedimage-4.png)

load_image_3.cpp文件中的代码

关键字 `auto`只是要求编译器从初始化中推导出变量的类型，这比 `vector<cv::Mat>::iterator it`直接写要方便得多。可以使用表达式访问循环内的当前图像 `*it`。

 **这是给你的最后一个练习** ：在 的循环中 `load_image_3.cpp`，防止显示编号为 7 的图像。

#### 第 03 课：设计碰撞检测系统

##### 碰撞检测基础

碰撞检测问题

 *防撞系统* ( CAS) 是一种主动安全功能，可在即将与行驶路径中的物体发生碰撞时警告驾驶员甚至触发制动。如果前方车辆存在，CAS 会持续估算碰撞时间 (TTC)。当 TTC 低于较低的阈值时，CAS 可以决定警告驾驶员即将发生的危险，或者 - 根据系统 - 自动应用车辆制动器。对于您将在本课程中完成的工程任务，这意味着您需要找到一种方法来计算前方车辆的 TTC。

让我们看看下面的场景：

![](http://127.0.0.1:8887/Part%2004-Module%2001-Lesson%2003_Engineering%20a%20Collision%20Detection%20System/img/draggedimage.png)

在这种交通场景中，绿色车辆开始减速吨0吨0的，这是装有碰撞传感器的黄色车辆进行距离测量时�0d0的. 片刻之后，时间吨1个吨1个的，绿色车辆相当接近，第二次测量�1个d1个的被采取。现在的目标是计算剩余的 TTC，以便系统可以警告黄色车辆的驾驶员，甚至自动触发刹车。

然而，在我们这样做之前，我们需要找到一种方法来用数学模型来描述车辆的相对运动。

##### 恒定速度与恒定加速度

为了计算 TTC，我们需要对前车的物理行为做出假设。一种假设是上图中黄色和绿色车辆之间的相对速度是恒定的。这将导致所谓的 *恒速模型* （CVM），由等式表示。1 在下图中。

![](http://127.0.0.1:8887/Part%2004-Module%2001-Lesson%2003_Engineering%20a%20Collision%20Detection%20System/img/draggedimage-1.png)

如您所见，瞬间到车辆的距离吨+△吨吨+Δt _比当时小吨吨，因为我们减去恒定相对速度的乘积�0v0的和时间△吨Δt _. 从工程的角度来看，我们需要一个传感器能够精确地测量与前面车辆的距离，并且测量之间的 dt 是恒定的。这可以很好地通过例如激光雷达传感器来实现。

尤其是在车辆急刹车的动态交通情况下，CVM 不够准确，因为两辆车之间的相对速度在测量之间会发生变化。在下图中，接近的车辆在三个时刻以增加的速度显示。

![](http://127.0.0.1:8887/Part%2004-Module%2001-Lesson%2003_Engineering%20a%20Collision%20Detection%20System/img/draggedimage-2.png)

因此，我们可以通过假设速度是时间的函数并减去等式中的第二项来扩展我们的 CVM。2 是恒定加速度与两次测量之间的平方时间 dt 的乘积。当量。图 3 将速度显示为时间的函数，这也取决于我们在方程式中使用的恒定加速度。2. 该模型被称为 *恒定加速度模型* (CAM)，通常用于商用碰撞检测系统。附带说明一下，如果我们使用雷达传感器而不是激光雷达，则可以通过利用多普勒效应引起的返回电磁波中的频移来直接测量速度。与激光雷达等传感器相比，这是一个显着优势，后者只能根据（嘈杂的）距离测量来计算速度。

在本课程中，我们将使用 CVM 而不是 CAM，因为它在涉及的数学方面以及您面前的编程任务的复杂性方面处理起来要简单得多。对于 dt 的小实例，我们将假设 CVM 模型足够准确，并且它将为我们提供对 TTC 的合理估计。但是，如果您在职业生涯的后期参与构建此类系统的商业版本，请记住您应该改用恒定加速模型。

![1681996490334](image/LearningNotes/1681996490334.png)

##### 02. 用激光雷达估算TTC

碰撞时间 (TTC) 背后的数学原理

在下文中，让我们假设配备 CAS 的车辆正在使用激光雷达传感器对前方车辆进行距离测量。此场景中的传感器将为我们提供到驾驶路径中最近的 3D 点的距离。在下图中，最近点由 CAS 车辆顶部的激光雷达传感器发出的红线表示。

![](http://127.0.0.1:8887/Part%2004-Module%2001-Lesson%2003_Engineering%20a%20Collision%20Detection%20System/img/draggedimage.png)

基于我们在上一节中讨论的恒速模型，速度�0v0的可以从两个连续的激光雷达测量值计算如下：

![](http://127.0.0.1:8887/Part%2004-Module%2001-Lesson%2003_Engineering%20a%20Collision%20Detection%20System/img/draggedimage-1.png)

一旦相对速度�0v0的已知，碰撞时间可以很容易地通过将两辆车之间的剩余距离除以�0v0的. 因此，如果激光雷达传感器能够进行精确的距离测量，则可以基于 CVM 和上述方程组开发 TTC 估计系统。但是请注意，雷达传感器将是 TTC 计算的最佳解决方案，因为它可以直接测量相对速度，而对于激光雷达传感器，我们需要计算�0v0的来自两个（嘈杂的）距离测量。

准备激光雷达点云

下图显示激光雷达点云叠加在高速公路场景中拍摄的相机图像上，前面的车辆直接在行驶路径上。到传感器的距离用颜色编码（绿色代表远，红色代表近）。在左侧，还显示了激光雷达点的鸟瞰图。

![](http://127.0.0.1:8887/Part%2004-Module%2001-Lesson%2003_Engineering%20a%20Collision%20Detection%20System/img/ebene.jpg)

可以很容易地看出，激光雷达传感器提供对车辆和路面的测量。此外，与周围的邻居相比，相机图像中的某些 3D 点似乎并不准确。特别是前车车顶附近的点与尾门上的点颜色不同。

由于测量精度与从物体反射的光量相关，因此除了 x、y 和 z 坐标外，还需要考虑我们可以访问的每个激光雷达点的反射率 r。下图以绿色突出显示高反射率，而低反射率区域显示为红色。对点云相关反射率的分析表明，这种偏差通常发生在反射率降低的区域。

![](http://127.0.0.1:8887/Part%2004-Module%2001-Lesson%2003_Engineering%20a%20Collision%20Detection%20System/img/draggedimage-2.png)

为了从给定的点云中导出稳定的 TTC 测量值，必须执行两个主要步骤：

1. 删除路面上的测量值
2. 去除低反射率的测量

在下图中，激光雷达点以俯视图显示，并在应用过滤后显示为图像叠加层。以这种方式移除激光雷达点后，现在可以更容易地推导出与前车的距离 d(t)。

![](http://127.0.0.1:8887/Part%2004-Module%2001-Lesson%2003_Engineering%20a%20Collision%20Detection%20System/img/pfeile.jpg)

在后面的课程中，您将学习如何将激光雷达点投影到相机图像中，以及如何执行上述示例中所示的移除过程。现在，让我们假设对于每个时间步长 dt，激光雷达传感器将返回与前车的距离 d(t+dt)。

从距离测量计算 TTC

在本课程的代码示例中，激光雷达点被打包到一个名为 LidarPoints 的数据结构中。如下图所示，该结构由公制坐标中的点坐标 x（向前）、y（左）和 z（向上）以及 0 到 1 之间的点反射率 r（高反射率）组成。

```cpp
struct LidarPoint { // single lidar point in space
    double x, y, z; // point position in m
    double r; // point reflectivity in the range 0-1
};
```

为了计算 TTC，我们需要找到到行驶路径中最近的激光雷达点的距离。在下图中，位于前车尾门的激光雷达测量值有时会被测量到吨0吨0的（绿色）和吨1个吨1个的（红色的）。可以看出，到车辆的距离在两个时刻之间略微减小。

![](http://127.0.0.1:8887/Part%2004-Module%2001-Lesson%2003_Engineering%20a%20Collision%20Detection%20System/img/new-group.jpg)

下面的代码在与关联的点云中搜索最近的点吨0吨0的( `lidarPointsPrev`) 并且在与关联的点云中吨1个吨1个的( `lidarPointsCurr`). 在分别找到到最近点的距离后，TTC 是根据我们在本节开头推导出的公式计算出来的。

```cpp
oid computeTTCLidar(std::vector<LidarPoint> &lidarPointsPrev, 
                     std::vector<LidarPoint> &lidarPointsCurr, double &TTC)
{
    // auxiliary variables
    double dT = 0.1; // time between two measurements in seconds

    // find closest distance to Lidar points 
    double minXPrev = 1e9, minXCurr = 1e9;
    for(auto it=lidarPointsPrev.begin(); it!=lidarPointsPrev.end(); ++it) {
        minXPrev = minXPrev>it->x ? it->x : minXPrev;
    }

    for(auto it=lidarPointsCurr.begin(); it!=lidarPointsCurr.end(); ++it) {
        minXCurr = minXCurr>it->x ? it->x : minXCurr;
    }

    // compute TTC from both measurements
    TTC = minXCurr * dT / (minXPrev-minXCurr);
}
```

尽管激光雷达是一种可靠的传感器，但仍可能发生错误测量。如上图所示，少量点位于尾门后方，看似与车辆无关。在搜索最近点时，此类测量会带来问题，因为估计的距离太小。有一些方法可以通过对点云进行后处理来避免此类错误，但不能保证在实践中永远不会出现此类问题。因此，对 minXCurr 和 minXPrev 执行更稳健的计算是一个好主意，它能够处理一定数量的异常值（在最终项目中，您将这样做）并且还可以查看第二个能够计算的传感器TTC，例如相机。

在下面的工作区中，扩展上面显示的函数 `computeTTCLidar`，以便在最小搜索期间仅考虑宽度由变量 laneWidth 定义的狭窄走廊内的激光雷达点。走廊的宽度应设置为 4 米。

您可以通过 `build`在 `TTC_lidar`. 然后从目录中使用以下步骤 `build`：

1. `cmake ..`
2. `make`
3. `./compute_ttc_lidar`

##### 03.用相机估算TTC

无距离测量TTC

单目相机无法测量公制距离。它们是无源传感器，依赖于从物体反射到相机镜头的环境光。因此无法像激光雷达技术那样测量光的运行时间。

要测量距离，需要第二个摄像头。给定两个仔细对齐的相机（也称为 *立体设置* ）同时拍摄的两张图像，我们必须在两张图像中找到共同的兴趣点（例如前车的尾灯），然后使用三角测量它们的距离相机几何和透视投影。多年来，汽车研究人员开发了用于 ADAS 产品的立体摄像头，其中一些产品已经上市。特别是梅赛德斯-奔驰开创了这项技术，可以在这里找到大量信息：[http ://www.6d-vision.com/](http://www.6d-vision.com/). 然而，随着更先进的 ADAS 产品和自动驾驶汽车的出现，立体相机因其封装尺寸、高价格和寻找相应特征的高计算负荷而开始从市场上消失。

尽管单摄像头存在这些限制，但让我们看看是否有一种无需测量距离即可计算 TTC 的方法。让我们考虑一下我们在本课程的前一节中介绍的恒速运动模型，并考虑一种方法来用相机可以可靠测量的东西代替度量距离 d，例如直接在图像平面上的像素距离。在下图中，您可以看到高度�H可以使用透视投影将前车的位置映射到图像位置。我们可以看到同样的高度�H映射到不同的高度�0H0的和�1个H1个的在图像平面中，取决于距离�0d0的和�1个d1个的车辆的。很明显，两者之间存在几何关系�H,�H,�d和焦距�F针孔相机——这就是我们接下来要利用的。

![](http://127.0.0.1:8887/Part%2004-Module%2001-Lesson%2003_Engineering%20a%20Collision%20Detection%20System/img/draggedimage%20(2).png)

让我们看一下下面的一组方程：

![](http://127.0.0.1:8887/Part%2004-Module%2001-Lesson%2003_Engineering%20a%20Collision%20Detection%20System/img/draggedimage-1%20(2).png)

在 (1) 中，我们使用相机的焦距和距离测量�0d0的在时间执行吨0吨0的投影高度�H车辆在图像平面上，从而达到一个高度�0H0的以像素为单位。时间也是一样吨1个吨1个的, 导致预计高度�1个H1个的.

在（2）中，我们计算相对高度的比率�0H0的和�1个H1个的. 既�H和�F被抵消了，我们可以观察到相对高度之间的直接关系�H和绝对公制距离�d. 因此我们可以表达到车辆的距离�0d0的作为产品�1个d1个的以及图像平面上的相对高度比。

在（3）中，我们代入�0d0的在等速方程中求解�1个d1个的，现在取决于恒定的相对速度�0v0的, 在测量之间的时间�0d0的和�1个d1个的以及图像平面上的相对高度比。

在 (4) 中，TTC 计算为剩余距离与撞击的比率，即�1个d1个的, 和恒定速度�0v0的. 我们可以很容易地看到，TTC 现在只包含△吨Δt _,�0H0的和�1个H1个的. 因此，可以通过观察图像传感器上的相对高度变化来测量碰撞时间。不需要距离测量，因此我们可以使用单相机通过直接观察图像中相对高度的变化（也称为 *比例变化* ）来估计碰撞时间。

边界框检测的问题

在下图中，神经网络已用于在单目相机的连续图像中定位车辆。对于每辆车，网络返回一个边界框，其宽度和/或高度原则上可用于计算我们在上一节中导出的 TTC 方程中的高度比。

然而，当仔细观察时，可以看出边界框并不总是反映真实的车辆尺寸，并且图像之间的纵横比不同。因此，使用边界框高度或宽度进行 TTC 计算会导致显着的估计误差。

![](http://127.0.0.1:8887/Part%2004-Module%2001-Lesson%2003_Engineering%20a%20Collision%20Detection%20System/img/new-group%20(2).jpg)

在大多数工程任务中，依靠单一的测量或属性是不够可靠的。对于与安全相关的产品尤其如此。因此，我们要考虑我们是否可以在图像中观察到车辆和物体的其他属性。

改用纹理关键点

现在，我们不再依赖于对车辆的整体检测，而是希望在更小的范围内分析其结构。如果有可能找到可以从一帧到下一帧跟踪的唯一可识别关键点，我们可以使用车辆上所有关键点之间的相对距离来计算 TTC 方程中高度比的稳健估计。下图说明了这个概念。

![](http://127.0.0.1:8887/Part%2004-Module%2001-Lesson%2003_Engineering%20a%20Collision%20Detection%20System/img/new-group-1.jpg)

在 (a) 中，检测到一组关键点，并计算出关键点 1-7 之间的相对距离。*在 (b) 中，使用称为描述符*的高维相似性度量（下一课将详细介绍）在连续图像之间匹配了 4 个关键点（关键点 3 不匹配） 。通过替换高度比，可以使用彼此之间所有相对距离的比率来计算可靠的 TTC 估计�1个/�0H1个的/小时0的与所有距离比的平均值或中值��/��‘dk的/天k‘的.

下图显示了几个关键点之间的相对距离示例，作为高速公路驾驶场景的叠加层（仅突出显示了前面的车辆）。

![](http://127.0.0.1:8887/Part%2004-Module%2001-Lesson%2003_Engineering%20a%20Collision%20Detection%20System/img/draggedimage-2%20(2).png)

从相对关键点距离计算 TTC

在本课程的代码示例中，图像之间的匹配关键点被打包到一个名为 `cv::DMatch`. 我们将在本课程中使用的结构元素是 `queryIdx`，它是当前帧中关键点的索引，以及 `trainIdx`，它是前一帧中匹配关键点的索引。

所有匹配的关键点都存储在一个动态列表中，然后将其传递给一个名为 的函数 `computeTTCCamera`，该函数返回场景中每个对象的碰撞时间。下面让我们来看看这个函数。

想象一下包含大量不匹配的两个连续帧之间的一组关联关键点。在我们刚才讨论的函数中计算平均距离比可能会导致 TTC 计算错误。计算具有离群值的数据集的平均值的更稳健的方法是使用中位数代替。在下面的代码中，替换 `meanDistRatio`为一个变量 `medianDistRatio`，并且不要忘记考虑 vector 中的偶数和奇数个值 `distRatios`。

##### 04.课程结构

TTC

![1681997733134](image/LearningNotes/1681997733134.png)

![1681997899435](image/LearningNotes/1681997899435.png)

![1681997988467](image/LearningNotes/1681997988467.png)

![1681998257289](image/LearningNotes/1681998257289.png)

##### 05.早期融合与晚期融合

- 融合算法和访问相机，雷达，激光雷达的原始数据，并将所有的内容一起处理以及产生一个最后的输出
- 在后融合中，每一个传感器基本上都先自己尽力而为
- 

#### 第 04 课_跟踪图像特征

##### 01.强度梯度和过滤

定位图像中的关键点

正如上一课所讨论的，相机无法直接测量到物体的距离。然而，对于我们的防撞系统，我们可以根据图像传感器上的相对距离比来计算碰撞时间。为此，我们需要图像平面上的一组位置，这些位置可以作为稳定的锚点来计算它们之间的相对距离。本节讨论如何定位此类锚点位置 - 或图像中的*关键点。*

看看下图中的三个补丁，它们是从高速公路驾驶场景的图像中提取的。网格显示各个像素的边界。您将如何描述那些可以用作关键点的补丁中有意义的位置？

![](http://127.0.0.1:8887/Part%2004-Module%2001-Lesson%2004_Tracking%20Image%20Features/img/new-group.jpg)

在最左边的补丁中，亮像素和暗像素之间存在明显的对比，类似于从左下角到右上角的一条线。中间的补丁类似于由左上角的一组非常暗的像素形成的角。最右边的补丁看起来像一个明亮的斑点，可以近似为一个椭圆。

为了精确定位图像中的关键点，我们需要一种方法在 x 和 y 中为它们分配一个唯一的坐标。并非所有上述补丁都有助于实现这一目标。角和椭圆都可以在 x 和 y 中准确定位，最左边图像中的线不能。

![](http://127.0.0.1:8887/Part%2004-Module%2001-Lesson%2004_Tracking%20Image%20Features/img/new-group-kopieren.jpg)

因此，在下文中，我们将专注于检测图像中的角点。在后面的部分中，我们还将研究针对类似 blob 的结构进行优化的检测器，例如***SIFT*检测器**。

强度梯度

在上面的示例中，相邻像素之间的对比度包含我们需要的信息：为了精确定位例如中间块中的角，我们不需要知道它的颜色但我们需要形成像素之间的颜色差异角尽可能高。一个理想的角落将只包含黑色和白色像素。

下图显示了图像中沿红线的所有像素的强度分布以及强度梯度，它是图像强度的导数。
![改编自 https://cs.brown.edu/courses/cs143/lectures_Fall2017/07_Fall2017_EdgeDetection.pdf](http://127.0.0.1:8887/Part%2004-Module%2001-Lesson%2004_Tracking%20Image%20Features/img/intensity-and-derivative.jpg)

改编自https://cs.brown.edu/courses/cs143/lectures_Fall2017/07_Fall2017_EdgeDetection.pdf

可以看出，在相邻像素之间的对比度显着变化的位置处，强度分布迅速增加。左侧路灯下部和暗门与光墙呈现出明显的强度差异。如果我们想为发生变化的像素分配唯一坐标，我们可以通过查看强度的导数来实现，这是您可以在红线下方看到的蓝色渐变曲线。图像强度的突然变化在梯度剖面中清晰可见，表现为明显的峰谷。如果我们不仅要从左到右而且要从上到下寻找这样的峰，我们可以寻找在水平和垂直方向上都显示梯度峰的点，并选择它们作为具有 x 和 y 坐标的关键点。

基于上述观察，关键点检测的第一步是计算梯度图像。在数学上，梯度是图像强度在 x 和 y 方向上的偏导数。下图显示了三个示例补丁的强度梯度。梯度方向由箭头表示。

![](http://127.0.0.1:8887/Part%2004-Module%2001-Lesson%2004_Tracking%20Image%20Features/img/draggedimage.png)

在等式 (1) 和 (2) 中，强度梯度近似为相邻像素之间的强度差异除以 x 和 y 方向上这些像素之间的距离。接下来，基于强度梯度向量，我们可以计算方向和幅度，如下式所示：

![](http://127.0.0.1:8887/Part%2004-Module%2001-Lesson%2004_Tracking%20Image%20Features/img/draggedimage-1.png)

有多种计算强度梯度的方法。最直接的方法是简单地计算相邻像素之间的强度差异。然而，这种方法对噪声极其敏感，在实践中应避免使用。在本节的后面，我们将研究一种经过充分验证的标准方法，即 **Sobel** 算子。

图像滤波器和高斯平滑

在我们进一步讨论梯度计算之前，我们需要考虑噪声，它存在于所有图像中（人工图像除外）并且随着光强度的增加而降低。为了抵消噪声，尤其是在低光条件下，必须在梯度计算之前对图像应用平滑算子。通常，高斯滤波器用于此目的，它在图像上移动并与其下方的强度值组合。为了正确地参数化滤波器，必须调整两个参数：

1. 标准偏差，它控制图像平面中滤波器的空间扩展。标准偏差越大，过滤器覆盖的区域越广。
2. 内核大小，它定义了中心位置周围有多少像素将有助于平滑操作。

下图显示了具有不同标准偏差的三个高斯滤波器内核。

![](http://127.0.0.1:8887/Part%2004-Module%2001-Lesson%2004_Tracking%20Image%20Features/img/jcuj2.png)

高斯平滑的工作原理是根据每个点的高斯曲线高度为每个像素分配周围像素的加权和。最大的贡献将来自中心像素本身，而来自周围像素的贡献将根据高斯曲线的高度及其标准偏差而减少。可以很容易地看出，当标准差较大时，中心位置周围像素的贡献会增加（左图）。

应用高斯滤波器（或任何其他滤波器）分四个连续步骤进行，如下图所示：

1. 创建具有所需属性的滤波器内核（例如高斯平滑或边缘检测）
2. 在内核中定义锚点（通常是中心位置）并将其放置在图像的第一个像素之上。
3. 计算内核系数与下方相应图像像素值的乘积之和。
4. 将结果放置到输入图像中内核锚点的位置。
5. 对整个图像上的所有像素重复该过程。

下图说明了逐行在图像上移动（黄色）滤波器核并将二维和的结果赋值的过程�(�,是)H ( x ,是）到每个像素位置。

![](http://127.0.0.1:8887/Part%2004-Module%2001-Lesson%2004_Tracking%20Image%20Features/img/draggedimage-2.png)

下图显示了用于高斯平滑的滤波器核。在 (a) 中，显示了 3D 高斯曲线，在 (b) 中，可以看到相应的离散滤波器内核具有与高斯曲线的最大值对应的中心锚点 (41)，并且值朝向边缘递减（大约）圆形。

![https://homepages.inf.ed.ac.uk/rbf/HIPR2/gsmooth.htm](http://127.0.0.1:8887/Part%2004-Module%2001-Lesson%2004_Tracking%20Image%20Features/img/b-corresponding-discrete-filter-kernel.jpg)

https://homepages.inf.ed.ac.uk/rbf/HIPR2/gsmooth.htm

以下代码使用该函数 `cv::filter2D`将上述滤镜应用于图像。运行代码并弄清楚为什么在应用平滑过滤器后输出图像看起来不像预期的那样。知道原因后，进行必要的更改并再次运行代码，直到看到稍微模糊的图像。您可以像以前一样使用 `cmake`和进行编译 `make`，并使用生成的可执行文件运行代码 `gaussian_smoothing`。

上面的代码是为了说明过滤器和高斯模糊的原理。然而，在您的项目中，您可以（并且应该）使用函数 cv::GaussianBlur，它可以让您轻松更改标准差而无需调整滤波器内核。

计算强度梯度

在稍微平滑图像以减少噪声的影响之后，我们现在可以计算图像在 x 和 y 方向上的强度梯度。在文献中，可以找到几种梯度计算方法。其中最著名的是 `Sobel`算子（1968 年提出），但还有其他几个，例如 `Scharr`针对旋转对称优化的算子。

Sobel 算子基于在水平和垂直方向上应用小的整数值滤波器。运算符是 3x3 内核，一个用于 x 方向的梯度，一个用于 y 方向的梯度。两个内核如下所示。

![](http://127.0.0.1:8887/Part%2004-Module%2001-Lesson%2004_Tracking%20Image%20Features/img/draggedimage-4.png)

在下面的代码中，Sobel 算子的一个内核应用于图像。请注意，它已转换为灰度以避免在每个颜色通道上计算运算符。`gradient_sobel.cpp`可以在上面桌面工作区的文件中找到此代码。您可以使用 `gradient_sobel`可执行文件运行代码。

```cpp
// load image from file
    cv::Mat img;
    img = cv::imread("./img1.png");

    // convert image to grayscale
    cv::Mat imgGray;
    cv::cvtColor(img, imgGray, cv::COLOR_BGR2GRAY);

    // create filter kernel
    float sobel_x[9] = {-1, 0, +1,
                        -2, 0, +2, 
                        -1, 0, +1};
    cv::Mat kernel_x = cv::Mat(3, 3, CV_32F, sobel_x);

    // apply filter
    cv::Mat result_x;
    cv::filter2D(imgGray, result_x, -1, kernel_x, cv::Point(-1, -1), 0, cv::BORDER_DEFAULT);

    // show result
    string windowName = "Sobel operator (x-direction)";
    cv::namedWindow( windowName, 1 ); // create window 
    cv::imshow(windowName, result_x);
    cv::waitKey(0); // wait for keyboard input before continuing
```

生成的渐变图像如下所示。可以看出，局部对比度强的区域（例如前车的投射阴影）会导致过滤后的图像中出现高值。

![](http://127.0.0.1:8887/Part%2004-Module%2001-Lesson%2004_Tracking%20Image%20Features/img/draggedimage-6.png)

请注意，在上面的代码中，只有小号�小号X的现在已经应用了滤镜内核，这就是投射阴影只在 x 方向上显示的原因。正在申请小号是小号是的图像产生以下结果：

![](http://127.0.0.1:8887/Part%2004-Module%2001-Lesson%2004_Tracking%20Image%20Features/img/draggedimage-7.png)

基于 x 和 y 中的图像梯度，根据本节开头的方程为每个像素位置计算包含梯度大小的图像。此外，在应用 Sobel 运算符之前应用不同级别的高斯模糊并比较结果。

您可以将 `magnitude_sobel.cpp`上面桌面工作区中的文件用于您的解决方案，然后 `make`，您可以使用可执行文件运行代码 `magnitude_sobel`。

结果应该看起来像这样，由于平滑，路面上的噪音几乎消失了：

![](http://127.0.0.1:8887/Part%2004-Module%2001-Lesson%2004_Tracking%20Image%20Features/img/draggedimage-9.png)

##### 02. Haris Corner Detection

当地的独特性措施

关键点检测的思想是检测图像中可以在两个坐标方向上精确定位的独特结构。如前一节所述，角落非常适合此目的。为了说明这一点，下图显示了一个图像块，它由颜色均匀的背景上的线条结构组成。红色箭头表示在这个方向上找不到唯一的位置。绿色箭头表示相反。可以看出，角是唯一可以在 x 和 y 中分配唯一坐标的局部结构。

![](http://127.0.0.1:8887/Part%2004-Module%2001-Lesson%2004_Tracking%20Image%20Features/img/draggedimage%20(2).png)

为了定位一个角，我们考虑当窗口的内容稍微移动时会发生怎样的变化。对于上图中的情况(a)，在红色窗口W的当前位置在任何坐标方向上都没有可测量的变化，而对于(b)，在垂直于边缘的方向上会有明显的变化，当向边缘的方向移动。在（c）的情况下，窗口内容将在任何坐标方向上发生变化。

通过算法定位角点的想法是找到一种方法来根据局部窗口W的位移来检测图像结构中具有显着变化的区域。通常，用于描述变化的数学上合适的度量是平方和differences (SSD)，它查看执行坐标偏移前后局部邻域中所有像素的偏差。下面的等式说明了这个概念。

![](http://127.0.0.1:8887/Part%2004-Module%2001-Lesson%2004_Tracking%20Image%20Features/img/draggedimage-1%20(2).png)

在将窗口 W 在 x 方向移动 u 并在 y 方向移动 v 后，该方程将 W 内所有像素在旧窗口位置和新窗口位置的平方差相加。在下文中，我们将使用一些数学变换从 SSD 的一般定义中推导出像素周围局部环境变化的度量。

第一步，根据定义乙(你,�)E (你,五）上面，我们首先做一个泰勒级数展开我(�+你,是+你)我（×+你，是+你）. 对于较小的 u 和 v 值，一阶近似就足够了，这导致以下表达式。

![](http://127.0.0.1:8887/Part%2004-Module%2001-Lesson%2004_Tracking%20Image%20Features/img/taylorseries.png)

图像强度的推导我我在 x 和 y 方向上，你已经在上一节中学到了一些东西——这只是强度梯度。从这一点开始，我们将使用上面显示的速记符号来表示梯度。

在第二步中，我们现在将插入近似表达式我(�+你,是+�)我（×+你，是+五）进入上面的SSD等式，它简化为以下形式：

![](http://127.0.0.1:8887/Part%2004-Module%2001-Lesson%2004_Tracking%20Image%20Features/img/draggedimage-3.png)

我们的数学变换的结果是一个矩阵�H, 现在可以方便地对其进行分析以定位局部窗口中的结构变化�W围绕每个像素位置你,�你，v在图像中。在文献中，矩阵�H通常称为协方差矩阵。

为此，它有助于可视化矩阵�H作为一个椭圆，其轴长和方向由其特征值和特征向量给出。从下图中可以看出，较大的特征向量指向最大强度变化的方向，而较小的特征向量指向最小变化的方向。所以为了识别角点，我们需要在图像中找到具有两个非常大的特征值的位置�H.

![](http://127.0.0.1:8887/Part%2004-Module%2001-Lesson%2004_Tracking%20Image%20Features/img/draggedimage-4%20(2).png)

在本课程中，我们将不深入讨论特征值的细节，而是通过一个简单的公式来计算它们�H:

![](http://127.0.0.1:8887/Part%2004-Module%2001-Lesson%2004_Tracking%20Image%20Features/img/draggedimage-5.png)

除了在梯度计算之前对图像进行平滑之外，Harris 检测器还使用了高斯窗口�(�,是)w ( x ,是）计算局部邻域周围强度梯度的加权和。这个邻域的大小在特征检测的上下文中称为尺度，它由高斯分布的标准差控制。

![](http://127.0.0.1:8887/Part%2004-Module%2001-Lesson%2004_Tracking%20Image%20Features/img/draggedimage-6%20(2).png)

可以看出，高斯窗口的尺度越大，下方对梯度和贡献的特征就越大。通过调整比例，我们可以控制我们能够检测到的关键点。

哈里斯角探测器

基于的特征值�H，最著名的角点检测器之一是哈里斯检测器。该方法计算以下表达式以得出每个像素位置的角响应度量，其中系数 k 是经验常数，通常在 k = 0.04 - 0.06 的范围内。

![](http://127.0.0.1:8887/Part%2004-Module%2001-Lesson%2004_Tracking%20Image%20Features/img/draggedimage-7%20(2).png)

根据本节介绍的概念，以下代码计算给定图像的角点响应并显示结果。

```cpp
    // load image from file
    cv::Mat img;
    img = cv::imread("./img1.png");

    // convert image to grayscale
    cv::Mat imgGray; 
    cv::cvtColor(img, imgGray, cv::COLOR_BGR2GRAY);

    // Detector parameters
    int blockSize = 2; // for every pixel, a blockSize × blockSize neighborhood is considered
    int apertureSize = 3; // aperture parameter for Sobel operator (must be odd)
    int minResponse = 100; // minimum value for a corner in the 8bit scaled response matrix
    double k = 0.04; // Harris parameter (see equation for details)

    // Detect Harris corners and normalize output
    cv::Mat dst, dst_norm, dst_norm_scaled;
    dst = cv::Mat::zeros(imgGray.size(), CV_32FC1 );
    cv::cornerHarris( imgGray, dst, blockSize, apertureSize, k, cv::BORDER_DEFAULT ); 
    cv::normalize( dst, dst_norm, 0, 255, cv::NORM_MINMAX, CV_32FC1, cv::Mat() );
    cv::convertScaleAbs( dst_norm, dst_norm_scaled );

    // visualize results
    string windowName = "Harris Corner Detector Response Matrix";
    cv::namedWindow( windowName, 4 );
    cv::imshow( windowName, dst_norm_scaled );
    cv::waitKey(0);
```

结果如下所示：像素越亮，哈里斯角点响应越高。

![](http://127.0.0.1:8887/Part%2004-Module%2001-Lesson%2004_Tracking%20Image%20Features/img/draggedimage-9%20(2).png)

为了定位角点，我们现在必须执行非极大值抑制以 (a) 确保我们在局部邻域中获得具有最大角点的像素，以及 (b) 防止角点彼此靠得太近整个图像的角落均匀分布。

您的任务是在 Harris 响应矩阵中定位局部最大值，并在每个最大值周围的局部邻域中执行**非最大值抑制 (NMS)**。结果坐标应存储在类型的关键点列表中 `vector<cv::KeyPoint>`。结果应如下所示，每个圆圈表示 Harris 角的位置。

![](http://127.0.0.1:8887/Part%2004-Module%2001-Lesson%2004_Tracking%20Image%20Features/img/draggedimage-10.png)

`cornerness_harris.cpp`您可以在下面桌面工作区的文件中编写代码。构建后，您可以使用生成的可执行文件运行代码 `cornerness_harris`。

##### 03. Overview of Popular Keypoint Detectors

光度和几何变化的不变性

在文献中（以及OpenCV库中），有大量的特征检测器（包括Harris检测器），我们可以选择。根据应检测的关键点类型和图像的属性，需要考虑相应检测器在光度和几何变换方面的鲁棒性。

在选择合适的关键点检测器时，我们需要考虑四种基本的变换类型：

1. 回转
2. 规模变化
3. 强度变化
4. 仿射变换

下图显示了视频序列 (a) 的帧 i 中的两个图像，它们在帧 i + n (b) 中经过了多次变换。

![](http://127.0.0.1:8887/Part%2004-Module%2001-Lesson%2004_Tracking%20Image%20Features/img/frame-transformations.jpg)

对于计算机视觉中使用的标准图像集之一的涂鸦序列（另见[http://www.robots.ox.ac.uk/~vgg/research/affine/）](http://www.robots.ox.ac.uk/~vgg/research/affine/))，我们可以观察到所有的变换上面列出的而对于高速公路序列，当关注前面的车辆时，帧 i 和 i+n 之间只有尺度变化和强度变化。

下面根据上述标准对Harris角点检测器进行简要评价。

旋转 R :

![](http://127.0.0.1:8887/Part%2004-Module%2001-Lesson%2004_Tracking%20Image%20Features/img/draggedimage%20(3).png)

强度变化：

![](http://127.0.0.1:8887/Part%2004-Module%2001-Lesson%2004_Tracking%20Image%20Features/img/draggedimage-1%20(3).png)

规模变化：

![](http://127.0.0.1:8887/Part%2004-Module%2001-Lesson%2004_Tracking%20Image%20Features/img/draggedimage-2%20(2).png)

总之，Harris 检测器在旋转和加性强度偏移下是稳健的，但对尺度变化、乘性强度偏移（即对比度变化）和仿射变换敏感。然而，如果有可能以某种方式修改哈里斯检测器，使其能够考虑物体比例的变化，例如，当前面的车辆接近时，它可能（尽管它的年龄），一个适合我们目的的检测器.

自动比例选择

为了以理想的比例检测关键点，我们必须知道（或找到）它们在图像中的各自尺寸并调整高斯窗口的大小�(�,是)w ( x ,是）如本节前面介绍的。如果关键点尺度未知或者图像中存在大小不等的关键点，则必须在多个尺度级别上连续执行检测。

![](http://127.0.0.1:8887/Part%2004-Module%2001-Lesson%2004_Tracking%20Image%20Features/img/draggedimage-3%20(2).png)

基于两个相邻级别之间标准偏差的增量，可能会多次检测到相同的关键点。这就提出了选择最能代表关键点的“正确”尺度的问题。

在 1998 年的一篇具有里程碑意义的论文中，Tony Lindeberg 发表了一种“使用自动尺度选择进行特征检测”的方法。在这篇论文中，他提出了一个函数�(�,是,秒��升电子)F ( x ,, _比例尺）_ _ _ _，可用于选择那些显示稳定最大值的关键点�F超过规模。规模�F最大化被称为各自关键点的“特征尺度”。

下图显示了这样的功能�F已经针对多个比例级别进行了评估，并显示出一个明显的最大值，可以将其视为圆形区域内图像内容的特征比例。

![改编自 具有自动尺度选择的特征检测。](http://127.0.0.1:8887/Part%2004-Module%2001-Lesson%2004_Tracking%20Image%20Features/img/scale-space-sunflower.jpg)

改编自具有自动比例选择的特征检测。

如何正确设计合适功能的细节�F然而，这不是本课程的重点。主要的收获是一个好的检测器能够根据其局部邻域的结构特性自动选择关键点的特征尺度。现代关键点检测器通常具有这种能力，因此在图像尺度的变化下具有鲁棒性

##### 流行的关键点检测器概述

Overview of Popular Keypoint Detectors

Keypoint detectors are a very popular research area and thus a large number of powerful algorithms have been developed over the years. Applications of keypoint detection include such things as object recognition and tracking, image matching and panoramic stitching as well as robotic mapping and 3D modeling. In addition to invariance under the transformations mentioned above, detectors can be compared for their detection performance and their processing speed.

The Harris detector along with several other "classics" belongs to a group of traditional detectors, which aim at maximizing detection accuracy. In this group, computational complexity is not a primary concern. The following list shows a number of popular classic detectors :

* 1988 Harris Corner Detector (Harris, Stephens)
* 1996 Good Features to Track (Shi, Tomasi)
* 1999 Scale Invariant Feature Transform (Lowe)
* 2006 Speeded Up Robust Features (Bay, Tuytelaars, Van Gool)

In recent years, a number of faster detectors has been developed which aims at real-time applications on smartphones and other portable devices. The following list shows the most popular detectors belonging to this group:

* 2006 Features from Accelerated Segment Test (FAST) (Rosten, Drummond)
* 2010 Binary Robust Independent Elementary Features (BRIEF) (Calonder, et al.)
* 2011 Oriented FAST and Rotated BRIEF (ORB) (Rublee et al.)
* 2011 Binary Robust Invariant Scalable Keypoints (BRISK) (Leutenegger, Chli, Siegwart)
* 2012 Fast Retina Keypoint (FREAK) (Alahi, Ortiz, Vandergheynst)
* 2012 KAZE (Alcantarilla, Bartoli, Davidson)

In this course, we will be using the Harris detector as well as the Shi-Tomasi detector (which is very similar to Harris) as representatives from the first group of "classic“ detectors. From the second group, we will be leveraging the OpenCV to implement the entire list of detectors.

![1682000560384](image/LearningNotes/1682000560384.png)

![1682000668103](image/LearningNotes/1682000668103.png)

锻炼

在我们在下一节详细介绍上述检测器之前，使用 OpenCV 库在已经实现的 Shi-Tomasi 检测器之外添加 FAST 检测器，并比较两种算法的（a）关键点数量，（ b) 关键点在图像上的分布和 (c) 处理速度。描述您的观察结果，特别关注前面的车辆。


##### 04. Gradient-based vs. Binary Descriptors


探测器和描述符

在我们详细介绍上一节中讨论的一些关键点检测器如何工作之前，让我们先看看我们面前的问题。我们的任务是在一系列图像中找到相应的关键点，我们可以使用这些关键点来计算前面物体（例如车辆）的 TTC。因此，我们需要一种基于某种相似性度量来稳健地将关键点分配给彼此的方法。在文献中，已经提出了各种各样的相似性度量（称为*描述符），并且在许多情况下，作者已经发布了一种用于关键点检测的新方法以及针对其关键点类型进行了优化的相似性度量。*

让我们在这一点上完善我们的术语：

* *关键点* （有时也称为兴趣点或显着点）检测器是一种算法，它根据函数的局部最大值从图像中选择点，例如我们在 Harris 检测器中看到的“角点”度量。
* *描述符*是一个值向量，它描述了关键点周围的图像块。有多种技术，从比较原始像素值到更复杂的方法，例如梯度方向的直方图。

描述符帮助我们将不同图像中的相似关键点分配给彼此。如下图所示，一帧中的一组关键点被分配给另一帧中的关键点，使得它们各自描述符的相似性最大化，并且（理想情况下）这些关键点代表图像中的同一对象。除了最大化相似性之外，一个好的描述符还应该能够最小化不匹配的数量，即避免将不对应于同一对象的关键点分配给彼此。

![](http://127.0.0.1:8887/Part%2004-Module%2001-Lesson%2004_Tracking%20Image%20Features/img/new-group%20(2).jpg)

在我们详细介绍一类强大的检测器/描述符组合（即 BRISK 等二进制描述符）之前，让我们简要回顾一下有史以来最著名的描述符之一——尺度不变特征变换。我们这样做的原因有两个：首先，这种方法仍然适用，并在大量应用中使用。其次，我们需要打下一些基础，以便您能够更好地理解和欣赏二进制描述符的贡献。


##### HOG 描述符和 SIFT


在下文中，我们将简要介绍基于定向梯度直方图 (HOG) 的描述符族。HOG 背后的基本思想是通过在局部邻域中的强度梯度分布来描述对象的结构。为实现这一点，将图像划分为多个单元格，在这些单元格中计算梯度并将其收集在直方图中。然后将来自所有单元格的直方图集用作相似性度量，以唯一地标识图像块或对象。

HOG 家族最著名的例子之一是尺度不变特征变换 (SIFT)，由 David Lowe 于 1999 年引入。SIFT 方法包括关键点检测器和描述符，它遵循一个五步过程，下面简要概述。

1. 首先，使用一种称为“高斯拉普拉斯算子 (LoG)”的方法检测图像中的关键点，该方法基于二阶强度导数。LoG 应用于图像的各种比例级别，并且倾向于检测斑点而不是角点。除了独特的比例级别外，关键点还根据关键点周围局部邻域的强度梯度分配方向。
2. 其次，对于每个关键点，其周围区域通过移除方向进行转换，从而确保 *规范方向* 。此外，该区域的大小被调整为 16 x 16 像素，提供了一个标准化的补丁。

   山景图像材料取自 D. Lowe 的原始出版物。

   ![山景图像材料取自 D. Lowe 的原始出版物。](http://127.0.0.1:8887/Part%2004-Module%2001-Lesson%2004_Tracking%20Image%20Features/img/sift-1.jpg)
3. 第三，根据强度梯度 Ix 和 Iy 计算归一化块内每个像素的方向和大小。
4. 第四，规范化的补丁被分成 4 x 4 单元格的网格。在每个单元格中，超过幅度阈值的像素的方向被收集在由 8 个 bin 组成的直方图中。

![](http://127.0.0.1:8887/Part%2004-Module%2001-Lesson%2004_Tracking%20Image%20Features/img/sift-2.jpg)

![](http://127.0.0.1:8887/Part%2004-Module%2001-Lesson%2004_Tracking%20Image%20Features/img/sift-3.jpg)


5. 最后，将所有 16 个单元格的 8-bin 直方图连接成一个 128 维向量（描述符），用于唯一表示关键点。

SIFT 检测器/描述符即使在杂乱和部分遮挡的情况下也能够稳健地识别对象。它对比例的均匀变化、旋转、亮度和对比度的变化都是不变的，甚至对仿射失真也是部分不变的。

SIFT 的缺点是它的低速度，这阻止了它在智能手机等实时应用程序中的使用。HOG 家族的其他成员（例如 SURF 和 GLOH）已针对速度进行了优化。然而，它们的计算成本仍然太高，不应该用于实时应用程序。此外，SIFT 和 SURF 拥有大量专利，因此不能在商业环境中自由使用。为了在 OpenCV 中使用 SIFT，您必须 `#include <opencv2/xfeatures2d/nonfree.hpp>`，这进一步强调了这个问题。

一种比基于 HOG 的方法更快（且免费）的替代方法是二进制描述符系列，它提供了一种快速替代方法，但准确性和性能略差。让我们看看下一节中的内容。


二进制描述符和 BRISK

基于 HOG 的描述符的问题在于它们基于计算强度梯度，这是一个非常昂贵的操作。尽管有一些改进，例如 SURF，它使用积分图像代替，但这些方法不适合在处理能力有限的设备（例如智能手机）上进行实时应用。

二进制描述符的中心思想是仅依靠强度信息（即图像本身）并将关键点周围的信息编码为一串二进制数，当相应的关键点是搜索。目前，最流行的二进制描述符是 BRIEF、BRISK、ORB、FREAK 和 KAZE（都在 OpenCV 库中可用）。

从高层次的角度来看，二进制描述符由三个主要部分组成：

1. 一种 **采样模式** ，描述采样点在关键点位置周围的位置。
2. **一种方向补偿**方法，消除图像块围绕关键点位置旋转的影响。
3. **一种样本**对选择方法，它生成样本点对，这些样本点在强度值方面相互比较。如果第一个值大于第二个，我们将“1”写入二进制字符串，否则写入“0”。在对采样模式中的所有点对执行此操作后，将创建一个长二进制链（或“字符串”）（因此是该描述符类的系列名称）。

在下文中，“Binary Robust Invariant Scalable Keypoints (BRISK)”关键点检测器/描述符被用作二进制描述符族的代表。BRISK 由 Stefan Leutenegger 等人于 2011 年提出，是一种基于 FAST 的检测器，结合了二进制描述符，该描述符是通过对每个关键点邻域的专用采样检索到的强度比较创建的。

BRISK 的采样模式由多个采样点（蓝色）组成，其中每个采样点周围的同心环（红色）表示应用高斯平滑的区域。与 ORB 或 BRIEF 等其他一些二进制描述符相反，BRISK 采样模式是固定的。平滑对于避免混叠很重要（一种导致不同信号变得无法区分的效果 - 或者彼此混叠 - 在采样时）。

![](http://127.0.0.1:8887/Part%2004-Module%2001-Lesson%2004_Tracking%20Image%20Features/img/brisk-1.png)

在样本对选择过程中，BRISK 算法区分长距离和短距离对。长距离对（即样本模式上彼此之间距离最小的样本点）用于根据强度梯度估计图像块的方向，而短距离对用于强度比较，从中描述符字符串被组装。在数学上，这些对表示如下：

![](http://127.0.0.1:8887/Part%2004-Module%2001-Lesson%2004_Tracking%20Image%20Features/img/draggedimage%20(4).png)


首先，我们定义了样本点所有可能配对的集合 A。然后，我们从 A 中提取欧几里得距离高于预定义上阈值的子集 L。该集合是用于方向估计的长距离对。最后，我们从 A 中提取欧几里得距离低于下限阈值的那些对。该集合 S 包含用于组装二进制描述符字符串的短距离对。

下图显示了短对（左）和长对（右）采样模式上的两种距离对

![<span data-type=](http://127.0.0.1:8887/Part%2004-Module%2001-Lesson%2004_Tracking%20Image%20Features/img/new-group-1.jpg)\[基于此 [来源]（基于 https://www.cse.unr.edu/~bebis/CS491Y/Lectures/BRISK.pptx）\]" />

[基于此 [来源]（基于https://www.cse.unr.edu/~bebis/CS491Y/Lectures/BRISK.pptx）]

从长对中，关键点方向向量�⃗G的计算如下：

![](http://127.0.0.1:8887/Part%2004-Module%2001-Lesson%2004_Tracking%20Image%20Features/img/draggedimage-1%20(4).png)


首先，基于归一化的单位向量计算两个样本点之间的梯度强度，该单位向量给出了两个点之间的方向乘以两个点在各自尺度上的强度差。在（2）中，关键点方向向量�⃗G的然后根据所有梯度强度的总和计算。

基于�⃗G的，我们可以使用样本模式的方向来重新排列短距离配对，从而确保旋转不变性。基于旋转不变的短距离配对，最终的二进制描述符可以构造如下：

![](http://127.0.0.1:8887/Part%2004-Module%2001-Lesson%2004_Tracking%20Image%20Features/img/draggedimage-2%20(3).png)

从 g 计算出关键点的方向角后，我们用它来使短距离配对对旋转不变。然后，所有对之间的强度小号小号比较并用于组装我们可以用于匹配的二进制描述符。

![1682001768152](image/LearningNotes/1682001768152.png)

HOG 与二进制练习

在本节末尾的代码中，关键点和描述符是使用 BRISK 方法计算的。关键点检测和描述符计算的时间都打印到控制台。对于 BRISK 检测器，关键点如下图所示，圆心表示其位置，圆的大小反映特征尺度。

![img](http://127.0.0.1:8887/Part%2004-Module%2001-Lesson%2004_Tracking%20Image%20Features/img/draggedimage%20(1).png)

给定下面工作区中的代码 `describe_keypoints.cpp`，添加 SIFT 检测器/描述符，计算两个步骤的时间，并比较 BRISK 和 SIFT 的处理速度以及关键点的数量和视觉外观。

`cmake`使用和构建代码后 `make`，您可以使用可执行文件从虚拟桌面运行代码 `describe_keypoints`。

在下一节中，我们将详细了解 BRISK 的描述符部分。


##### 05.描述符匹配


描述符之间的距离

在上一节中，您了解到可以通过将关键点的局部邻域转换为捕获梯度或强度分布的独特特征的高维向量来描述关键点。在本节中，我们想看看几种计算两个描述符之间距离的方法，以便将它们之间的差异转换为一个数字，我们可以将其用作简单的相似性度量。

第一个距离函数是“绝对差之和 (SAD)”。正如您在下面的等式中看到的，SAD 将两个描述符向量作为输入��dA的和��db的. SAD 是通过从中的每个分量中减去来计算的��dA的中相同位置的相应组件��db的. 然后，将各个结果的绝对值相加。SAD 范数在文献中也称为 L1-范数。

第二个距离函数是“差平方和 (SSD)”，在计算两个描述符向量的各个分量之间的差异的意义上，它类似于 SAD。然而，SAD 和 SSD 之间的关键区别在于后者对平方差求和而不是对绝对差求和。在文献中，SSD范数也被称为L2范数。下图给出了这两种规范。

![](http://127.0.0.1:8887/Part%2004-Module%2001-Lesson%2004_Tracking%20Image%20Features/img/draggedimage%20(5).png)

有多种方法可以解释 SAD 和 SSD 之间的差异。一个有用的方法，因为我们希望保持这一方面的简短，是从几何角度看这两个规范。在下图中，考虑了一个二维特征空间。其中，有两个特征向量d1和d2，每个特征向量由一个(a,b)坐标对组成。

![](http://127.0.0.1:8887/Part%2004-Module%2001-Lesson%2004_Tracking%20Image%20Features/img/draggedimage-1%20(5).png)


两者之间的最短距离是一条直线。给定每个向量的两个分量，SAD 计算长度差之和，这是一个一维过程。另一方面，SSD 计算平方和，它遵循毕达哥拉斯定律。该定律说，在直角三角形中，直角的平方和等于斜边的平方。因此，就两个向量之间的几何距离而言，L2 范数是更准确的度量。请注意，相同的原理以相同的方式适用于高维描述符。

对于仅由 1 和 0 组成的二进制描述符，最好（也是最快）的度量是汉明距离，它通过使用异或函数计算两个向量之间的差异，如果两个位相同则返回零如果两位不同则为一。因此，所有 XOR 运算的总和就是两个描述符之间的不同位数。

这里的关键要点是您必须使距离度量适应您使用的描述符类型。在基于梯度的方法（如 SIFT）的情况下，L2 范数将是最合适的。在所有二进制描述符的情况下，应使用汉明距离。


查找匹配项

假设我们在一幅图像中有 N 个关键点及其相关描述符，在另一幅图像中有 M 个关键点。寻找对应对的最明显方法是将所有特征相互比较，即执行 N x M 比较。对于第一幅图像中的给定关键点，它获取第二幅图像中的每个关键点并计算距离。距离最小的关键点将被视为其对。这种方法称为蛮力匹配或最近邻匹配，在 OpenCV 中以名称 BFMatcher 提供。OpenCV 中的强力匹配的输出是一个关键点对列表，这些关键点对在所选距离函数下按其描述符的距离排序。

2014 年，David Lowe（SIFT 之父）和 Marius Muja 发布了一个名为“Fast library for approximate nearest neighbors”（FLANN）的开源库。FLANN 训练一个索引结构，用于遍历使用机器学习概念创建的潜在匹配候选对象。该库构建了一个非常有效的数据结构（KD 树）来搜索匹配对，避免了穷举法的穷举搜索。因此，它更快，同时结果仍然非常好，具体取决于匹配参数。由于基于 FLANN 的匹配需要一个全新的知识体系，其中几个概念与本课程的相关性有限，因此此处没有详细描述该方法。基于 FLANN 的匹配在 OpenCV 中可用，您将在下面的代码示例中再次看到它。在撰写本文时（2019 年 5 月），OpenCV 的当前实现中存在一个潜在的错误，需要将二进制描述符转换为浮点向量，效率低下。然而，速度仍然有所提高，尽管没有可能达到的那么大。

BFMatching 和 FLANN 都接受描述符距离阈值 T，该阈值用于将匹配的数量限制为“好”的匹配，并丢弃相应对不对应的匹配。相应的“好”对称为“真阳性 (TP)”，而不匹配称为“假阳性 (FP)”。为T选择合适的值的任务是允许尽可能多的TP匹配，而应尽可能避免FP匹配。根据图像内容和相应的检测器/描述符组合，必须找到 TP 和 FP 之间的权衡，以合理地平衡 TP 和 FP 之间的比率。下图显示了 TP 和 FP 在 SSD 上的两种分布，以说明阈值选择。

![](http://127.0.0.1:8887/Part%2004-Module%2001-Lesson%2004_Tracking%20Image%20Features/img/draggedimage-2%20(4).png)

第一个阈值 T1 被设置为两个特征之间的最大允许 SSD，其方式是选择一些真阳性匹配，同时几乎完全避免假阳性匹配。但是，大多数 TP 匹配项也会被此设置丢弃。通过将匹配阈值提高到 T2，选择了更多的 TP 匹配，但 FP 匹配的数量也显着增加。在实践中，几乎从未发现 TP 和 FP 的清晰简洁的分离，因此，设置匹配阈值始终是平衡“好”与“坏”匹配之间的折衷。虽然在大多数情况下无法避免 FP 匹配，但我们的目标始终是尽可能降低它们的数量。下面介绍实现此目的的两种策略。


选择匹配项

只要不超过选定的阈值 T，蛮力匹配将始终返回与第一幅图像中的关键点的匹配，即使第二幅图像中不存在该关键点。这不可避免地导致许多错误匹配。一种抵消这种情况的策略称为交叉检查匹配，它通过在两个方向上应用匹配过程并仅保留那些在一个方向上的最佳匹配等于另一个方向上的最佳匹配的匹配来工作。交叉检查方法的步骤是：

1. 对于源图像中的每个描述符，在参考图像中找到一个或多个最佳匹配。
2. 切换源图像和参考图像的顺序。
3. 从步骤 1 开始重复源图像和参考图像之间的匹配过程。
4. 选择那些描述符在两个方向上最匹配的关键点对。

尽管交叉检查匹配会增加处理时间，但它通常会删除大量错误匹配，因此在准确性高于速度时应始终执行。

降低误报数量的一种非常有效的方法是计算每个关键点的 *最近邻距离比* 。这种方法最初是由 D. Lowe 在 1999 年关于 SIFT 的论文中提出的。主要思想是不直接在 SSD 上应用阈值。相反，对于源图像中的每个关键点，两个最佳匹配位于参考图像中，并计算描述符距离之间的比率。然后，将阈值应用于该比率以筛选出不明确的匹配项。下图说明了原理。

![](http://127.0.0.1:8887/Part%2004-Module%2001-Lesson%2004_Tracking%20Image%20Features/img/draggedimage-3%20(3).png)


在示例中，将具有关联描述符 da 的图像块与其他两个具有描述符的图像块进行比较��1个db1个的的和��2个db2个的的. 可以看出，这些补丁看起来非常相似，会导致模棱两可，从而导致不可靠的匹配。通过计算最佳和次佳匹配之间的 SSD 比率，可以过滤掉这种较弱的候选者。

在实践中，0.8 的阈值已被证明可以在 TP 和 FP 之间提供良好的平衡。在原始 SIFT 论文中检查的图像序列中，使用此设置消除了 90% 的错误匹配，同时丢失了不到 5% 的正确匹配。


##### 练习：描述符之间的距离


在下面的代码示例中，一组二进制 BRISK 描述符被预加载并使用本节前面描述的强力方法进行匹配。请注意，出于教育目的，匹配的数量仅限于 100 个最佳候选，因为在将减少数量的关键点对绘制为叠加层时，更容易从视觉上发现不匹配。请注意，一旦计算出匹配，该函数就可以设置为最近邻（仅保留最佳匹配）或 k 最近邻选择（保留每个关键点的最佳 k 匹配）。

在我们进一步了解如何在本节下方进一步估计关键点和描述符的性能之前，请使用下面的桌面工作区完成以下任务：

1. 加载“BRISK_small”数据集，首先关闭交叉检查，然后再打开。查看可视化的关键点匹配和匹配对的数量并描述您的结果。
2. 添加 k = 2 的 k 最近邻匹配（使用 `cv::knnMatch`）并实现上述描述符距离比以过滤掉阈值设置为 0.8 的模糊匹配。可视化结果，计算丢弃匹配项的百分比（对于“BRISK_small”和“BRISK_large”数据集）并描述您的观察结果。
3. 在“BRISK_large”数据集和 SIFT 数据集上同时使用 BF 匹配和 FLANN 匹配，并描述您的观察结果。

本练习的代码在文件中 `descriptor_matching.cpp`，在使用 `cmake`和构建后 `make`，您可以使用可执行文件运行代码 `descriptor_matching`。


评估匹配性能

存在大量的检测器和描述符类型，基于要解决的问题，必须根据关键点的准确性或匹配对的数量等要求选择合适的算法对。下面概述了最常见的措施。

真 *阳性率 (TPR)* 是已正确匹配的关键点（真阳性 - TP）与所有潜在匹配的总和之间的比率，包括检测器/描述符遗漏的关键点（假阴性 - FN）。完美匹配器的 TPR 为 1.0，因为不会有错误匹配。在文献中，TPR 也称为 *召回率* ，可用于量化实际找到的可能正确匹配项的数量。

 *误报率 (FPR)* 是错误匹配的关键点（误报 - FP）与本应没有匹配的所有特征的总和之间的比率。完美匹配器的 FPR 为 0.0。FPR 也称为 *误报率* ，描述了检测器/描述符选择错误关键点对的可能性。

匹配器的精度是正确匹配的关键点 (TP) 的数量除以所有匹配的数量 *。* 此度量也称为 *异常率* 。

下表概述了刚刚推出的一些措施。

![](http://127.0.0.1:8887/Part%2004-Module%2001-Lesson%2004_Tracking%20Image%20Features/img/draggedimage-4%20(3).png)


为了判断匹配或不匹配是否正确，需要用于评估的图像材料的地面真实信息。在许多出版物中，已使用图像序列，其中所有关键点都位于平面上。在这种情况下，可以使用基于模型的估计来区分 TP/TN 和 FP/FN。对于我们在本课程中使用的图像序列，这种方法不能使用，因为“我们的”关键点分布在复杂的三维场景中，其中对象动态移动，运动参数未知。但是，我们可以使用文献中的大量可用比较并将结果迁移到我们的应用场景中。在本节末尾，将显示一小部分此类结果。

接收 *器操作特性 (ROC)* 是一个图形图，显示检测器/描述符在其辨别阈值变化时能够区分真假匹配的能力。ROC 可用于直观地比较不同的检测器/描述符，并为每个检测器/描述符选择合适的区分阈值。ROC 的名称可以追溯到第二次世界大战，当时雷达操作员在识别敌方目标的背景下引入了该方法。

下图显示了如何通过改变 SSD 上的辨别阈值，根据真阳性和假阳性的分布构建 ROC。理想的检测器/描述符的 TPR 为 1.0，而 FPR 将同时接近 0.0。

![](http://127.0.0.1:8887/Part%2004-Module%2001-Lesson%2004_Tracking%20Image%20Features/img/draggedimage-5%20(2).png)

在下图中，显示了好坏检测器/描述符的两个示例。在第一个示例中，无法安全地区分 TP 和 FP，因为两条曲线都匹配，并且区分阈值的变化会以相同的方式影响它们。在第二个示例中，TP 和 FP 曲线没有明显重叠，因此可以选择合适的鉴别器阈值。

![](http://127.0.0.1:8887/Part%2004-Module%2001-Lesson%2004_Tracking%20Image%20Features/img/draggedimage-6%20(3).png)


还有其他几种评估检测器和描述符的方法，例如我们不会在本课程中讨论的 *Precision-Recall 曲线，* 以便专注于未来的任务 - 这是我们的防撞系统的开发。

作为本节的总结，给出了结果的概述，其中对几个描述符进行了相互比较，当必须为应用程序选择检测器/描述符时，可以使用这些描述符来促进选择过程。在图中，您可以看到不同描述符（例如 SIFT、BRISK 和其他几个描述符）的 ROC 曲线，并直观地将它们相互比较。请注意，这些结果仅对实际用于比较的图像序列有效——对于不同的图像集，例如交通场景，结果可能会有很大差异。

![<span data-type=](http://127.0.0.1:8887/Part%2004-Module%2001-Lesson%2004_Tracking%20Image%20Features/img/results1.png)\[来源\]" />

- 关键点
- 描述符
- 匹配方法
- 评估匹配结果方法


##### 06.跨图像跟踪对象



### 基于摄像头的 2D 特征跟踪
